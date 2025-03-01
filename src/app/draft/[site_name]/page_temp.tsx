// "use client"; // Next.js App Router needs this for hooks

// import { useEffect } from "react";
// import { useRouter } from "next/navigation";
// import axios from "@/lib/axios";

// const DraftSite = ({ params }: { params: { site_name: string } }) => {
//   const router = useRouter();
//   console.log('draft landing page called');
//   const { site_name } = params; // ✅ Await params correctly

//   useEffect(() => {
//     console.log('draft landing page called');
//     const fetchLandingPage = async () => {
//       try {
//         // ✅ 1. Fetch the site details, including the landing_page_id
//         // const siteResponse = await axios.get(`/guten/sites/${site_name}`);
//         // const landingPageId = siteResponse.data.landing_page_id;
//         const landingPageId = 14;

//         if (landingPageId) {
//           // ✅ 2. Fetch the landing page details
//           const pageResponse = await axios.get(`/guten/pages/${landingPageId}?site=${site_name}`);
//           router.replace(`/draft/${site_name}/${pageResponse.data.section_name}/${pageResponse.data.name}`);
//           return;
//         }

//         // ✅ 3. If no landing page, get the first section
//         const sectionsResponse = await axios.get(`/guten/sections?site=${site_name}`);
//         if (sectionsResponse.data.length > 0) {
//           const firstSection = sectionsResponse.data[0].name;

//           // ✅ 4. Get the first page in that section
//           const pagesResponse = await axios.get(`/guten/pages?section=${firstSection}`);
//           if (pagesResponse.data.length > 0) {
//             router.replace(`/draft/${site_name}/${firstSection}/${pagesResponse.data[0].name}`);
//             return;
//           }
//         }

//         // ✅ 5. If no pages exist, redirect to dashboard
//         router.replace(`/dashboard`);
//       } catch (error) {
//         console.error("Error fetching site:", error);
//         router.replace(`/dashboard`); // Fallback to dashboard if error occurs
//       }
//     };

//     fetchLandingPage();
//   }, [site_name, router]); // ✅ Correct dependency array

//   return null; // This page **only redirects**, nothing to render
// };

// export default DraftSite;




'use client';

import React, { useEffect, useState } from 'react';
import axios from '@/lib/axios';
import {
  Breadcrumbs,
  Link as MuiLink,
  Typography,
  Card,
  // CardContent,
  CardMedia,
  CircularProgress,
  Box,
  Container,
  List,
  ListItem,
  ListItemText,
  AppBar,
  Toolbar,
  Divider,
} from '@mui/material';

interface ContentData {
  id: number;
  category: string;
  categoryTitle: string;
  name: string;
  title: string;
  abstract: { text: string; author?: string; source?: string }[];
  text: string[];
  // imageRhs: string;
  imageCtr: string;
}

interface CategoryData {
  id: number;
  name: string;
  title: string;
  theme: string;
  themeInv: string;
  subjects: { id: number; name: string; title: string; path: string }[];
}

export default function ContentPage({ params }: { params: { name: string } }) {
  const [content, setContent] = useState<ContentData | null>(null);
  const [category, setCategory] = useState<CategoryData | null>(null);
  const [categories, setCategories] = useState<CategoryData[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

//   const { name } = params;

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        // Await resolution of `params`
        const resolvedParams = await params;
        const { name } = resolvedParams;
        
        // // Fetch content by name
        // const contentResponse = await axios.get(`http://localhost:5000/contents?name=${name}`);
        // if (contentResponse.data.length > 0) {
        //   setContent(contentResponse.data[0]);
        // } else {
        //   setError(`Content not found for name: ${name}`);
        // }

        // // Fetch category details for the current content
        // if (contentResponse.data.length > 0) {
        //   const categoryName = contentResponse.data[0].category;
        //   const categoryResponse = await axios.get(`http://localhost:5000/categories?name=${categoryName}`);
        //   if (categoryResponse.data.length > 0) {
        //     setCategory(categoryResponse.data[0]);
        //   } else {
        //     setError(`Category not found for name: ${categoryName}`);
        //   }
        // }

    //     // Fetch all top-level categories for the top menu
    //     const categoriesResponse = await axios.get('http://localhost:5000/categories');
    //     setCategories(categoriesResponse.data);
      } catch (err) {
        setError('Failed to load data. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [params]);

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" height="100vh">
        <CircularProgress />
      </Box>
    );
  }

  if (error || !content || !category || !categories) {
    return (
      <Container>
        <Typography variant="h6" color="error">
          {error || 'An unexpected error occurred.'}
        </Typography>
      </Container>
    );
  }
  return (
    <Container maxWidth="lg" sx={{ display: 'flex', gap: 3, mt: 2 }}>
      {/* Left Sidebar */}
      <Box sx={{ width: '25%', minWidth: 250 }}>
        {/* Logo */}
        <Box sx={{ textAlign: 'center', mb: 2 }}>
          <img src="/assets/logo.png" alt="Logo" style={{ maxWidth: '80%' }} />
        </Box>

        {/* Breadcrumbs (Compressed into Sidebar) */}
        <Breadcrumbs sx={{ mb: 2, fontSize: '0.9rem' }}>
          <MuiLink href="/" color="inherit">Home</MuiLink>
          <MuiLink href={`/content/${category.name}`} color="inherit">{category.title}</MuiLink>
          <Typography color="textPrimary">{content.title}</Typography>
        </Breadcrumbs>

        <Divider sx={{ mb: 2 }} />

        {/* Left Menu (Subjects) */}
        <List>
          {category.subjects.map((subject) => (
            <ListItem
              key={subject.id}
              component="a"
              href={`/content/${subject.name}`}
              sx={{
                textDecoration: 'none',
                color: 'inherit',
                '&:hover': { textDecoration: 'underline' },
                fontWeight: subject.name === name ? 'bold' : 'normal',
              }}
            >
              <ListItemText primary={subject.title} />
            </ListItem>
          ))}
        </List>
      </Box>

      {/* Main Content Area */}
      <Box sx={{ flex: 1 }}>
        {/* Header with Sectional Menu (Now within content box) */}
        <AppBar position="static" sx={{ width: '100%', bgcolor: 'primary.main' }}>
          <Toolbar>
            {categories.map((cat) => (
              <MuiLink
                key={cat.id}
                href={`/content/${cat.name}`}
                color="inherit"
                underline="none"
                sx={{
                  fontWeight: 'bold',
                  color: cat.name === category.name ? 'secondary.main' : 'white',
                  marginRight: 2,
                }}
              >
                {cat.title}
              </MuiLink>
            ))}
          </Toolbar>
        </AppBar>

        {/* Image (Full-width in the content box) */}
        <CardMedia
          component="img"
          sx={{ width: '100%', height: 192, mt: 0 }} // 3:1 aspect ratio (1728x576 example)
          image={content.imageCtr || '/assets/images/default.jpg'}
          alt={content.title}
        />

        {/* Abstract/Quote Section */}
        <Box sx={{ bgcolor: 'white', color: 'primary.main', padding: 3, mt: 0 }}>
          {content.abstract.map((item, index) => (
            <blockquote key={index} style={{ margin: 0 }}>
              <Typography variant="h6" gutterBottom>{item.text}</Typography>
              {item.author && (
                <Typography variant="caption">
                  - {item.author}{item.source && `, ${item.source}`}
                </Typography>
              )}
            </blockquote>
          ))}
        </Box>

        <Box sx={{ mt: 2 }}>
          {content.text.map((paragraph, index) => (
            <Typography key={index} paragraph>{paragraph}</Typography>
          ))}
        </Box>

        {/* Footer (Now inside the content box) */}
        <Box sx={{ marginTop: 4, padding: 2, bgcolor: 'primary.dark', color: 'white', textAlign: 'center' }}>
          <Typography variant="body2">
            © {new Date().getFullYear()} Adaptive Enterprise Inc. |{' '}
            <MuiLink href="/privacy" color="inherit" underline="always">Privacy Policy</MuiLink> |{' '}
            <MuiLink href="/terms" color="inherit" underline="always">Terms of Use</MuiLink>
          </Typography>
        </Box>
      </Box>
    </Container>
  );
}


// //   return (
// //     <Container>
// //       {/* Top Menu */}
// //       <AppBar position="static" sx={{ marginBottom: 2 , bgcolor: '#444444' }}>
// //         <Toolbar>
// //           <Box sx={{ display: 'flex', gap: 2 }}>
// //             {categories.map((cat) => (
// //               <MuiLink
// //                 key={cat.id}
// //                 href={`/content/${cat.name}`}
// //                 color="inherit"
// //                 underline="none"
// //                 sx={{
// //                   fontWeight: 'bold',
// //                   color: cat.name === category.name ? '#FF9999' : 'white',
// //                 }}
// //               >
// //                 {cat.title}
// //               </MuiLink>
// //             ))}
// //           </Box>
// //         </Toolbar>
// //       </AppBar>

// //       {/* Breadcrumb Navigation */}
// //       <Breadcrumbs aria-label="breadcrumb" sx={{ marginBottom: 2 }}>
// //         <MuiLink href="/" color="inherit">Home</MuiLink>
// //         <MuiLink href={`/content/${category.name}`} color="inherit">{category.title}</MuiLink>
// //         <Typography color="textPrimary">{content.title}</Typography>
// //       </Breadcrumbs>

// //       {/* Layout: Left Menu + Content */}
// //       <Box sx={{ display: 'flex', gap: 4 }}>
// //         {/* Left Menu */}
// //         <List sx={{ width: '20%' }}>
// //           {category.subjects.map((subject) => (
// //             <ListItem
// //               key={subject.id}
// //               component="a"
// //               href={`/content/${subject.name}`}
// //               sx={{
// //                 textDecoration: 'none',
// //                 color: 'inherit',
// //                 '&:hover': { textDecoration: 'underline' },
// //                 fontWeight: subject.name === name ? 'bold' : 'normal',
// //               }}
// //             >
// //               <ListItemText primary={subject.title} />
// //             </ListItem>
// //           ))}
// //         </List>

// //         {/* Page Content */}
// //         <Box sx={{ flex: 1 }}>
// //           <Card sx={{ display: 'flex', marginBottom: 4, bgcolor: '#DEDEDE'}}>
// //             <CardContent>
// //               {content.abstract.map((item, index) => (
// //                 <blockquote key={index}>
// //                   <Typography variant="body1">{item.text}</Typography>
// //                   {item.author && (
// //                     <footer>
// //                       <Typography variant="caption">
// //                         - {item.author}{item.source && `, ${item.source}`}
// //                       </Typography>
// //                     </footer>
// //                   )}
// //                 </blockquote>
// //               ))}
// //             </CardContent>
// //             <CardMedia
// //               component="img"
// //               sx={{ width: 240, height: 240 }}
// //               image={content.imageCtr || '/assets/images/defaultctr.jpg'} // Placeholder image
// //               alt={content.title}
// //             />
// //           </Card>
// //           {content.text.map((paragraph, index) => (
// //             <Typography key={index} paragraph>{paragraph}</Typography>
// //           ))}
// //         </Box>
// //       </Box>

// //       {/* Footer */}
// //       <Box component="footer" sx={{ marginTop: 4, padding: 2, bgcolor: 'primary.main', color: 'white' }}>
// //         <Typography variant="body2" align="center">
// //           © {new Date().getFullYear()} Adaptive Enterprise Inc. |{' '}
// //           <MuiLink href="/privacy" color="inherit" underline="always">Privacy Policy</MuiLink> |{' '}
// //           <MuiLink href="/terms" color="inherit" underline="always">Terms of Use</MuiLink>
// //         </Typography>
// //       </Box>
// //     </Container>
// //   );
// // }
