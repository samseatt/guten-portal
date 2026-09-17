'use client';

import React from 'react';
import { AppBar, Toolbar, Typography, Container, Button } from '@mui/material';
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
            Guten Portal
          </Typography>
          {process.env.NEXT_PUBLIC_AUTH_ENABLED === 'true' && (
            <Button component="a" href="/oauth2/sign_out?rd=/" color="inherit" sx={{ ml: 'auto' }}>Sign out</Button>
          )}
        </Toolbar>
      </Container>
    </AppBar>
  );
}
