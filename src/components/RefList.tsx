"use client";

import React, { useState, useEffect } from "react";
import axios from "@/lib/axios";
import { Box, Typography, TextField, Button, List, ListItem, ListItemText, IconButton } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";

export default function RefList({ site_name, section_name, page_name }) {
  const [refs, setRefs] = useState([]);
  const [newRef, setNewRef] = useState({ description: "", url: "" });
  const [editing, setEditing] = useState(null);

  useEffect(() => {
    async function fetchRefs() {
      try {
        const response = await axios.get(`/guten/refs?site=${site_name}&section=${section_name}&page=${page_name}`);
        setRefs(response.data);
      } catch (error) {
        console.error("Error fetching references:", error);
      }
    }
    fetchRefs();
  }, [site_name, section_name, page_name]);

  const handleAddOrUpdate = async () => {
    if (editing) {
      await axios.put(`/guten/refs/${editing.id}`, { ...newRef, site_name, section_name, page_name });
      setEditing(null);
    } else {
      await axios.post("/guten/refs", { ...newRef, site_name, section_name, page_name });
    }
    setNewRef({ description: "", url: "" });
    window.location.reload();
  };

  const handleDelete = async (id) => {
    await axios.delete(`/guten/refs/${id}`);
    window.location.reload();
  };

  return (
    <Box sx={{ mt: 4 }}>
      <Typography variant="h6">References</Typography>
      <List>
        {refs.map((ref) => (
          <ListItem key={ref.id}>
            <ListItemText primary={ref.description} secondary={ref.url} />
            <IconButton onClick={() => setEditing(ref)}>
              <EditIcon />
            </IconButton>
            <IconButton onClick={() => handleDelete(ref.id)}>
              <DeleteIcon />
            </IconButton>
          </ListItem>
        ))}
      </List>

      {/* Form for adding or editing reference */}
      <TextField fullWidth label="Description" value={newRef.description} onChange={(e) => setNewRef({ ...newRef, description: e.target.value })} sx={{ mt: 2 }} />
      <TextField fullWidth label="URL" value={newRef.url} onChange={(e) => setNewRef({ ...newRef, url: e.target.value })} sx={{ mt: 2 }} />
      <Button variant="contained" sx={{ mt: 2 }} onClick={handleAddOrUpdate}>
        {editing ? "Update Reference" : "Add Reference"}
      </Button>
    </Box>
  );
}
