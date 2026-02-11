# Deployment guide: New repo + deploy (company project)

Follow these steps in order. Use the Git host your company uses (GitHub, GitLab, or Bitbucket).

---

## Part 1: Create a new repository on Git

### If your company uses **GitHub**

1. Log in to [github.com](https://github.com).
2. Click the **+** (top right) → **New repository**.
3. Fill in:
   - **Repository name:** e.g. `dgmaaya-launchpad-frontend` (or whatever your team uses).
   - **Description:** optional (e.g. “DG Maaya launchpad frontend”).
   - **Visibility:** choose **Private** (recommended for company) or **Public** if allowed.
   - **Do not** check “Add a README”, “Add .gitignore”, or “Choose a license” (this project already has them).
4. Click **Create repository**.
5. On the new repo page, copy the repo URL. It will look like:
   - **HTTPS:** `https://github.com/YOUR_ORG/dgmaaya-launchpad-frontend.git`
   - **SSH:** `git@github.com:YOUR_ORG/dgmaaya-launchpad-frontend.git`  
   You will need this in Part 2.

### If your company uses **GitLab**

1. Log in to your GitLab instance (e.g. [gitlab.com](https://gitlab.com) or your company GitLab URL).
2. Click **New project** → **Create blank project**.
3. **Project name:** e.g. `dgmaaya-launchpad-frontend`.
4. **Visibility:** Private (or as per company policy).
5. **Do not** enable “Initialize repository with a README”.
6. Click **Create project**.
7. Copy the project URL (HTTPS or SSH) from the setup instructions.

### If your company uses **Bitbucket**

1. Log in to [bitbucket.org](https://bitbucket.org) (or your company Bitbucket).
2. **Create** → **Repository**.
3. **Repository name:** e.g. `dgmaaya-launchpad-frontend`.
4. **Access level:** Private (or as per company policy).
5. **Do not** add a README or .gitignore.
6. Click **Create repository**.
7. Copy the repository URL (HTTPS or SSH).

---

## Part 2: Push this project to the new repo

Do this from your machine, in the project folder (`dgmaaya-launchpad-frontend`).

### 2.1 Check what’s ignored (important for company security)

Your `.gitignore` should already exclude secrets and build artifacts. Confirm it contains:

- `node_modules/`
- `dist/`
- `.env`
- `.env.local`
- `.env.*.local`

**Never commit `.env`** — it may contain API URLs or keys. Use `.env.example` as a template only; real values go in the host (Vercel/Netlify) later.

### 2.2 Open terminal in the project folder

- **Windows:** PowerShell or Command Prompt, `cd` to the project folder.
- **Mac/Linux:** Terminal, `cd` to the project folder.

Example (adjust path to your machine):

```bash
cd d:\IDEOFUZION\projects\dgmaaya-launchpad-frontend
```

### 2.3 See if Git is already initialized

Run:

```bash
git status
```

- If you see “not a git repository”: go to **2.4**.
- If you see a list of files or “nothing to commit”: go to **2.5**.

### 2.4 Initialize Git (only if there was no repo)

Run:

```bash
git init
```

Then go to **2.5**.

### 2.5 Add the remote (point to your new repo)

Replace `YOUR_REPO_URL` with the URL you copied in Part 1.

**If this is the first time adding a remote:**

```bash
git remote add origin YOUR_REPO_URL
```

Example (GitHub HTTPS):

```bash
git remote add origin https://github.com/YOUR_ORG/dgmaaya-launchpad-frontend.git
```

**If you already had a different `origin` and want to replace it:**

```bash
git remote set-url origin YOUR_REPO_URL
```

Check it:

```bash
git remote -v
```

You should see `origin` pointing to your new repo.

### 2.6 Stage, commit, and push

```bash
git add .
git status
```

Review the list. Ensure **no** `.env` or `node_modules` appear. If they do, fix `.gitignore` and run `git add .` again.

Commit:

```bash
git commit -m "Initial commit: DG Maaya launchpad frontend"
```

Push to the default branch (often `main` or `master`). If your new repo’s default branch is `main`:

```bash
git push -u origin main
```

If your repo was created with `master`:

```bash
git push -u origin master
```

If you get an error about branch name, use the exact branch name the Git host shows (e.g. `main`). After this, your code is in the new company repo.

---

## Part 3: Deploy to Vercel or Netlify

Use **one** of the two options below.

### Option A: Deploy with Vercel

1. Go to [vercel.com](https://vercel.com) and log in (use company account if you have one).
2. Click **Add New** → **Project**.
3. **Import** the Git provider (GitHub / GitLab / Bitbucket) and select the **new repo** you just pushed.
4. **Configure project:**
   - **Framework Preset:** Vite (or leave as detected).
   - **Build Command:** `npm run build` (or leave empty; `vercel.json` sets it).
   - **Output Directory:** `dist` (or leave empty; `vercel.json` sets it).
   - **Root Directory:** leave blank unless the app lives in a subfolder.
5. **Environment variables:**  
   Click **Environment Variables** and add:
   - **Name:** `VITE_API_BASE_URL`  
   - **Value:** your backend root URL, e.g. `https://develop.api.emaaya.digimaaya.com`  
   - **No trailing slash.**  
   Add for Production (and optionally Preview if you use branch deploys).
6. Click **Deploy**.
7. When it finishes, Vercel gives you a URL like `https://your-project.vercel.app`. Test the app and API calls.

**Later:** Backend team must allow this URL in CORS and, for Google OAuth, set `FRONTEND_URL` to this origin.

### Option B: Deploy with Netlify

1. Go to [netlify.com](https://netlify.com) and log in (use company account if you have one).
2. **Add new site** → **Import an existing project**.
3. Connect GitHub/GitLab/Bitbucket and choose the **new repo**.
4. Netlify will read `netlify.toml`:
   - **Build command:** `npm run build`
   - **Publish directory:** `dist`
   You can leave these as pre-filled.
5. **Environment variables:**  
   Before deploying (or under **Site settings** → **Environment variables** after), add:
   - **Key:** `VITE_API_BASE_URL`  
   - **Value:** your backend root URL (no trailing slash).
6. Click **Deploy site**.
7. Netlify will give you a URL like `https://something.netlify.app`. Test the app and API.

**Later:** Backend team must allow this URL in CORS and, for Google OAuth, set `FRONTEND_URL` to this origin.

---

## Part 4: After first deploy (checklist)

- [ ] App loads at the Vercel/Netlify URL.
- [ ] `VITE_API_BASE_URL` is set in the host’s environment variables (no `.env` in repo).
- [ ] Backend CORS includes the frontend origin (e.g. `https://your-app.vercel.app` or `https://your-site.netlify.app`).
- [ ] If you use Google OAuth: backend `FRONTEND_URL` is set to the same frontend URL.
- [ ] Team knows the deployment URL and that future pushes to the default branch will auto-deploy (Vercel/Netlify default behavior).

---

## Quick reference

| Step | What to do |
|------|------------|
| 1 | Create new **private** repo on GitHub/GitLab/Bitbucket (no README/.gitignore). |
| 2 | Copy repo URL. In project folder: `git remote add origin URL` (or `set-url` if replacing). |
| 3 | `git add .` → check no `.env` → `git commit -m "Initial commit..."` → `git push -u origin main` (or `master`). |
| 4 | In Vercel or Netlify: Import repo → set `VITE_API_BASE_URL` → Deploy. |
| 5 | Share URL with backend for CORS and OAuth `FRONTEND_URL`. |

If your company uses a specific Git host (e.g. Azure DevOps, self-hosted GitLab), the same idea applies: create a new repo, add it as `origin`, push, then connect that repo to Vercel or Netlify for deploy.
