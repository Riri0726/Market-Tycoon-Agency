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

## Important: Update Repository Name

If your GitHub repository has a **different name** than `market-tycoon-agency`, you need to update:

1. **vite.config.js** - Change the base path:
   ```js
   base: process.env.NODE_ENV === 'production' ? '/your-repo-name/' : '/',
   ```

2. **.github/workflows/deploy.yml** - Update if needed (usually not necessary)

## After Deployment

- Your app will be at: `https://[username].github.io/[repo-name]/`
- The 404.html file handles SPA routing for direct URL access
- All assets will load correctly with proper MIME types

## Troubleshooting

- **Still seeing MIME errors?** Make sure you're accessing the deployed version, not the source files
- **Routes not working?** The 404.html file should handle this automatically
- **Assets not loading?** Check that the base path in vite.config.js matches your repo name

