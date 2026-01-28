# Deployment Guide

## Cloudflare Pages Deployment

MeasureOver is designed to be deployed to Cloudflare Pages. Here are the deployment options:

### Option 1: GitHub Integration (Recommended)

1. **Connect Repository to Cloudflare Pages:**
   - Go to [Cloudflare Dashboard](https://dash.cloudflare.com/)
   - Navigate to **Pages** → **Create a project**
   - Connect your GitHub repository
   - Select the `measureovercom` repository

2. **Configure Build Settings:**
   - **Framework preset**: Astro
   - **Build command**: `npm run build`
   - **Build output directory**: `dist`
   - **Root directory**: `/` (leave empty)
   - **Node version**: 20 (or latest LTS)

3. **Environment Variables:**
   - No environment variables needed for this static site

4. **Deploy:**
   - Click **Save and Deploy**
   - Cloudflare will automatically deploy on every push to `main` branch

### Option 2: Wrangler CLI

1. **Install Wrangler:**
   ```bash
   npm install -g wrangler
   ```

2. **Login to Cloudflare:**
   ```bash
   wrangler login
   ```

3. **Build the project:**
   ```bash
   npm run build
   ```

4. **Deploy:**
   ```bash
   wrangler pages deploy dist --project-name=measureovercom
   ```

### Option 3: GitHub Actions (CI/CD)

The repository includes a GitHub Actions workflow (`.github/workflows/deploy.yml`) that automatically deploys to Cloudflare Pages on push to `main`.

**Setup:**
1. Go to your GitHub repository → Settings → Secrets and variables → Actions
2. Add the following secrets:
   - `CLOUDFLARE_API_TOKEN`: Your Cloudflare API token (create at https://dash.cloudflare.com/profile/api-tokens)
   - `CLOUDFLARE_ACCOUNT_ID`: Your Cloudflare Account ID (found in dashboard URL)

**Required Permissions for API Token:**
- Account: Cloudflare Pages: Edit
- Zone: (not required for Pages)

### Custom Domain

After deployment, you can add a custom domain:

1. Go to Cloudflare Pages → Your project → Custom domains
2. Click **Set up a custom domain**
3. Enter your domain (e.g., `measureover.com`)
4. Follow DNS configuration instructions

### Build Configuration

The project is configured for static site generation:
- **Output**: Static HTML/CSS/JS
- **Build directory**: `dist/`
- **No server-side rendering**: Fully client-side application

### Mobile Testing

After deployment, test on mobile devices:

1. **Open the deployed URL** on your mobile device
2. **Test key features:**
   - Image upload (drag-drop won't work, but file picker should)
   - Drawing lines with touch
   - Moving lines (long press)
   - Grid toggle
   - Theme switching
   - Language selector
   - Export functionality

3. **Common mobile issues to check:**
   - Touch event handling
   - Canvas interaction
   - Viewport scaling
   - Button sizes (should be touch-friendly)
   - Long press detection for moving lines

### Performance Optimization

The build includes:
- Minified JavaScript
- Optimized CSS
- Tree-shaking
- Code splitting
- Gzip compression (handled by Cloudflare)

### Troubleshooting

**Build fails:**
- Check Node.js version (requires 18+)
- Run `npm install` locally to verify dependencies
- Check build logs in Cloudflare dashboard

**Assets not loading:**
- Verify `dist/` directory structure
- Check that `public/` files are copied to `dist/`
- Ensure base path is correct (should be `/`)

**Mobile issues:**
- Check viewport meta tag in `Layout.astro`
- Verify touch event handlers
- Test on actual devices, not just browser dev tools

## Local Testing Before Deployment

1. **Build locally:**
   ```bash
   npm run build
   ```

2. **Preview production build:**
   ```bash
   npm run preview
   ```

3. **Test on mobile:**
   - Use your local network IP: `http://YOUR_IP:4321`
   - Or use a tool like [ngrok](https://ngrok.com/) to expose localhost

## Post-Deployment Checklist

- [ ] Site loads correctly
- [ ] Image upload works
- [ ] Drawing lines works (desktop and mobile)
- [ ] Moving lines works (desktop and mobile)
- [ ] Grid toggle works
- [ ] Theme switching works
- [ ] Language selector works
- [ ] Export functionality works
- [ ] Coordinates display correctly
- [ ] Footer displays correctly
- [ ] Mobile viewport is correct
- [ ] Touch interactions work smoothly
