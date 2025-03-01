"use client";

import React from "react";
import { TextField, Box } from "@mui/material";
import ReactMarkdown from "react-markdown";

export default function MarkdownEditor({ content, setContent }) {
  return (
    <Box sx={{ mt: 2 }}>
      <TextField fullWidth multiline rows={6} value={content} onChange={(e) => setContent(e.target.value)} />
      <Box sx={{ mt: 2, padding: 2, border: "1px solid #ccc", borderRadius: 2 }}>
        <ReactMarkdown>{content}</ReactMarkdown>
      </Box>
    </Box>
  );
}
