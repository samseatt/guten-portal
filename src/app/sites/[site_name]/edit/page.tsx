'use client';
import React, { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { TextField, Button, Container, Typography, Box } from '@mui/material';
import api from '@/lib/api';
import ArrowBackIcon from "@mui/icons-material/ArrowBack";

export default function EditSitePage() {
  const router = useRouter();
  const { site_name } = useParams<{ site_name: string }>();
  const [title, setTitle] = useState('');
  const [url, setUrl] = useState('');
  const [logo, setLogo] = useState('');
  const [favicon, setFavicon] = useState('');

  useEffect(() => {
    const fetchSite = async () => {
      const { data } = await api.get(`/sites/${site_name}`);
      setTitle(data.title);
      setUrl(data.url);
      setLogo(data.logo);
      setFavicon(data.favicon);
    };
    fetchSite();
  }, [site_name]);

  const handleUpdate = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      await api.put(`/sites/${site_name}`, { title, url, logo, favicon });
      router.push('/dashboard');
    } catch (error) {
      console.error('Update failed:', error);
    }
  };

  return (
    <Container maxWidth="sm" sx={{ py: 5 }}>
      <Button
        startIcon={<ArrowBackIcon />}
        onClick={() => router.push("/dashboard")}
        sx={{ mb: 2 }}
        >
        Back to Dashboard
      </Button>
      <Typography variant="h4">Edit Site: {site_name}</Typography>
      <Box component="form" onSubmit={handleUpdate}>
        <TextField
          label="Site Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          fullWidth
          required
          margin="normal"
        />
        <TextField
          label="Site URL"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          fullWidth
          required
          margin="normal"
        />
        <TextField
          label="Site Logo"
          value={logo}
          onChange={(e) => setLogo(e.target.value)}
          fullWidth
          required
          margin="normal"
        />
        <TextField
          label="Site Favicon"
          value={favicon}
          onChange={(e) => setFavicon(e.target.value)}
          fullWidth
          required
          margin="normal"
        />
        <Button type="submit" variant="contained" sx={{ mt: 2 }}>
          Update Site
        </Button>
      </Box>
    </Container>
  );
}
