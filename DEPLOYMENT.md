# Vercel Auto-Deployment Setup

This project is configured to auto-deploy to Vercel on every push to your selected branch (e.g. `main`).

## One-time setup

### 1. Connect GitHub to Lovable (if not already)
Lovable editor → **Connectors** → GitHub → Connect project. This creates a repo that mirrors the Lovable project in real time.

### 2. Import the repo in Vercel
1. Go to https://vercel.com/new
2. Import your GitHub repository
3. Vercel will auto-detect Vite — settings are already pinned in `vercel.json`:
   - Framework: Vite
   - Build: `npm run build`
   - Output: `dist`
4. Click **Deploy**

### 3. Add environment variables in Vercel
In Vercel → Project → **Settings → Environment Variables**, add:

| Name | Value |
|---|---|
| `VITE_SUPABASE_URL` | (from your local `.env`) |
| `VITE_SUPABASE_PUBLISHABLE_KEY` | (from your local `.env`) |
| `VITE_SUPABASE_PROJECT_ID` | (from your local `.env`) |

Apply to: Production, Preview, Development.

### 4. Pick the production branch
Vercel → Project → **Settings → Git → Production Branch** → set to `main` (or whichever branch you want auto-published).

## How it works after setup

- **Push / merge to production branch** → Vercel builds and publishes to your production domain automatically.
- **Push to any other branch / open a PR** → Vercel creates a Preview Deployment with a unique URL.
- **No manual "Update" click required.**

## Custom domain
Vercel → Project → **Settings → Domains** → add your domain and follow DNS instructions.

## Notes
- Lovable's `.lovable.app` URL still requires the manual Publish click — that's separate from Vercel.
- Backend (Supabase Edge Functions, migrations) continues to deploy through Lovable Cloud automatically; Vercel only hosts the frontend.
- SPA deep-link routing is handled by the `rewrites` rule in `vercel.json`.
