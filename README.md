# Guten Portal

Next.js/React/MUI authoring application for Guten sites, sections, pages, references, and notes. The current local MVP edits draft data through Guten Crust. Docker Portal uses allowlisted GitHub login; native development remains local and unauthenticated. See [authentication setup](../guten/docs/authentication.md). Per-site publication is available on the dashboard. References and notes can be managed in the page editor; they are not yet rendered in View Draft or Sites. Guten Sites displays the last published copy.

## Local development

From the sibling coordination repository:

```bash
cd ../guten
make status
make run SERVICE=portal
make check SERVICE=portal
```

Portal uses port **3001**. The existing Node dependencies must be installed first. Use the check and build commands to validate changes before deployment.

Both HTTP clients share `NEXT_PUBLIC_API_BASE_URL` (default `http://localhost:8000/api`). The older `NEXT_PUBLIC_GUTEN_CRUST_URL` remains a fallback for compatibility; prefer the canonical setting in `.env.example`. Public settings are embedded during Next.js builds and must never contain secrets. Local `.env` files stay outside Git. `/health` is a process liveness endpoint. Docker authentication is enforced by the gateway for both pages and editing APIs. `NEXT_PUBLIC_AUTH_ENABLED=true` enables the Sign out link at build time; it does not itself enforce access control.

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

Cross-service browser acceptance tests live in the coordination repository: [testing guide](../guten/docs/testing.md).

## Containers

The Dockerfile and .dockerignore package this service without local secrets, dumps, installed dependencies or content media. Build/start it using the sibling coordination repository’s [Docker Compose guide](../guten/docs/docker.md). The container rehearsal uses a separate empty database and alternate localhost ports.

See [root pages and planned domain routing](../guten/docs/domain-routing.md) for the Portal home and public site entry points.
