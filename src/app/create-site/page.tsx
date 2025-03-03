'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Container, TextField, Button, Typography, Box, Paper } from '@mui/material';
import api from '@/lib/api';
import ArrowBackIcon from "@mui/icons-material/ArrowBack";

export default function CreateSite() {
  const router = useRouter();
  const [name, setName] = useState('');
  const [title, setTitle] = useState('');
  const [url, setUrl] = useState('');
  const [logo, setLogo] = useState('');
  const [favicon, setFavicon] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    try {
      const response = await api.post('/sites', { name, title, url, logo, favicon });
      console.log('Site created:', response.data);
      setError('');
      alert(`Site '${response.data.name}' created successfully!`);
      router.push(`/sites/${name}/sections`);
    } catch (err: any) {
      console.error('Error creating site:', err);
      setError(err.response?.data?.message || 'Failed to create site');
    }
  };

  return (
    <Container maxWidth="sm">
      <Button
        startIcon={<ArrowBackIcon />}
        onClick={() => router.push("/dashboard")}
        sx={{ mb: 2 }}
        >
        Back to Dashboard
      </Button>
      <Paper elevation={3} sx={{ padding: 4, marginTop: 4 }}>
        <Typography variant="h5" component="h1" gutterBottom>
          Create New Site
        </Typography>

        <Box component="form" onSubmit={handleSubmit} noValidate autoComplete="off">
          <TextField
            label="Site Name"
            fullWidth
            required
            margin="normal"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />

          <TextField
            label="Site Title"
            fullWidth
            required
            margin="normal"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />

          <TextField
            label="Site URL"
            fullWidth
            margin="normal"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
          />

          <TextField
            label="Logo Location"
            fullWidth
            margin="normal"
            value={logo}
            onChange={(e) => setLogo(e.target.value)}
          />

          <TextField
            label="Favicon URL"
            fullWidth
            margin="normal"
            value={favicon}
            onChange={(e) => setFavicon(e.target.value)}
          />

          {error && (
            <Typography color="error" variant="body2" sx={{ mt: 2 }}>
              {error}
            </Typography>
          )}

          <Box sx={{ display: 'flex', justifyContent: 'flex-end', marginTop: 3 }}>
            <Button type="submit" variant="contained" color="primary">
              Create Site
            </Button>
          </Box>
        </Box>
      </Paper>
    </Container>
  );
}
