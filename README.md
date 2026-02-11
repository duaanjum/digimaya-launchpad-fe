# Web3 Fundraising Interface Design

This is a code bundle for Web3 Fundraising Interface Design. The original project is available at https://www.figma.com/design/e03f7ZYH0QBW0Fycr8P6BX/Web3-Fundraising-Interface-Design.

**Deploying (new repo + Vercel/Netlify):** See **[DEPLOYMENT.md](./DEPLOYMENT.md)** for a full step-by-step guide (create repo → push → deploy).

## Setup

1. Copy `.env.example` to `.env`.
2. Set `VITE_API_BASE_URL` in `.env` to your backend root (e.g. `http://localhost:3000`). Do not add a trailing slash; the app uses `/api/v1` under this base.

## Running the code

Run `npm i` to install the dependencies.

Run `npm run dev` to start the development server.

## Deploy (Vercel or Netlify)

The repo includes `vercel.json` and `netlify.toml` so you can deploy as-is.

### Vercel

1. Push the repo to GitHub/GitLab/Bitbucket.
2. Go to [vercel.com](https://vercel.com) → **Add New** → **Project** and import the repo.
3. Leave **Build Command** as `npm run build` and **Output Directory** as `dist` (or leave empty; the config sets them).
4. Under **Environment Variables**, add `VITE_API_BASE_URL` with your backend URL (e.g. `https://develop.api.emaaya.digimaaya.com`). No trailing slash.
5. Deploy.

### Netlify

1. Push the repo to GitHub/GitLab/Bitbucket.
2. Go to [netlify.com](https://netlify.com) → **Add new site** → **Import an existing project** and connect the repo.
3. Build command and publish directory are read from `netlify.toml` (`npm run build` and `dist`).
4. Under **Site settings** → **Environment variables**, add `VITE_API_BASE_URL` with your backend URL. No trailing slash.
5. Deploy.

**Note:** Your backend must allow the frontend origin (e.g. `https://your-app.vercel.app` or `https://your-site.netlify.app`) for CORS and, if using Google OAuth, set `FRONTEND_URL` to that origin for the callback.
