'use client';
import React, { useEffect, useState } from 'react';
import { Box, Grid, Typography, Container, Button } from '@mui/material';
import Link from 'next/link';
import DashboardCard from '@/components/ui/DashboardCard';
import Navbar from '@/components/ui/Navbar';
import Footer from '@/components/ui/Footer';
import api from '@/lib/api';

interface Site {
  id: number;
  name: string;
  title: string;
  url: string;
  logo: string;
  favicon: string;
}

export default function DashboardPage() {
  const [sites, setSites] = useState<Site[]>([]);

  useEffect(() => {
    const fetchSites = async () => {
      console.log('Calling crust')
      const response = await api.get('/sites');
      setSites(response.data);
    };
    fetchSites();
  }, []);

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      {/* <Navbar /> */}
      <Container sx={{ flexGrow: 1, py: 4 }}>
        <Typography variant="h4" gutterBottom>
          Guten Dashboard
        </Typography>
        <Grid container spacing={3}>
          {sites.map((site) => (
            <Grid item xs={12} sm={6} md={4} key={site.id}>
              <DashboardCard site={site} />
            </Grid>
          ))}
        </Grid>
        <Button component={Link} href={`/create-site`} size="small">
          Create a New Site
        </Button>
      </Container>
      {/* <Footer /> */}
    </Box>
  );
}
