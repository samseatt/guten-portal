"use client";

import Link from "next/link";
import { Box, Button, Container, Paper, Typography } from "@mui/material";

export default function Home() {
  return (
    <Container component="main" maxWidth="md" sx={{ py: { xs: 5, md: 8 }, flexGrow: 1 }}>
      <Typography component="h1" variant="h3" gutterBottom>Guten Portal</Typography>
      <Typography variant="h6" color="text.secondary" sx={{ mb: 4 }}>
        Your workspace for managing Guten publications.
      </Typography>
      <Paper component="section" variant="outlined" sx={{ p: { xs: 3, md: 4 } }} aria-labelledby="site-management-title">
        <Typography id="site-management-title" component="h2" variant="h5" gutterBottom>Website management</Typography>
        <Typography color="text.secondary">
          Organize your sites, edit pages, preview changes, and publish when you’re ready.
        </Typography>
        <Box sx={{ mt: 3 }}>
          <Button component={Link} href="/dashboard" variant="contained">Site Management Dashboard</Button>
        </Box>
      </Paper>
    </Container>
  );
}
