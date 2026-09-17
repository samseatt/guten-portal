"use client";
import { useCallback, useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import api from "@/lib/api";
import { Page, errorMessage } from "@/lib/content";
import OrderButtons from "@/components/OrderButtons";
import PageForm from "./PageForm";
import { Alert, Button, Typography, Box, List, ListItem, ListItemText, IconButton } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
export default function PagesList() {
  const { site_name, section_name } = useParams<{ site_name: string; section_name: string }>();
  const router = useRouter();
  const [pages, setPages] = useState<Page[]>([]);
  const [busy, setBusy] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const path = `/sites/${encodeURIComponent(site_name)}/sections/${encodeURIComponent(section_name)}`;
  const load = useCallback(async () => {
    const { data } = await api.get<Page[]>("/pages", { params: { site: site_name, section: section_name } });
    setPages(data);
  }, [site_name, section_name]);
  useEffect(() => { setLoading(true); load().catch(e => setError(errorMessage(e))).finally(() => setLoading(false)); }, [load]);
  const disabled = busy || loading;
  async function save(action: () => Promise<unknown>, message: string) {
    setBusy(true); setError(""); setNotice("");
    try { await action(); await load(); setNotice(message); return true; }
    catch (e) { setError(errorMessage(e)); try { await load(); } catch { /* Preserve action error. */ } return false; }
    finally { setBusy(false); }
  }
  async function move(index: number, direction: -1 | 1) {
    const ids = pages.map(page => page.id);
    const expected_ids = [...ids];
    [ids[index], ids[index + direction]] = [ids[index + direction], ids[index]];
    await save(() => api.put(`${path}/pages/order`, { ids, expected_ids }), "Page order saved.");
  }
  return <Box sx={{ p: 3 }}>
    <Button startIcon={<ArrowBackIcon />} onClick={() => router.push(`/sites/${encodeURIComponent(site_name)}/sections`)}>Back to Sections</Button>
    <Typography variant="h4" sx={{ my: 2 }}>Manage Pages in {section_name}</Typography>
    <Typography color="text.secondary">Use the arrows to set sidebar order. Changes save immediately.</Typography>
    {error && <Alert severity="error" sx={{ my: 2 }}>{error}</Alert>}
    {notice && <Alert severity="success" sx={{ my: 2 }}>{notice}</Alert>}
    {loading && <Typography role="status">Loading pages…</Typography>}
    {!loading && !pages.length && <Typography sx={{ my: 2 }}>No pages yet.</Typography>}
    <List>{pages.map((page,index) => <ListItem key={page.id} sx={{ flexWrap: "wrap", gap: 1 }}>
      <ListItemText primary={`${index + 1}. ${page.title}`} secondary={page.name} />
      <Box>
        <OrderButtons label={page.title} index={index} count={pages.length} disabled={disabled} onMove={direction => { void move(index,direction); }} />
        <IconButton disabled={disabled} aria-label={`Edit ${page.title}`} onClick={() => router.push(`${path}/pages/${encodeURIComponent(page.name)}`)}><EditIcon /></IconButton>
        <IconButton disabled={disabled} aria-label={`Delete ${page.title}`} onClick={() => { if(window.confirm(`Delete ${page.title}?`)) void save(() => api.delete(`/pages/${page.id}`), "Page deleted."); }}><DeleteIcon /></IconButton>
      </Box>
    </ListItem>)}</List>
    <PageForm disabled={disabled} onCreate={page => save(() => api.post("/pages", { ...page, site_name, section_name }), "Page created.")} />
  </Box>;
}
