"use client";

import { FormEvent, useCallback, useEffect, useState } from "react";
import { Alert, Box, Button, Dialog, DialogActions, DialogContent, DialogTitle, IconButton, List, ListItem, Stack, TextField, Typography } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import ReactMarkdown from "react-markdown";
import api from "@/lib/axios";
import { errorMessage } from "@/lib/content";

export interface EditorialScope { site_name: string; section_name: string; page_name: string; }
interface Item { id: number; url?: string; description?: string | null; note?: string; }
const empty = { url: "", description: "", note: "" };

export default function EditorialList({ kind, site_name, section_name, page_name }: EditorialScope & { kind: "refs" | "notes" }) {
  const reference = kind === "refs";
  const label = reference ? "Reference" : "Note";
  const [items, setItems] = useState<Item[]>([]);
  const [fields, setFields] = useState(empty);
  const [editing, setEditing] = useState<number | null>(null);
  const [deleting, setDeleting] = useState<Item | null>(null);
  const [loading, setLoading] = useState(true);
  const [loaded, setLoaded] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const endpoint = `/guten/${kind}`;
  const disabled = loading || busy || !loaded;

  const load = useCallback(async (signal?: AbortSignal) => {
    setLoading(true);
    setError("");
    try {
      const { data } = await api.get<Item[]>(endpoint, {
        params: { site: site_name, section: section_name, page: page_name }, signal, timeout: 15000,
      });
      if (!signal?.aborted) { setItems(data); setLoaded(true); }
    } catch (error) {
      if (!signal?.aborted) { setError(`Could not load ${kind === "refs" ? "references" : "notes"}. ${errorMessage(error)}`); setLoaded(false); }
    } finally {
      if (!signal?.aborted) setLoading(false);
    }
  }, [endpoint, kind, site_name, section_name, page_name]);

  useEffect(() => {
    const controller = new AbortController();
    void load(controller.signal);
    return () => controller.abort();
  }, [load]);

  function reset() { setEditing(null); setFields(empty); }

  async function save(event: FormEvent) {
    event.preventDefault();
    if (disabled) return;
    setError(""); setNotice("");
    if (reference) {
      try {
        const url = new URL(fields.url.trim());
        if (!["http:", "https:"].includes(url.protocol) || fields.url.trim().length > 255) throw new Error();
      } catch {
        setError("Enter an HTTP or HTTPS URL of at most 255 characters."); return;
      }
    } else if (!fields.note.trim()) { setError("Note must not be empty."); return; }
    setBusy(true);
    const scope = { site_name, section_name, page_name };
    const body = reference ? { ...scope, url: fields.url.trim(), description: fields.description }
      : { ...scope, note: fields.note };
    try {
      const { data } = editing === null
        ? await api.post<Item>(endpoint, body, { timeout: 15000 })
        : await api.put<Item>(`${endpoint}/${editing}`, body, { timeout: 15000 });
      setItems(current => editing === null ? [...current, data] : current.map(item => item.id === editing ? data : item));
      setNotice(`${label} ${editing === null ? "added" : "updated"}.`);
      reset();
    } catch (error) { setError(errorMessage(error)); }
    finally { setBusy(false); }
  }

  async function remove() {
    if (!deleting || disabled) return;
    setBusy(true); setError(""); setNotice("");
    try {
      await api.delete(`${endpoint}/${deleting.id}`, {
        params: { site: site_name, section: section_name, page: page_name }, timeout: 15000,
      });
      setItems(current => current.filter(item => item.id !== deleting.id));
      if (editing === deleting.id) reset();
      setNotice(`${label} deleted.`);
    } catch (error) { setError(errorMessage(error)); }
    finally { setBusy(false); setDeleting(null); }
  }

  return (
    <Box component="section" aria-label={reference ? "References" : "Notes"} sx={{ mt: 4 }}>
      <Typography variant="h6">{reference ? "References" : "Notes"}</Typography>
      <Typography variant="body2" color="text.secondary">{reference ? "Editorial links for this page." : "Editorial notes for this page; Markdown is supported."} These are not displayed in View Draft or Sites yet.</Typography>
      {error && <Alert severity="error" sx={{ mt: 2 }}>{error}</Alert>}
      {notice && <Alert severity="success" sx={{ mt: 2 }}>{notice}</Alert>}
      {loading && <Typography role="status">Loading…</Typography>}
      {!loading && !loaded && <Button onClick={() => void load()}>Retry loading {reference ? "references" : "notes"}</Button>}
      {loaded && !loading && items.length === 0 && <Typography sx={{ mt: 2 }}>No {reference ? "references" : "notes"} yet.</Typography>}
      <List>
        {items.map((item, index) => (
          <ListItem key={item.id} divider sx={{ alignItems: "flex-start", gap: 1 }}>
            <Box sx={{ flex: 1, minWidth: 0, overflowWrap: "anywhere" }}>
              {reference ? <><Typography>{item.description || "Untitled reference"}</Typography><Typography variant="body2">{item.url}</Typography></>
                : <ReactMarkdown>{item.note || ""}</ReactMarkdown>}
            </Box>
            <IconButton aria-label={`Edit ${label.toLowerCase()} ${index + 1}`} disabled={disabled} onClick={() => {
              setEditing(item.id); setFields({ url: item.url || "", description: item.description || "", note: item.note || "" }); setError(""); setNotice("");
            }}><EditIcon /></IconButton>
            <IconButton aria-label={`Delete ${label.toLowerCase()} ${index + 1}`} disabled={disabled} onClick={() => setDeleting(item)}><DeleteIcon /></IconButton>
          </ListItem>
        ))}
      </List>
      <Box component="form" onSubmit={save}>
        {reference ? <>
          <TextField fullWidth label="Reference description (optional)" value={fields.description} disabled={disabled} onChange={e => setFields({ ...fields, description: e.target.value })} sx={{ mt: 2 }} />
          <TextField fullWidth required label="Reference URL" helperText="HTTP or HTTPS, up to 255 characters" value={fields.url} disabled={disabled} onChange={e => setFields({ ...fields, url: e.target.value })} sx={{ mt: 2 }} />
        </> : <TextField fullWidth required multiline rows={4} label="Note (Markdown)" value={fields.note} disabled={disabled} onChange={e => setFields({ ...fields, note: e.target.value })} sx={{ mt: 2 }} />}
        <Stack direction="row" spacing={2} sx={{ mt: 2 }}>
          <Button variant="contained" type="submit" disabled={disabled}>{editing === null ? "Add" : "Update"} {label}</Button>
          {editing !== null && <Button disabled={busy} onClick={() => { reset(); setError(""); }}>Cancel {label} Edit</Button>}
        </Stack>
      </Box>
      <Dialog open={deleting !== null} onClose={() => { if (!busy) setDeleting(null); }} aria-labelledby={`${kind}-delete-title`}>
        <DialogTitle id={`${kind}-delete-title`}>Delete {label.toLowerCase()}?</DialogTitle>
        <DialogContent>This removes the {label.toLowerCase()} from this page.</DialogContent>
        <DialogActions>
          <Button disabled={busy} onClick={() => setDeleting(null)}>Cancel</Button>
          <Button color="error" disabled={busy} onClick={() => void remove()}>Delete {label}</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
