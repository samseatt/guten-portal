"use client";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Alert, Box, CircularProgress } from "@mui/material";
import api from "@/lib/api";
import { isAxiosError } from "axios";
export default function LandingRedirect({ section = false }: { section?: boolean }) {
  const params = useParams<{ site_name: string; section_name?: string }>();
  const { site_name, section_name } = params;
  const router = useRouter();
  const [error, setError] = useState("");
  useEffect(() => {
    const controller = new AbortController();
    setError("");
    api.get(`/sites/${encodeURIComponent(site_name)}/landing`, { params: section ? { section: section_name } : {}, signal: controller.signal })
      .then(({ data }) => router.replace(`/draft/${encodeURIComponent(site_name)}/${encodeURIComponent(data.section_name)}/${encodeURIComponent(data.page_name)}`))
      .catch(err => { if (!controller.signal.aborted) setError(isAxiosError(err) && err.response?.status === 404 ? "No page is available at this address." : "Could not load this site. Please try again."); });
    return () => controller.abort();
  }, [site_name, section_name, section, router]);
  return <Box sx={{ p: 3 }}>{error ? <Alert severity="error">{error}</Alert> : <CircularProgress aria-label="Loading page" />}</Box>;
}
