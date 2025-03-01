"use client";

import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import axios from "@/lib/axios";
import PageForm from "./PageForm";
// import RefList from "./RefList";
// import NoteList from "./NoteList";
import { Button, Typography, Box, CircularProgress, TextField, List, ListItem, ListItemText, IconButton } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { Checkbox, FormControlLabel } from "@mui/material";

export default function PagesList() {
    const { site_name, section_name } = useParams();
    const router = useRouter();
    const [pages, setPages] = useState([]);
    const [newPage, setNewPage] = useState({ name: "", title: "" });
  
    useEffect(() => {
      async function fetchPages() {
        try {
          const response = await axios.get(`/guten/pages?site=${site_name}&section=${section_name}`);
          setPages(response.data);
        } catch (error) {
          console.error("Error fetching pages:", error);
        }
      }
      fetchPages();
    }, [site_name, section_name]);
  
    const handleAddPage = async () => {
      await axios.post("/guten/pages", { ...newPage, site_name, section_name });
      setNewPage({ name: "", title: "" });
      window.location.reload();
    };
  
    const handleDeletePage = async (id) => {
      await axios.delete(`/guten/pages/${id}`);
      window.location.reload();
    };
       
// export default function PageManager() {
//   const { site_name, section_name } = useParams();
//   const [pages, setPages] = useState([]);
//   const [loading, setLoading] = useState(true);

//   // Fetch all pages in this section
//   useEffect(() => {
//     async function fetchPages() {
//       try {
//         const response = await axios.get(`/guten/pages?site=${site_name}&section=${section_name}`);
//         setPages(response.data);
//       } catch (error) {
//         console.error("Error fetching pages:", error);
//       } finally {
//         setLoading(false);
//       }
//     }
//     fetchPages();
//   }, [site_name, section_name]);

  return (
    <Box sx={{ padding: 3 }}>
    <Button
        startIcon={<ArrowBackIcon />}
        onClick={() => router.push(`/sites/${site_name}/sections`)}
        sx={{ mb: 2 }}
    >
        Back to Sections
    </Button>
      <Typography variant="h4">Manage Pages in {section_name}</Typography>
      <List>
        {pages.map((page) => (
          <ListItem key={page.id}>
            <ListItemText primary={page.title} />
            <IconButton onClick={() => router.push(`/sites/${site_name}/sections/${section_name}/pages/${page.name}`)}>
              <EditIcon />
            </IconButton>
            <IconButton onClick={() => handleDeletePage(page.id)}>
              <DeleteIcon />
            </IconButton>
          </ListItem>
        ))}
      </List>

      {/* Page Form */}
      <PageForm site_name={site_name} section_name={section_name} />
    </Box>
  );
}
