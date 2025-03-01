## 🚀 **UX Workflow: "Guten Ink"**

This document presents a structured and refined UX/workflow for your **Guten Ink** site creation and publishing process, clearly aligning with modern UI/UX standards, React best practices, and leveraging MUI for consistency and clarity.

---

### 🌟 **1. Authentication**

**Login Page**  
- User logs in via a secure, JWT-authenticated screen.
- Simple form:
  - Username/email
  - Password
  - Login Button
- Successful login navigates to the **User Dashboard**.

---

### 🌟 **2. User Dashboard (Sites Overview)**

**Route:** `/dashboard`

**Elements:**
- **List of User’s Draft Sites**
  - Display site names, titles, and quick edit/delete icons.
  - Each site name is clickable, navigating to that site's **Section Management** page.

- **"Create New Site" Button**
  - Opens a modal/form to enter new site details:
    - Name, Title, URL (optional), Logo URL.
    - Submit creates the site and adds it to the dashboard list.

---

### 🌟 **3. Section Management (Per-Site Level)**

**Route:** `/dashboard/sites/[site_name]`

**Elements:**
- Display site name prominently at the top.
- **List of Sections**:
  - Section name, theme, quick edit/delete icons.
  - Clickable section names to manage pages within that section.

- **"Create New Section" Form**
  - On-screen form to quickly create new sections:
    - Section Name, Section Theme (Dropdown to pick/create theme), Save button.
    - After creation, refresh the section list on the same page.

- **"Preview Draft Site" Button**
  - Navigates the user to the draft version of their entire site:
  - URL structure: `/draft/sites/[site_name]`

---

### 🌟 **4. Page Management (Per-Section Level)**

**Route:** `/dashboard/sites/[site_name]/sections/[section_name]`

**Elements:**
- Breadcrumb: `Dashboard / Site Name / Section Name`
- Display Section Name clearly.
- **List of Pages**
  - Title, edit/delete icons.
  - "Preview Draft Page" button/link (to quickly view draft rendering).
  - Click on title to edit a specific page.

- **"Create/Edit Page" Form**
  - Form fields:
    - Page Title, Page Name (URL-friendly), Abstract (textarea), Content (markdown textarea), Page Template (dropdown), Image URL.
    - "Save" button: Adds/Updates page to the list, remains on page after saving.
  - Auto-save or explicit save options for user convenience.

---

### 🌟 **5. Draft Site/Page Preview**

- Draft viewing requires authentication.
- Clearly labeled as "Draft Preview" in header.
- Accessible via:
  - Whole site: `/draft/sites/[site_name]`
  - Single page: `/draft/sites/[site_name]/sections/[section_name]/pages/[page_name]`

**Preview Capabilities:**
- Real-time rendering of content, markdown, images.
- Menu navigation fully functional, mirroring eventual published behavior.

---

### 🌟 **6. Publish Site Workflow**

**Route:** `/dashboard/sites/[site_name]/publish`

- "Publish Site" button appears prominently on either the site or section management page.
- Clicking "Publish":
  - Shows confirmation modal:
    - "Are you sure you want to publish this site?"
    - Cancel/Confirm buttons.
  - Confirming triggers the publish API:
    - Copies the entire draft content (pages, sections, themes) from the draft to the published schema (`guten-datalake`).
    - Updates publishing timestamp, log entries, etc.

- After successful publish:
  - User sees success notification.
  - Site immediately available via public URL (e.g., `https://guten.ink/[site_name]`).

---

## 🎯 **Detailed URL Structure (Next.js Routing)**
```
/ (root)
├── /login
├── /dashboard
│   ├── /sites
│   │   ├── [site_name]
│   │   │   ├── /sections
│   │   │   │   ├── [section_name]
│   │   │   │   │   └── /pages
│   │   │   │   │       ├── [page_name] (edit page)
│   │   │   │   └── (create/edit/delete section)
│   │   │   └── /publish
│   │   └── (create/edit/delete site)
└── /draft
    └── /sites
        ├── [site_name]
        │   ├── sections
        │   │   ├── [section_name]
        │   │   │   └── pages
        │   │   │       └── [page_name] (view page draft)
        └── (view entire draft site)
```

---

## 🛠️ **Next Steps (Phase-by-phase Development):**

### ✅ **Phase 1 - MVP (Initial Version)**
- **Authentication:** Simple JWT-based login.
- **Dashboard:** Create/List/Edit sites, sections, pages.
- **Draft:** Preview individual page/whole site.
- **Publish:** Basic publish button, DB copying from draft to publish.

### 🚩 **Phase 2 - Publishing & Serving**
- Implement published content rendering publicly.
- Markdown rendering with GitHub-style formatting.
- DNS and custom domains configuration.

### ✨ **Phase 3 - AI Content Enhancement**
- Add prompt input textbox on page-edit forms.
- Mantle integration (LangChain API):
  - Content enhancement via GPT-4.
  - Embedding RAG-driven content refinement.

---

## 🔖 **Technical Stack & Design Principles**

- **Frontend (Portal)**:
  - Next.js 14+, React, TypeScript
  - Material UI (MUI v5) for theming/UI consistency
  - Axios for API integration

- **Backend (Crust)**:
  - Node.js/Express for API Gateway and Aspect logic
  - JWT authentication middleware
  - Clean logging (simple, consistent)

- **Data (Datalake/Mantle)**:
  - Python FastAPI for content CRUD & publishing
  - PostgreSQL (TimescaleDB) for structured content management
  - Redis caching for future dashboard/streaming enhancements
  - LangChain and OpenAI GPT-4 for advanced content generation/refinement

---
