# DURON

A full-stack, production-ready business and portfolio website for DURON. It includes a Next.js frontend, an Express REST API, MongoDB models, JWT-secured admin routes, contact inquiry capture, a finance sheet, Docker support, and deployment notes for Vercel plus a Node backend host.

## Stack

- Frontend: Next.js 16, React 19, TypeScript, Tailwind CSS 4, Framer Motion
- Backend: Node.js, Express 5, TypeScript, MongoDB, Mongoose 9
- Security: JWT auth, bcrypt password hashing, Helmet, CORS allow-listing, rate limiting, Zod validation
- Tooling: npm workspaces, Docker Compose, shared TypeScript package

## Project Structure

```text
apps/
  api/      Express REST API, MongoDB models, auth, admin CRUD
  web/      Next.js app router frontend and admin UI
packages/
  shared/   Shared constants and TypeScript contracts
```

## Local Setup

1. Install Node.js 22+ and MongoDB, or use Docker.
2. Copy environment files:

```bash
cp .env.example .env
cp apps/api/.env.example apps/api/.env
cp apps/web/.env.example apps/web/.env.local
```

3. Install dependencies:

```bash
npm install
```

4. Seed the database with demo content if needed:

```bash
npm run seed
```

5. Start both apps:

```bash
npm run dev
```

Frontend: `http://localhost:3000`  
API: `http://localhost:4000/api/v1`

## Docker

```bash
docker compose up --build
```

The Compose stack starts MongoDB, the API, and the web app.

## Admin Login

First-login credentials come from `SEED_ADMIN_EMAIL` and `SEED_ADMIN_PASSWORD` in `apps/api/.env`. The API creates this first admin automatically on startup when `BOOTSTRAP_ADMIN_ON_START=true` and the users collection is empty.

Use a unique password before deploying, then set `BOOTSTRAP_ADMIN_ON_START=false` after the first production admin exists.

## Pre-Live Approval Gate

This project is ready to prepare for production, but it should not be pushed live until the owner approves. Before deployment, collect GitHub repo/access, MongoDB Atlas URI, frontend domain, backend host/domain, admin email/password, and a strong `JWT_SECRET`.

Use [GO_LIVE_CHECKLIST.md](./GO_LIVE_CHECKLIST.md) for the exact launch checklist. Real secrets and production drafts are ignored by Git.

## Production Deployment

### Frontend on Vercel

1. Import the repository in Vercel.
2. Set the project root to `apps/web`.
3. Add `NEXT_PUBLIC_SITE_URL` and `NEXT_PUBLIC_API_URL`.
   - `NEXT_PUBLIC_API_URL` must point to your deployed backend base URL, ending with `/api/v1`.
4. Use the included `apps/web/vercel.json` settings.

### Backend on Render, Railway, Fly.io, or VPS

1. Use the repository root for native Node deployments so npm workspaces can install `packages/shared`.
   - Build command: `npm install && npm run build -w packages/shared && npm run build -w apps/api`
   - Start command: `npm start -w apps/api`
2. For Docker deployments, use the repository root as the build context and `apps/api/Dockerfile` as the Dockerfile path.
3. Add production environment variables:
   - `MONGO_URI`
   - `JWT_SECRET`
   - `CLIENT_URL`
   - `JWT_EXPIRES_IN`
   - `RATE_LIMIT_WINDOW_MS`
   - `RATE_LIMIT_MAX`
   - `BOOTSTRAP_ADMIN_ON_START`
   - `SEED_ADMIN_NAME`
   - `SEED_ADMIN_EMAIL`
   - `SEED_ADMIN_PASSWORD`
4. Set the public backend URL in the frontend as `NEXT_PUBLIC_API_URL`, ending with `/api/v1`.

Set `CLIENT_URL` to your deployed frontend URL so CORS allows the contact form and admin portal to reach the API.

Ignored pre-live env drafts are available at `apps/api/.env.production.local` and `apps/web/.env.production.local`. Fill the real MongoDB URI and deployed domains before launching.

## Quality Gates

```bash
npm run typecheck
npm run lint
npm run build
```

## API Documentation

See [API.md](./API.md) and [apps/api/openapi.yaml](./apps/api/openapi.yaml).
