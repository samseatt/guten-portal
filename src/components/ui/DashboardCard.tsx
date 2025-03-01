import React from 'react';
import { Card, CardContent, CardActions, Button, Typography } from '@mui/material';
import Link from 'next/link';

interface DashboardCardProps {
  site: {
    id: number;
    name: string;
    title: string;
  };
}

export default function DashboardCard({ site }: DashboardCardProps) {
  return (
    <Card sx={{ minWidth: 275, mb: 2 }}>
      <CardContent>
        <Typography variant="h6" component="div">
          {site.title}
        </Typography>
        <Typography sx={{ mb: 1.5 }} color="text.secondary">
          {site.name}
        </Typography>
      </CardContent>
      <CardActions>
        <Button component={Link} href={`/sites/${site.name}/edit`} size="small">
          Edit Site
        </Button>
        <Button component={Link} href={`/sites/${site.name}/sections`} size="small">
        Manage Sections
        </Button>
        {/* <Button 
          variant="outlined" 
          sx={{ mt: 2 }} 
          onClick={() => router.push(`/sites/${site_name}/sections`)}
        >
          Manage Sections
        </Button> */}
        <Button component={Link} href={`/draft/${site.name}`} size="small">
          View Draft
        </Button>
        <Button size="small" color="primary">
          Publish
        </Button>
      </CardActions>
    </Card>
  );
}
