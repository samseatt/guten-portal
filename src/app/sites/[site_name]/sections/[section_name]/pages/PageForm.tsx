"use client";

import React, { useState } from "react";
import axios from "@/lib/axios";
import { TextField, Button, Box, Typography, Select, MenuItem } from "@mui/material";
import MarkdownEditor from "./MarkdownEditor";

export default function PageForm({ site_name, section_name }) {
  const [pageData, setPageData] = useState({
    name: "",
    title: "",
    template: "default",
    image: "",
    abstract: "",
    content: "",
  });

  const handleChange = (e) => {
    setPageData({ ...pageData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post("/guten/pages", {
        site_name,
        section_name,
        ...pageData,
      });
      alert("Page created successfully!");
    } catch (error) {
      console.error("Error creating page:", error);
    }
  };

  return (
    <Box sx={{ mt: 3 }}>
      <Typography variant="h5">Create a New Page</Typography>
      <form onSubmit={handleSubmit}>
        <TextField fullWidth name="name" label="Page Name" onChange={handleChange} sx={{ mt: 2 }} />
        <TextField fullWidth name="title" label="Title" onChange={handleChange} sx={{ mt: 2 }} />
        <Select fullWidth name="template" value={pageData.template} onChange={handleChange} sx={{ mt: 2 }}>
          <MenuItem value="default">Default</MenuItem>
          <MenuItem value="minimal">Minimal</MenuItem>
        </Select>
        <TextField fullWidth name="image" label="Image URL" onChange={handleChange} sx={{ mt: 2 }} />
        <TextField fullWidth multiline rows={2} name="abstract" label="Abstract" onChange={handleChange} sx={{ mt: 2 }} />
        <MarkdownEditor content={pageData.content} setContent={(content) => setPageData({ ...pageData, content })} />
        <Button type="submit" variant="contained" sx={{ mt: 3 }}>Save Page</Button>
      </form>
    </Box>
  );
}
