"use client";
import { useState } from 'react';
import { Alert, Card, CardContent, CardActions, Button, Chip, Typography, Dialog, DialogTitle, DialogContent, DialogActions } from '@mui/material';
import Link from 'next/link';
import api from '@/lib/api';
import { errorMessage } from '@/lib/content';
import { PublicationStatus } from '@/lib/publication';

interface Props {
  site: { id: number; name: string; title: string };
  status?: PublicationStatus;
  onStatus: (status: PublicationStatus) => void;
}

export default function DashboardCard({ site, status, onStatus }: Props) {
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const [notice, setNotice] = useState('');
  const [confirmation, setConfirmation] = useState<{ action: 'publish' | 'unpublish'; status: PublicationStatus } | null>(null);
  const name = encodeURIComponent(site.name);
  const sitesUrl = (process.env.NEXT_PUBLIC_GUTEN_SITES_URL || 'http://localhost:3000').replace(/\/$/, '');

  async function prepare(action: 'publish' | 'unpublish') {
    setBusy(true); setError(''); setNotice('');
    try {
      const { data } = await api.get<PublicationStatus>(`/sites/${name}/publication`, { timeout: 15000 });
      onStatus(data);
      if (action === 'unpublish' && !data.is_published) { setNotice('This site is already unpublished.'); return; }
      if (action === 'publish' && !data.has_changes) { setNotice('Published content already matches the draft.'); return; }
      setConfirmation({ action, status: data });
    } catch (error) { setError(errorMessage(error)); }
    finally { setBusy(false); }
  }

  async function confirm() {
    if (!confirmation || busy) return;
    setBusy(true); setError('');
    const { action, status: reviewed } = confirmation;
    const body = { expected_fingerprint: action === 'publish' ? reviewed.draft_fingerprint : reviewed.published_fingerprint };
    try {
      const { data } = action === 'publish'
        ? await api.post<PublicationStatus>(`/publish/${name}`, body, { timeout: 60000 })
        : await api.delete<PublicationStatus>(`/sites/${name}/publication`, { data: body, timeout: 60000 });
      onStatus(data);
      setNotice(action === 'publish' ? 'Site published.' : 'Site unpublished. Draft content is preserved.');
    } catch (error) { setError(errorMessage(error)); }
    finally { setBusy(false); setConfirmation(null); }
  }

  return (
    <Card component="section" aria-label={site.title} sx={{ minWidth: 275, mb: 2 }}>
      <CardContent>
        <Typography variant="h6">{site.title}</Typography>
        <Typography color="text.secondary" sx={{ mb: 1.5 }}>{site.name}</Typography>
        <Chip size="small" label={!status ? 'Status unavailable' : !status.is_published ? 'Not published' : status.has_changes ? 'Unpublished changes' : 'Published'}
          color={status?.is_published ? status.has_changes ? 'warning' : 'success' : 'default'} />
        {status?.last_published_at && <Typography variant="body2" sx={{ mt: 1 }}>Last published: {new Date(status.last_published_at).toLocaleString()}</Typography>}
        {error && <Alert severity="error" sx={{ mt: 1 }}>{error}</Alert>}
        {notice && <Alert severity="success" sx={{ mt: 1 }}>{notice}</Alert>}
      </CardContent>
      <CardActions sx={{ flexWrap: 'wrap' }}>
        <Button component={Link} href={`/sites/${name}/edit`} size="small">Edit Site</Button>
        <Button component={Link} href={`/sites/${name}/sections`} size="small">Manage Sections</Button>
        <Button component={Link} href={`/draft/${name}`} size="small">View Draft</Button>
        {status?.is_published && <Button component="a" href={`${sitesUrl}/${name}`} target="_blank" rel="noopener noreferrer" size="small">View Published</Button>}
        <Button disabled={busy} size="small" onClick={() => void prepare('publish')}>Publish</Button>
        {status?.is_published && <Button disabled={busy} size="small" color="warning" onClick={() => void prepare('unpublish')}>Unpublish</Button>}
      </CardActions>
      <Dialog open={confirmation !== null} onClose={() => { if (!busy) setConfirmation(null); }} aria-labelledby={`publish-${site.id}`}>
        <DialogTitle id={`publish-${site.id}`}>{confirmation?.action === 'publish' ? 'Publish' : 'Unpublish'} {site.title}?</DialogTitle>
        <DialogContent>
          {confirmation?.action === 'publish'
            ? `Make this site's current draft live: ${confirmation.status.section_count} sections and ${confirmation.status.page_count} pages. This includes edits, ordering, and deletions since the last publish. Other sites are unaffected.`
            : 'Remove this site from Guten Sites. Its draft content remains available in Portal and can be published again.'}
        </DialogContent>
        <DialogActions>
          <Button disabled={busy} onClick={() => setConfirmation(null)}>Cancel</Button>
          <Button disabled={busy} onClick={() => void confirm()}>{confirmation?.action === 'publish' ? 'Publish Site' : 'Unpublish Site'}</Button>
        </DialogActions>
      </Dialog>
    </Card>
  );
}
