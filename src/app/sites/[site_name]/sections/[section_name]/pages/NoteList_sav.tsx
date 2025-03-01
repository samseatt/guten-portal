"use client";

import React, { useState, useEffect } from "react";
import axios from "@/lib/axios";
import { Box, Typography, TextField, Button, List, ListItem, ListItemText, IconButton } from "@mui/material";
import ReactMarkdown from "react-markdown";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";

export default function NoteList({ site_name, section_name, page_name }) {
  const [notes, setNotes] = useState([]);
  const [newNote, setNewNote] = useState("");
  const [editing, setEditing] = useState(null);

  useEffect(() => {
    async function fetchNotes() {
      try {
        const response = await axios.get(`/guten/notes?site=${site_name}&section=${section_name}&page=${page_name}`);
        setNotes(response.data);
      } catch (error) {
        console.error("Error fetching notes:", error);
      }
    }
    fetchNotes();
  }, [site_name, section_name, page_name]);

  const handleAddOrUpdate = async () => {
    if (editing) {
      await axios.put(`/guten/notes/${editing.id}`, { content: newNote, site_name, section_name, page_name });
      setEditing(null);
    } else {
      await axios.post("/guten/notes", { content: newNote, site_name, section_name, page_name });
    }
    setNewNote("");
    window.location.reload();
  };

  const handleDelete = async (id) => {
    await axios.delete(`/guten/notes/${id}`);
    window.location.reload();
  };

  return (
    <Box sx={{ mt: 4 }}>
      <Typography variant="h6">Notes</Typography>
      <List>
        {notes.map((note) => (
          <ListItem key={note.id} sx={{ display: "flex", flexDirection: "column", alignItems: "flex-start" }}>
            <ListItemText primary={<ReactMarkdown>{note.content}</ReactMarkdown>} />
            <Box sx={{ display: "flex", gap: 1 }}>
              <IconButton onClick={() => setEditing(note)}>
                <EditIcon />
              </IconButton>
              <IconButton onClick={() => handleDelete(note.id)}>
                <DeleteIcon />
              </IconButton>
            </Box>
          </ListItem>
        ))}
      </List>

      {/* Form for adding or editing notes */}
      <TextField fullWidth multiline rows={4} label="New Note" value={newNote} onChange={(e) => setNewNote(e.target.value)} sx={{ mt: 2 }} />
      <Button variant="contained" sx={{ mt: 2 }} onClick={handleAddOrUpdate}>
        {editing ? "Update Note" : "Add Note"}
      </Button>
    </Box>
  );
}
