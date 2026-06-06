# Go-Live Checklist

DURON is prepared for deployment, but it must not be pushed live until the owner confirms. Do not deploy, push to GitHub, create cloud resources, connect domains, or change production hosting without explicit approval.

## Required Before Live

- GitHub repo/access: the current workspace is initialized as a local Git repository on `main`. Before launch, provide a GitHub repo URL/access or approve creating and pushing to a new GitHub repo.
- MongoDB Atlas URI: received and placed only in ignored local production env draft. Production startup rejects localhost, Docker-local, and placeholder Mongo URIs.
- Frontend domain: set `NEXT_PUBLIC_SITE_URL` to the final public website URL.
- Backend hosting/domain: choose the backend host and set `NEXT_PUBLIC_API_URL` to the API URL ending with `/api/v1`.
- CORS URL: set API `CLIENT_URL` to the same frontend domain.
- Admin email/password: received and placed only in ignored local production env draft. After the first admin exists, set `BOOTSTRAP_ADMIN_ON_START=false`.
- Strong JWT secret: generated and placed only in ignored local production env draft. Do not reuse local or shared secrets.

## Prepared Files

- `apps/api/.env.example` documents backend variables.
- `apps/web/.env.example` documents frontend variables.
- `apps/api/.env.production.local` is an ignored pre-live draft for backend values.
- `apps/web/.env.production.local` is an ignored pre-live draft for frontend values.
- `.gitignore` keeps real env files and production-local drafts out of Git.

## Pre-Live Commands

Run these from the project root before deployment:

```bash
npm.cmd run typecheck
npm.cmd run lint
npm.cmd run build
```

PowerShell may block `npm.ps1`; use `npm.cmd` on Windows.

## Approval Gate

Ask the owner before each live action:

1. Push/init GitHub repo.
2. Create or connect MongoDB Atlas.
3. Configure production env variables.
4. Connect frontend domain.
5. Deploy backend hosting.
6. Deploy frontend hosting.
7. Seed or bootstrap the production admin.
