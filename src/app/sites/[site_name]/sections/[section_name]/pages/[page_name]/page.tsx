"use client";

import React, { useState, useEffect } from "react";
import axios from "@/lib/axios";
import { useParams, useRouter } from "next/navigation";
import { Box, Typography, TextField, Button } from "@mui/material";
import RefList from "@/components/RefList";
import NoteList from "@/components/NoteList";
import ReactMarkdown from "react-markdown";
import remarkGfm from 'remark-gfm'; // Import GitHub Flavored Markdown
import ArrowBackIcon from "@mui/icons-material/ArrowBack";

export default function EditPage() {
  const { site_name, section_name, page_name } = useParams();
  const [page, setPage] = useState(null);
  const [updatedPage, setUpdatedPage] = useState({
    title: "",
    primary_image: "",
    abstract: "",
    content: "",
  });
  const router = useRouter();

  useEffect(() => {
    async function fetchPage() {
      try {
        const response = await axios.get(`/guten/pages/${page_name}?site=${site_name}&section=${section_name}`);
        setPage(response.data);
        setUpdatedPage(response.data);
      } catch (error) {
        console.error("Error fetching page:", error);
      }
    }
    fetchPage();
  }, [site_name, section_name, page_name]);

  const handleUpdate = async () => {
    await axios.put(`/guten/pages/${page_name}`, { ...updatedPage, site_name, section_name });
    alert(`Page '${site_name}' updated successfully!`);
    window.location.reload();
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

      <TextField fullWidth label="Title" value={updatedPage.title} onChange={(e) => setUpdatedPage({ ...updatedPage, title: e.target.value })} sx={{ mt: 2 }} />
      <TextField fullWidth label="Image URL" value={updatedPage.primary_image} onChange={(e) => setUpdatedPage({ ...updatedPage, primary_image: e.target.value })} sx={{ mt: 2 }} />
      <TextField fullWidth multiline rows={2} label="Abstract" value={updatedPage.abstract} onChange={(e) => setUpdatedPage({ ...updatedPage, abstract: e.target.value })} sx={{ mt: 2 }} />
      <TextField fullWidth multiline rows={6} label="Content (Markdown)" value={updatedPage.content} onChange={(e) => setUpdatedPage({ ...updatedPage, content: e.target.value })} sx={{ mt: 2 }} />

      <Typography variant="body1" sx={{ mt: 2 }}>Preview:</Typography>
      <Box sx={{ border: "1px solid #ddd", p: 2, mt: 1, bgcolor: "#f9f9f9" }}>
        <ReactMarkdown remarkPlugins={[remarkGfm]}>{updatedPage.content}</ReactMarkdown>
      </Box>

      <Button variant="contained" sx={{ mt: 2 }} onClick={handleUpdate}>
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
