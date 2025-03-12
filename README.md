# Guten Portal

## Overview
Guten Portal is the user interface for building, managing, and publishing websites using the Guten platform. It enables users to create and edit websites, manage sections and pages, and eventually leverage AI-driven content generation and refinement through LLMs, RAG, and LangChain integrations.

## Features
- **User Authentication**: Secure login and session management (upcoming integration with Guten Auth service).
- **Dashboard**: Overview of all sites managed by the user.
- **Site Management**: Create, edit, and delete websites.
- **Section Management**: Organize content into structured sections.
- **Page Management**: Add and edit pages with markdown-based content.
- **Theme Customization**: Assign colors, logos, and favicons per site.
- **Landing Page Selection**: Choose a default landing page for each site.
- **Preview Draft Sites**: View unpublished site versions before publishing.
- **Publishing Workflow**: Push finalized sites to live/public mode (upcoming feature).
- **Future AI Integration**: LLM-powered content refinement and automated content generation.

## Project Structure
```
guten-portal/
│── src/
│   ├── app/
│   │   ├── dashboard/
│   │   ├── sites/
│   │   │   ├── [site_name]/
│   │   │   │   ├── edit/
│   │   │   │   ├── sections/
│   │   │   │   │   ├── [section_name]/
│   │   │   │   │   │   ├── pages/
│   │   │   │   │   │   │   ├── [page_name]/
│   │   │   │   │   │   │   │   ├── edit/
│   │   │   │   │   │   │   ├── page.tsx
│   │   ├── draft/
│   │   │   ├── [site_name]/
│   │   │   │   ├── [section_name]/
│   │   │   │   │   ├── [page_name]/page.tsx
│   ├── components/
│   │   ├── Navbar.tsx
│   │   ├── Footer.tsx
│   │   ├── Sidebar.tsx
│   │   ├── ThemeProvider.tsx
│   ├── lib/
│   │   ├── axios.ts
│   │   ├── api.ts
│   ├── styles/
│   │   ├── globals.css
│── .env
│── package.json
│── tsconfig.json
│── README.md
```

## Installation
### Prerequisites
Ensure you have the following installed:
- **Node.js** (>=16.x)
- **npm** (>=8.x) or **yarn** (>=1.x)
- **Guten Crust API** (should be running for backend communication)

### Clone the Repository
```sh
git clone https://github.com/your-org/guten-portal.git
cd guten-portal
```

### Install Dependencies
```sh
npm install
```

### Environment Variables
Create a `.env` file in the root directory and configure it as needed:
```
NEXT_PUBLIC_GUTEN_CRUST_API=http://localhost:4000
NEXT_PUBLIC_GUTEN_AUTH_API=http://localhost:5000
```

### Run the Development Server
```sh
npm run dev
```
The portal will be available at `http://localhost:3000`

## API Integration
Guten Portal communicates with **Guten Crust** (Node.js gateway) and **Guten Datalake** (FastAPI backend). Requests are structured as follows:

- **Sites API**
  - `GET /sites` – Fetch all sites
  - `POST /sites` – Create a new site
  - `PUT /sites/{site_name}` – Update site details
  - `DELETE /sites/{site_name}` – Remove a site

- **Sections API**
  - `GET /sections?site={site_name}` – Fetch sections for a site
  - `POST /sections` – Add a new section
  - `PUT /sections/{section_id}` – Modify a section
  - `DELETE /sections/{section_id}` – Delete a section

- **Pages API**
  - `GET /pages?site={site_name}&section={section_name}` – Fetch pages in a section
  - `POST /pages` – Create a new page
  - `PUT /pages/{page_id}` – Update a page
  - `DELETE /pages/{page_id}` – Delete a page

## Theming & Customization
Each site allows customization through themes:
- **Color Scheme** (set via `draft.sites.color`)
- **Logos & Favicon** (stored in S3 or defined URLs)
- **Page Templates** (custom layouts for sections/pages)

## Deployment
### Build for Production
```sh
npm run build
```

### Start Production Server
```sh
npm start
```

### Docker Deployment (Optional)
Create a `Dockerfile`:
```
FROM node:16
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build
CMD ["npm", "start"]
```

Then build and run:
```sh
docker build -t guten-portal .
docker run -p 3000:3000 guten-portal
```

## Future Enhancements
- **AI-Powered Content Creation**
- **User Role Management**
- **Collaboration & Workflow Approvals**
- **Publishing Automation**

## Contributing
1. Fork the repository
2. Create a feature branch (`git checkout -b feature-branch`)
3. Commit changes (`git commit -m "Add new feature"`)
4. Push to the branch (`git push origin feature-branch`)
5. Open a Pull Request

## License
MIT License. See `LICENSE` file for details.

---

**Guten Portal** – Revolutionizing Website Publishing!

