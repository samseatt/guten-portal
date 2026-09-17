"use client";
import { useCallback, useEffect, useState } from 'react';
import { Alert, Box, Grid, Typography, Container, Button } from '@mui/material';
import Link from 'next/link';
import DashboardCard from '@/components/ui/DashboardCard';
import api from '@/lib/api';
import { errorMessage } from '@/lib/content';
import { PublicationStatus } from '@/lib/publication';

interface Site { id: number; name: string; title: string; }

export default function DashboardPage() {
  const [sites, setSites] = useState<Site[]>([]);
  const [statuses, setStatuses] = useState<Record<number, PublicationStatus>>({});
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const load = useCallback(async (signal?: AbortSignal) => {
    setLoading(true); setError('');
    try {
      const [sites, statuses] = await Promise.all([
        api.get<Site[]>('/sites', { signal, timeout: 15000 }),
        api.get<PublicationStatus[]>('/publication-status', { signal, timeout: 15000 }),
      ]);
      if (signal?.aborted) return;
      setSites(sites.data);
      setStatuses(Object.fromEntries(statuses.data.map(status => [status.site_id, status])));
    } catch (error) { if (!signal?.aborted) setError(errorMessage(error)); }
    finally { if (!signal?.aborted) setLoading(false); }
  }, []);
  useEffect(() => {
    const controller = new AbortController();
    void load(controller.signal);
    return () => controller.abort();
  }, [load]);

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <Container sx={{ flexGrow: 1, py: 4 }}>
        <Typography variant="h4" gutterBottom>Guten Dashboard</Typography>
        <Typography sx={{ mb: 2 }}>Edits stay in draft until you publish the site. View Draft always shows your latest saved edits.</Typography>
        {error && <Alert severity="error">{error}</Alert>}
        <Button disabled={loading} onClick={() => void load()} sx={{ mb: 2 }}>Refresh publication status</Button>
        {loading && <Typography role="status">Loading sites and publication status…</Typography>}
        <Grid container spacing={3}>
          {sites.map(site => <Grid item xs={12} sm={6} md={4} key={site.id}>
            <DashboardCard site={site} status={statuses[site.id]} onStatus={status => setStatuses(current => ({ ...current, [status.site_id]: status }))} />
          </Grid>)}
        </Grid>
        <Button component={Link} href="/create-site" size="small">Create a New Site</Button>
      </Container>
    </Box>
  );
}
