# Guten Portal

Next.js/React/MUI authoring application for Guten sites, sections, pages, references, and notes. The current local MVP edits draft data through Guten Crust. Authentication, reliable publication, ordering, and parts of refs/notes remain unfinished. Public Guten Sites currently reads the same draft content directly.

## Local development

From the sibling coordination repository:

```bash
cd ../guten
make status
make run SERVICE=portal
make check SERVICE=portal
```

Portal uses port **3001**. The existing Node dependencies must be installed first. The current frontend has TypeScript errors; development serving does not establish that a production build passes.

The current clients use NEXT_PUBLIC_GUTEN_CRUST_URL (http://localhost:8000/api/guten) and NEXT_PUBLIC_API_BASE_URL (http://localhost:8000/api). Local .env files stay outside Git.

## Content and files

Routes and components are under src/app and src/components. public/assets contains ignored content images: keep those files locally for serving and back them up separately. Do not remove assets just because Git ignores them.

See [local operations](../guten/README.md), [storage and Git conventions](../guten/docs/storage-and-git.md), and [database recovery](../guten-datalake/docs/psql/how-to-backup-psql.md). Documents in docs describe earlier design intent and may include future functionality.
