# GitHub Pages Deployment Guide

## Quick Fix for MIME Type Error

The error you're seeing happens because GitHub Pages needs the **built version** of your app, not the source files.

## Step-by-Step Deployment

### Option 1: Automatic Deployment (Recommended)

1. **Enable GitHub Pages in your repository:**
   - Go to your GitHub repository
   - Click **Settings** → **Pages**
   - Under **Source**, select **GitHub Actions**

2. **Push the workflow file:**
   - The `.github/workflows/deploy.yml` file I created will automatically build and deploy your app
   - Just commit and push:
   ```bash
   git add .
   git commit -m "Add GitHub Pages deployment"
   git push
   ```

3. **Wait for deployment:**
   - Go to **Actions** tab in your GitHub repo
   - The workflow will build and deploy automatically
   - Your app will be available at: `https://[your-username].github.io/market-tycoon-agency/`

### Option 2: Manual Deployment

1. **Build the app locally:**
   ```bash
   npm run build
   ```

2. **Copy the dist folder to a branch:**
   ```bash
   git checkout -b gh-pages
   git add dist
   git commit -m "Deploy to GitHub Pages"
   git subtree push --prefix dist origin gh-pages
   ```

3. **Configure GitHub Pages:**
   - Go to **Settings** → **Pages**
   - Select **gh-pages** branch and **/ (root)** folder

## Important: Custom Domain Configuration

### If using a custom domain (like buzztard.me):

1. **vite.config.js** - Base path is already set to `/` for custom domains ✅
2. **CNAME file** - Created with `buzztard.me` ✅
3. **GitHub Pages Settings:**
   - Go to **Settings** → **Pages**
   - Under **Custom domain**, enter: `buzztard.me`
   - Check **Enforce HTTPS**

4. **DNS Configuration:**
   - Add a CNAME record pointing `buzztard.me` to `[your-username].github.io`
   - Or add A records pointing to GitHub Pages IPs:
     - 185.199.108.153
     - 185.199.109.153
     - 185.199.110.153
     - 185.199.111.153

### If using GitHub Pages subdomain:

1. **vite.config.js** - Change the base path:
   ```js
   base: process.env.NODE_ENV === 'production' ? '/market-tycoon-agency/' : '/',
   ```
   (Change `market-tycoon-agency` to your actual repo name)

## After Deployment

- Your app will be at: `https://[username].github.io/[repo-name]/`
- The 404.html file handles SPA routing for direct URL access
- All assets will load correctly with proper MIME types

## Troubleshooting

### MIME Type Error (text/html instead of application/javascript)

**This means the server is serving source files instead of built files.**

**Solution:**
1. Make sure the app is **built and deployed** (check Actions tab)
2. The base path in `vite.config.js` should be `/` for custom domains
3. Clear browser cache and hard refresh (Ctrl+Shift+R)
4. Wait a few minutes after deployment for DNS/propagation

### Routes not working?
- The 404.html file should handle this automatically
- Make sure 404.html is in the dist folder after build

### Assets not loading?
- Check that the base path in vite.config.js is correct:
  - Custom domain: `/`
  - GitHub subdomain: `/repo-name/`
- Verify CNAME file is in the dist folder (for custom domains)

