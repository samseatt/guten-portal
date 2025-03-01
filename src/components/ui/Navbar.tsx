'use client';

import React from 'react';
import { AppBar, Toolbar, Typography, Container } from '@mui/material';
import Link from 'next/link';

export default function Navbar() {
  return (
    <AppBar position="static" color="primary">
      <Container maxWidth="lg">
        <Toolbar disableGutters>
          <Typography
            variant="h6"
            noWrap
            component={Link}
            href="/"
            sx={{ mr: 2, textDecoration: 'none', color: 'inherit' }}
          >
            Guten Ink
          </Typography>
        </Toolbar>
      </Container>
    </AppBar>
  );
}
