"use client";
import { TextField, Box } from "@mui/material";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
export default function MarkdownEditor({ content, setContent, disabled = false }: {
  content: string; setContent: (value: string) => void; disabled?: boolean;
}) {
  return <Box sx={{ mt: 2 }}>
    <TextField label="Markdown content" fullWidth multiline rows={12} value={content} disabled={disabled} onChange={event => setContent(event.target.value)} />
    <Box sx={{ mt: 2 }}><ReactMarkdown remarkPlugins={[remarkGfm]}>{content}</ReactMarkdown></Box>
  </Box>;
}
