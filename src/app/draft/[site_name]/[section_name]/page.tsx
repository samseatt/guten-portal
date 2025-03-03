"use client"; // Required for hooks in Next.js App Router

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation"; // Use useParams() instead of direct params
import axios from "@/lib/axios";

const DraftSection = () => {
  const router = useRouter();
  const params = useParams(); // Correct way to handle dynamic params
  const site_name = params.site_name as string;
  const section_name = params.section_name as string;

  useEffect(() => {
    const fetchSectionLandingPage = async () => {
      if (!site_name || !section_name) return; // Prevent running if params are missing

      try {
        console.log(`Fetching landing page for: Site=${site_name}, Section=${section_name}`);

        // Get the first page in that section
        const pagesResponse = await axios.get(`/guten/pages?site=${site_name}&section=${section_name}`);

        if (Array.isArray(pagesResponse.data) && pagesResponse.data.length > 0) {
          const firstPageName = pagesResponse.data[0].name;
          console.log(`Redirecting to first page: ${firstPageName}`);
          router.replace(`/draft/${site_name}/${section_name}/${firstPageName}`);
        } else {
          console.warn("No pages found, redirecting to the site landing page - FOR NOW.");
          router.replace(`/draft/${site_name}`);
        }
      } catch (error) {
        console.error("Error fetching section pages:", error);
        router.replace(`/draft/${site_name}`); // Fallback if error occurs
      }
    };

    fetchSectionLandingPage();
  }, [site_name, section_name, router]); // Correct dependencies

  return null; // This page only redirects, so no UI needed
};

export default DraftSection;
