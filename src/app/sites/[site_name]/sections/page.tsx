"use client";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import axios from "@/lib/axios";
import { Container, Typography, Button, TextField, List, ListItem, ListItemText, IconButton } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import ListAltIcon from "@mui/icons-material/ListAlt";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";

interface Section {
  id: number;
  name: string;
  title: string;
}

export default function SectionsPage() {
  const { site_name } = useParams();
  const [sections, setSections] = useState<Section[]>([]);
  const [newSection, setNewSection] = useState({ name: "", title: "" });
  const [editingSection, setEditingSection] = useState<Section | null>(null);
  const router = useRouter();

  useEffect(() => {
    axios.get(`/guten/sections?site=${site_name}`)
      .then(res => setSections(res.data))
      .catch(err => console.error("Error fetching sections", err));
  }, [site_name]);

  const handleCreate = () => {
    axios.post("/guten/sections", { ...newSection, site_name })
      .then(res => {
        setSections([...sections, res.data]);
        setNewSection({ name: "", title: "" });
      })
      .catch(err => console.error("Error adding section", err));
  };

  const handleUpdate = () => {
    if (!editingSection) return;
    axios.put(`/guten/sections/${editingSection.id}`, editingSection)
      .then(res => {
        setSections(sections.map(sec => (sec.id === res.data.id ? res.data : sec)));
        setEditingSection(null);
      })
      .catch(err => console.error("Error updating section", err));
  };

  const handleDelete = (id: number) => {
    axios.delete(`/guten/sections/${id}`)
      .then(() => setSections(sections.filter(sec => sec.id !== id)))
      .catch(err => console.error("Error deleting section", err));
  };

  return (
    <Container maxWidth="md" >
      <Button
        startIcon={<ArrowBackIcon />}
        onClick={() => router.push("/dashboard")}
        sx={{ mb: 2 }}
        >
        Back to Dashboard
      </Button>
      <Typography variant="h4" sx={{ mt: 3, mb: 2 }}>Manage Sections for {site_name}</Typography>

      <List>
        {sections.map(section => (
          <ListItem key={section.id} secondaryAction={
            <>
              <IconButton onClick={() => router.push(`/sites/${site_name}/sections/${section.name}/pages`)}>
                <ListAltIcon />
              </IconButton>
              <IconButton edge="end" aria-label="edit" onClick={() => setEditingSection(section)}>
                <EditIcon />
              </IconButton>
              <IconButton edge="end" aria-label="delete" onClick={() => handleDelete(section.id)}>
                <DeleteIcon />
              </IconButton>
            </>
          }>
            <ListItemText primary={section.title} secondary={section.name} />
          </ListItem>
        ))}
      </List>

      <Typography variant="h6" sx={{ mt: 4 }}>Add / Edit Section</Typography>
      <TextField
        label="Section Name"
        variant="outlined"
        fullWidth
        sx={{ mb: 2 }}
        value={editingSection ? editingSection.name : newSection.name}
        onChange={(e) => editingSection ? setEditingSection({ ...editingSection, name: e.target.value }) : setNewSection({ ...newSection, name: e.target.value })}
      />
      <TextField
        label="Section Title"
        variant="outlined"
        fullWidth
        sx={{ mb: 2 }}
        value={editingSection ? editingSection.title : newSection.title}
        onChange={(e) => editingSection ? setEditingSection({ ...editingSection, title: e.target.value }) : setNewSection({ ...newSection, title: e.target.value })}
      />
      <Button variant="contained" onClick={editingSection ? handleUpdate : handleCreate}>
        {editingSection ? "Update Section" : "Create Section"}
      </Button>
    </Container>
  );
}
