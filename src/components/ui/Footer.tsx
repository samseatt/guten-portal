'use client';

import React from 'react';
import { Box, Container, Typography } from '@mui/material';

export default function Footer() {
  return (
    <Box component="footer" sx={{ py: 3, mt: 'auto', backgroundColor: '#f8f8f8' }}>
      <Container maxWidth="lg">
        <Typography variant="body2" color="text.secondary" align="center">
          {'© '}
          {new Date().getFullYear()} guten.ink. All rights reserved.
        </Typography>
      </Container>
    </Box>
  );
}
