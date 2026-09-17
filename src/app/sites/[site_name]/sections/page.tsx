"use client";
import { useCallback, useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import api from "@/lib/api";
import { Section, errorMessage } from "@/lib/content";
import OrderButtons from "@/components/OrderButtons";
import { Alert, Container, Typography, Button, TextField, List, ListItem, ListItemText, IconButton, Box } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import ListAltIcon from "@mui/icons-material/ListAlt";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";

const empty = { name: "", label: "", title: "" };
export default function SectionsPage() {
  const { site_name } = useParams<{ site_name: string }>();
  const router = useRouter();
  const [sections, setSections] = useState<Section[]>([]);
  const [form, setForm] = useState(empty);
  const [editing, setEditing] = useState<number | null>(null);
  const [busy, setBusy] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const load = useCallback(async () => {
    const { data } = await api.get<Section[]>("/sections", { params: { site: site_name } });
    setSections(data);
  }, [site_name]);
  useEffect(() => {
    setLoading(true);
    load().catch(e => setError(errorMessage(e))).finally(() => setLoading(false));
  }, [load]);
  const disabled = loading || busy;
  async function save(action: () => Promise<unknown>, message: string) {
    setBusy(true); setError(""); setNotice("");
    try {
      await action(); await load(); setNotice(message); return true;
    } catch (e) {
      setError(errorMessage(e));
      try { await load(); } catch { /* Keep the original action error visible. */ }
      return false;
    } finally { setBusy(false); }
  }
  async function move(index: number, direction: -1 | 1) {
    const ids = sections.map(section => section.id);
    const expected_ids = [...ids];
    [ids[index], ids[index + direction]] = [ids[index + direction], ids[index]];
    await save(() => api.put(`/sites/${encodeURIComponent(site_name)}/sections/order`, { ids, expected_ids }), "Section order saved.");
  }
  async function submit(event: React.FormEvent) {
    event.preventDefault();
    if (await save(() => editing === null ? api.post("/sections", { ...form, site_name }) : api.put(`/sections/${editing}`, form), "Section saved.")) {
      setEditing(null); setForm(empty);
    }
  }
  return <Container maxWidth="md" sx={{ py: 3 }}>
    <Button startIcon={<ArrowBackIcon />} onClick={() => router.push("/dashboard")}>Back to Dashboard</Button>
    <Typography variant="h4" sx={{ my: 2 }}>Manage Sections for {site_name}</Typography>
    <Typography color="text.secondary">Use the arrows to set navigation order. Changes save immediately.</Typography>
    {error && <Alert severity="error" sx={{ my: 2 }}>{error}</Alert>}
    {notice && <Alert severity="success" sx={{ my: 2 }}>{notice}</Alert>}
    {loading && <Typography role="status">Loading sections…</Typography>}
    {!loading && !sections.length && <Typography sx={{ my: 2 }}>No sections yet.</Typography>}
    <List>{sections.map((section, index) => <ListItem key={section.id} sx={{ flexWrap: "wrap", gap: 1 }}>
      <ListItemText primary={`${index + 1}. ${section.title}`} secondary={section.name} />
      <Box>
        <OrderButtons label={section.title} index={index} count={sections.length} disabled={disabled} onMove={direction => { void move(index, direction); }} />
        <IconButton aria-label={`Manage pages in ${section.title}`} disabled={disabled} onClick={() => router.push(`/sites/${encodeURIComponent(site_name)}/sections/${encodeURIComponent(section.name)}/pages`)}><ListAltIcon /></IconButton>
        <IconButton aria-label={`Edit ${section.title}`} disabled={disabled} onClick={() => { setEditing(section.id); setForm({ name: section.name, label: section.label ?? "", title: section.title }); }}><EditIcon /></IconButton>
        <IconButton aria-label={`Delete ${section.title}`} disabled={disabled} onClick={() => { if (window.confirm(`Delete ${section.title} and its pages?`)) void save(() => api.delete(`/sections/${section.id}`), "Section deleted.").then(ok => { if(ok && editing === section.id) { setEditing(null); setForm(empty); } }); }}><DeleteIcon /></IconButton>
      </Box>
    </ListItem>)}</List>
    <Box component="form" onSubmit={submit} sx={{ mt: 3 }}>
      <Typography variant="h6">{editing === null ? "Add Section" : "Edit Section"}</Typography>
      {(["name", "label", "title"] as const).map(key => <TextField key={key} label={`Section ${key}`} fullWidth required={key !== "label"} disabled={disabled} margin="normal" value={form[key]} onChange={e => setForm({ ...form, [key]: e.target.value })} />)}
      <Button type="submit" variant="contained" disabled={disabled}>{editing === null ? "Create Section" : "Update Section"}</Button>
      {editing !== null && <Button disabled={disabled} onClick={() => { setEditing(null); setForm(empty); }}>Cancel</Button>}
    </Box>
  </Container>;
}
