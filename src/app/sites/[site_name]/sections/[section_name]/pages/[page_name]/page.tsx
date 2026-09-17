"use client";

import React, { useState, useEffect } from "react";
import axios from "@/lib/axios";
import { useParams, useRouter } from "next/navigation";
import { Box, Typography, TextField, Button, Alert } from "@mui/material";
import { errorMessage } from "@/lib/content";
import RefList from "@/components/RefList";
import NoteList from "@/components/NoteList";
import ReactMarkdown from "react-markdown";
import remarkGfm from 'remark-gfm'; // Import GitHub Flavored Markdown
import ArrowBackIcon from "@mui/icons-material/ArrowBack";

export default function EditPage() {
  const { site_name, section_name, page_name } = useParams<{ site_name: string; section_name: string; page_name: string }>();
  const [page, setPage] = useState(false);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [saving, setSaving] = useState(false);
  const [updatedPage, setUpdatedPage] = useState({
    title: "",
    primary_image: "",
    abstract: "",
    content: "",
  });
  const router = useRouter();

  useEffect(() => {
    const controller = new AbortController();
    setPage(false); setError(""); setNotice("");
    async function fetchPage() {
      try {
        const response = await axios.get(`/guten/pages/${encodeURIComponent(page_name)}`, {
          params: { site: site_name, section: section_name }, signal: controller.signal, timeout: 15000,
        });
        if (controller.signal.aborted) return;
        setPage(true);
        const data = response.data;
        setUpdatedPage({ title: data.title, primary_image: data.primary_image || "", abstract: data.abstract || "", content: data.content || "" });
      } catch (error) {
        if (!controller.signal.aborted) setError(errorMessage(error));
      }
    }
    void fetchPage();
    return () => controller.abort();
  }, [site_name, section_name, page_name]);

  const handleUpdate = async () => {
    setSaving(true); setError(""); setNotice("");
    try {
      await axios.put(`/guten/pages/${encodeURIComponent(page_name)}`, { ...updatedPage, name: page_name, site_name, section_name }, { timeout: 15000 });
      setNotice("Page saved.");
    } catch (error) { setError(errorMessage(error)); }
    finally { setSaving(false); }
  };

  return (
    <Box sx={{ padding: 3 }}>
    <Button
        startIcon={<ArrowBackIcon />}
        onClick={() => router.push(`/sites/${site_name}/sections/${section_name}/pages`)}
        sx={{ mb: 2 }}
    >
        Back to Pages List
    </Button>
      <Typography variant="h6">Edit Page: {page_name}</Typography>
      {error && <Alert severity="error">{error}</Alert>}
      {notice && <Alert severity="success">{notice}</Alert>}

      <TextField disabled={!page || saving} fullWidth label="Title" value={updatedPage.title} onChange={(e) => setUpdatedPage({ ...updatedPage, title: e.target.value })} sx={{ mt: 2 }} />
      <TextField disabled={!page || saving} fullWidth label="Image URL" value={updatedPage.primary_image} onChange={(e) => setUpdatedPage({ ...updatedPage, primary_image: e.target.value })} sx={{ mt: 2 }} />
      <TextField disabled={!page || saving} fullWidth multiline rows={2} label="Abstract" value={updatedPage.abstract} onChange={(e) => setUpdatedPage({ ...updatedPage, abstract: e.target.value })} sx={{ mt: 2 }} />
      <TextField disabled={!page || saving} fullWidth multiline rows={6} label="Content (Markdown)" value={updatedPage.content} onChange={(e) => setUpdatedPage({ ...updatedPage, content: e.target.value })} sx={{ mt: 2 }} />

      <Typography variant="body1" sx={{ mt: 2 }}>Preview:</Typography>
      <Box sx={{ border: "1px solid #ddd", p: 2, mt: 1, bgcolor: "#f9f9f9" }}>
        <ReactMarkdown remarkPlugins={[remarkGfm]}>{updatedPage.content}</ReactMarkdown>
      </Box>

      <Button variant="contained" sx={{ mt: 2 }} disabled={!page || saving} onClick={handleUpdate}>
        Save Changes
      </Button>

      {/* Show references & notes only when editing a specific page */}
      {page && (
        <>
          <RefList site_name={site_name} section_name={section_name} page_name={page_name} />
          <NoteList site_name={site_name} section_name={section_name} page_name={page_name} />
        </>
      )}
    </Box>
  );
}
