"use client"; // Next.js App Router needs this for hooks

import { useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import axios from "@/lib/axios";

const DraftSite = () => {
  const router = useRouter();
  const params = useParams();
  const { site_name } = params;

  useEffect(() => {
    const fetchLandingPage = async () => {
      try {
        // 1. Fetch the site details, including the landing_page_id
        const siteResponse = await axios.get(`/guten/sites/${site_name}`);
        const landingPageId = siteResponse.data.landing_page_id;
        console.log('Landing page ID = ', landingPageId);
        console.log('Site name = ', site_name);

        if (landingPageId) {
          // 2. Fetch the landing page details
          const pageResponse = await axios.get(`/guten/page_by_id/${landingPageId}`);
          const sectionResponse = await axios.get(`/guten/section_by_id/${pageResponse.data.section_id}`);
          console.log('Redirecting to page with: ', site_name, sectionResponse.data.name, pageResponse.data.name)
          router.replace(`/draft/${site_name}/${sectionResponse.data.name}/${pageResponse.data.name}`);
          return;
        }

        // 3. If no landing page, get the first section
        const sectionsResponse = await axios.get(`/guten/sections?site=${site_name}`);
        if (sectionsResponse.data.length > 0) {
          const firstSection = sectionsResponse.data[0].name;
          console.log('First section = ', firstSection);

          // 4. Get the first page in that section
          const pagesResponse = await axios.get(`/guten/pages?site=${site_name}&section=${firstSection}`);
          if (pagesResponse.data.length > 0) {
            router.replace(`/draft/${site_name}/${firstSection}/${pagesResponse.data[0].name}`);
            return;
          }
        }

        // 5. If no pages exist, redirect to dashboard
        router.replace(`/dashboard`);
      } catch (error) {
        console.error("Error fetching site:", error);
        router.replace(`/dashboard`); // Fallback to dashboard if error occurs
      }
    };

    fetchLandingPage();
  }, [site_name, router]); // Correct dependency array

  return null; // This page **only redirects**, nothing to render
};

export default DraftSite;
