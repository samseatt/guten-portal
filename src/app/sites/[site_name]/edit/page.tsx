"use client";

import React, { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import {
  TextField,
  Button,
  Container,
  Typography,
  Box,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from "@mui/material";
import api from "@/lib/api";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";

export default function EditSitePage() {
  const router = useRouter();
  const { site_name } = useParams<{ site_name: string }>();

  const [title, setTitle] = useState("");
  const [url, setUrl] = useState("");
  const [logo, setLogo] = useState("");
  const [favicon, setFavicon] = useState("");
  const [color, setColor] = useState("");
  const [landingPageId, setLandingPageId] = useState<number | null>(null);
  const [error, setError] = useState("");

  const [pages, setPages] = useState<{ id: number; name: string }[]>([]);

  useEffect(() => {
    const fetchSite = async () => {
      try {
        const { data } = await api.get(`/sites/${site_name}`);
        setTitle(data.title);
        setUrl(data.url || "");
        setLogo(data.logo || "");
        setFavicon(data.favicon || "");
        setColor(data.color || "");

        // setLandingPageId(data.landing_page_id || null);

        // Ensure the previously selected landing page is set
        setLandingPageId(data.landing_page_id ?? null);
      } catch (err) {
        console.error("Error fetching site:", err);
        setError("Failed to fetch site details.");
      }
    };

    const fetchPages = async () => {
      try {
        const { data } = await api.get(`/pages_all/${site_name}`);
        setPages(data || []);
      } catch (err) {
        console.error("Error fetching pages:", err);
        setError("Failed to fetch pages.");
      }
    };

    fetchSite();
    fetchPages();
  }, [site_name]);

  const handleUpdate = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      await api.put(`/sites/${site_name}`, {
        title,
        url,
        logo,
        favicon,
        color,
        landing_page_id: landingPageId,
      });
      router.push("/dashboard");
    } catch (error) {
      console.error("Update failed:", error);
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

        <TextField
          label="Color"
          value={color}
          onChange={(e) => setColor(e.target.value)}
          fullWidth
          required
          margin="normal"
        />

        {/* Landing Page Dropdown */}
        <InputLabel><br />Landing Page:</InputLabel>
        <FormControl fullWidth margin="normal">
          {/* <InputLabel>Landing Page</InputLabel> */}
          <Select
            value={landingPageId ?? ""}
            onChange={(e) => setLandingPageId(e.target.value as number)}
            displayEmpty
          >
            <MenuItem value="">None (Auto-routed)</MenuItem>
            {pages.map((page) => (
              <MenuItem key={page.id} value={page.id}>
                {page.name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        {error && (
          <Typography color="error" variant="body2" sx={{ mt: 2 }}>
            {error}
          </Typography>
        )}

        <Button type="submit" variant="contained" sx={{ mt: 2 }}>
          Update Site
        </Button>
      </Box>
    </Container>
  );
}






// 'use client';
// import React, { useEffect, useState } from 'react';
// import { useRouter, useParams } from 'next/navigation';
// import { TextField, Button, Container, Typography, Box } from '@mui/material';
// import api from '@/lib/api';
// import ArrowBackIcon from "@mui/icons-material/ArrowBack";

// export default function EditSitePage() {
//   const router = useRouter();
//   const { site_name } = useParams<{ site_name: string }>();
//   const [title, setTitle] = useState('');
//   const [url, setUrl] = useState('');
//   const [logo, setLogo] = useState('');
//   const [favicon, setFavicon] = useState('');

//   useEffect(() => {
//     const fetchSite = async () => {
//       const { data } = await api.get(`/sites/${site_name}`);
//       setTitle(data.title);
//       setUrl(data.url);
//       setLogo(data.logo);
//       setFavicon(data.favicon);
//     };
//     fetchSite();
//   }, [site_name]);

//   const handleUpdate = async (e: React.FormEvent<HTMLFormElement>) => {
//     e.preventDefault();
//     try {
//       await api.put(`/sites/${site_name}`, { title, url, logo, favicon });
//       router.push('/dashboard');
//     } catch (error) {
//       console.error('Update failed:', error);
//     }
//   };

//   return (
//     <Container maxWidth="sm" sx={{ py: 5 }}>
//       <Button
//         startIcon={<ArrowBackIcon />}
//         onClick={() => router.push("/dashboard")}
//         sx={{ mb: 2 }}
//         >
//         Back to Dashboard
//       </Button>
//       <Typography variant="h4">Edit Site: {site_name}</Typography>
//       <Box component="form" onSubmit={handleUpdate}>
//         <TextField
//           label="Site Title"
//           value={title}
//           onChange={(e) => setTitle(e.target.value)}
//           fullWidth
//           required
//           margin="normal"
//         />
//         <TextField
//           label="Site URL"
//           value={url}
//           onChange={(e) => setUrl(e.target.value)}
//           fullWidth
//           required
//           margin="normal"
//         />
//         <TextField
//           label="Site Logo"
//           value={logo}
//           onChange={(e) => setLogo(e.target.value)}
//           fullWidth
//           required
//           margin="normal"
//         />
//         <TextField
//           label="Site Favicon"
//           value={favicon}
//           onChange={(e) => setFavicon(e.target.value)}
//           fullWidth
//           required
//           margin="normal"
//         />
//         <Button type="submit" variant="contained" sx={{ mt: 2 }}>
//           Update Site
//         </Button>
//       </Box>
//     </Container>
//   );
// }
