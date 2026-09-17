# Guten Portal

Next.js/React/MUI authoring application for Guten sites, sections, pages, references, and notes. The current local MVP edits draft data through Guten Crust. Authentication remains unfinished. Per-site publication is available on the dashboard. References and notes can be managed in the page editor; they are not yet rendered in View Draft or Sites. Guten Sites displays the last published copy.

## Local development

From the sibling coordination repository:

```bash
cd ../guten
make status
make run SERVICE=portal
make check SERVICE=portal
```

Portal uses port **3001**. The existing Node dependencies must be installed first. Use the check and build commands to validate changes before deployment.

The current clients use NEXT_PUBLIC_GUTEN_CRUST_URL (http://localhost:8000/api/guten) and NEXT_PUBLIC_API_BASE_URL (http://localhost:8000/api). Local .env files stay outside Git.

## Content and files

Routes and components are under src/app and src/components. public/assets contains ignored content images: keep those files locally for serving and back them up separately. Do not remove assets just because Git ignores them.

See [local operations](../guten/README.md), [storage and Git conventions](../guten/docs/storage-and-git.md), and [database recovery](../guten-datalake/docs/psql/how-to-backup-psql.md). Documents in docs describe earlier design intent and may include future functionality.

## Project structure

```text
src/app/dashboard/ — site dashboard
src/app/sites/ — content management and ordering
src/app/draft/ — View Draft pages
src/components/ — editor controls and landing redirect
src/lib/ — clients, content types, theme
public/assets/ — ignored content media
```

References and notes support add, edit/cancel, and confirmed deletion below the page editor. Changes save without reloading the page. See the [editorial API contract](../guten-datalake/docs/editorial-refs-and-notes.md).

See [per-site publishing](../guten-datalake/docs/publishing.md) for the editor workflow, API, migration, and initial publication seeding. Portal/View Draft reads draft; Guten Sites reads published content only.
