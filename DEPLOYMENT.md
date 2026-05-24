# Deployment Guide — Dermavence Pharma Skincare App

This is a standalone, dynamic client-side React + Vite application that runs entirely in the browser. It is fully ready to deploy on **Netlify** with zero backend setup.

---

## Deploying to Netlify

### Step A: Push to GitHub/GitLab/Bitbucket
Ensure your local repository is pushed to a remote git provider.

### Step B: Connect and Deploy on Netlify
1. Go to [Netlify](https://www.netlify.com/) and log in.
2. Click **Add new site** -> **Import an existing project** -> Choose your Git provider.
3. Select your repository.
4. Netlify will auto-detect the configuration since it's at the root:
   * **Build command**: `npm run build`
   * **Publish directory**: `dist`
5. Click **Deploy Site**.

*Note: The `public/_redirects` file handles routing fallbacks so that reload/navigation operations on routes like `/cart` or `/wishlist` work seamlessly without throwing 404 errors.*
