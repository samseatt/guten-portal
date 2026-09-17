"use client";
import { useState } from "react";
import { TextField, Button, Box, Typography } from "@mui/material";
import { PageInput } from "@/lib/content";
import MarkdownEditor from "./MarkdownEditor";
const empty: PageInput = { name: "", title: "", primary_image: "", abstract: "", content: "" };
export default function PageForm({ disabled, onCreate }: { disabled: boolean; onCreate: (page: PageInput) => Promise<boolean> }) {
  const [data, setData] = useState(empty);
  async function submit(event: React.FormEvent) {
    event.preventDefault();
    if (await onCreate(data)) setData(empty);
  }
  return <Box component="form" onSubmit={submit} sx={{ mt: 3 }}>
    <Typography variant="h5">Create a New Page</Typography>
    {(["name", "title", "primary_image", "abstract"] as const).map(key => <TextField key={key} fullWidth disabled={disabled} required={key === "name" || key === "title"} label={key === "primary_image" ? "Image URL" : key} value={data[key]} onChange={event => setData({ ...data, [key]: event.target.value })} sx={{ mt: 2 }} />)}
    <MarkdownEditor disabled={disabled} content={data.content} setContent={content => setData({ ...data, content })} />
    <Button type="submit" disabled={disabled} variant="contained" sx={{ mt: 3 }}>Save Page</Button>
  </Box>;
}
