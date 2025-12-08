# GitHub Pages Website Setup

A Next.js static website configured for deployment to GitHub Pages with custom domain support.

## Quick Start

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Run development server:**
   ```bash
   npm run dev
   ```
   Open [http://localhost:3000](http://localhost:3000) in your browser.

3. **Build for production:**
   ```bash
   npm run build
   ```
   The static files will be generated in the `out` directory.

## Complete Setup Guide

### Step 1: Domain Registration

Choose a domain registrar and purchase your domain:

- **Namecheap** (~$8-12/year for .com) - User-friendly interface
- **Cloudflare Registrar** (~$8-9/year) - No markup, transparent pricing
- **Squarespace Domains** (formerly Google Domains, ~$12/year)

**Process:**
1. Search for your desired domain name
2. Complete the purchase
3. Wait for DNS propagation (usually 24-48 hours)

### Step 2: GitHub Repository Setup

1. **Create a new repository on GitHub:**
   - Go to [github.com/new](https://github.com/new)
   - Name your repository (e.g., `hotdogfatcat`)
   - Make it **public** (required for free GitHub Pages)
   - Don't initialize with README (we already have one)

2. **Push your code:**
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git branch -M main
   git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO_NAME.git
   git push -u origin main
   ```

### Step 3: Enable GitHub Pages

1. Go to your repository on GitHub
2. Click **Settings** → **Pages** (in the left sidebar)
3. Under **Source**, select:
   - **Source**: `GitHub Actions`
4. The GitHub Actions workflow will automatically deploy your site

### Step 4: Configure Custom Domain

1. **In GitHub Pages settings:**
   - Scroll to **Custom domain** section
   - Enter your domain (e.g., `yourdomain.com`)
   - Check **Enforce HTTPS** (this will be available after DNS is configured)

2. **Configure DNS at your domain registrar:**

   **For apex domain (yourdomain.com):**
   Add these **A records**:
   ```
   Type: A
   Host: @
   Value: 185.199.108.153
   TTL: 3600
   
   Type: A
   Host: @
   Value: 185.199.109.153
   TTL: 3600
   
   Type: A
   Host: @
   Value: 185.199.110.153
   TTL: 3600
   
   Type: A
   Host: @
   Value: 185.199.111.153
   TTL: 3600
   ```

   **For www subdomain (www.yourdomain.com):**
   Add this **CNAME record**:
   ```
   Type: CNAME
   Host: www
   Value: YOUR_USERNAME.github.io
   TTL: 3600
   ```
   Replace `YOUR_USERNAME` with your GitHub username.

3. **Wait for DNS propagation:**
   - DNS changes can take 24-48 hours to propagate
   - You can check propagation status at [whatsmydns.net](https://www.whatsmydns.net)
   - GitHub will automatically provision an SSL certificate once DNS is configured

### Step 5: Free Email Hosting Setup

#### Option 1: Zoho Mail (Recommended - Best Free Option)

1. Go to [zoho.com/mail](https://www.zoho.com/mail/)
2. Sign up for **Zoho Mail Free**
3. Add your custom domain
4. Configure DNS records (MX, TXT, CNAME) as provided by Zoho
5. **Free tier includes:**
   - 5GB storage per user
   - Up to 5 users
   - Custom domain support
   - Webmail and mobile apps

#### Option 2: Cloudflare Email Routing (Free Email Forwarding)

1. Add your domain to Cloudflare (free)
2. Enable **Email Routing** in Cloudflare dashboard
3. Configure email forwarding rules
4. **Note:** This only forwards emails to an existing email address (doesn't provide inbox)

#### Option 3: Other Options

- **Google Workspace**: $6/user/month (not free, but reliable)
- **ProtonMail**: Free tier available, but custom domain requires paid plan
- **Tutanota**: Free tier available, but custom domain requires paid plan

### Step 6: Verify Everything Works

1. **Website:**
   - Visit `https://yourdomain.com` (should show your site with SSL)
   - Visit `https://www.yourdomain.com` (should redirect or show your site)

2. **Email:**
   - Send a test email to `yourname@yourdomain.com`
   - Verify it arrives in your inbox

## Project Structure

```
hotdogfatcat/
├── app/                    # Next.js app directory
│   ├── layout.tsx         # Root layout
│   ├── page.tsx           # Home page
│   └── globals.css        # Global styles
├── public/                # Static assets (images, favicons, etc.)
├── .github/
│   └── workflows/
│       └── deploy.yml     # GitHub Actions deployment workflow
├── next.config.js         # Next.js configuration (static export)
├── package.json           # Dependencies and scripts
├── tsconfig.json          # TypeScript configuration
└── README.md             # This file
```

## Customization

### Adding Pages

Create new files in the `app` directory:
- `app/about/page.tsx` → `/about`
- `app/contact/page.tsx` → `/contact`

### Styling

- Modify `app/globals.css` for global styles
- Add component-specific styles using CSS modules or styled-components
- The project uses Next.js 14 with the App Router

### Adding Images

1. Place images in the `public` directory
2. Reference them as `/image-name.jpg` in your components
3. Note: Images are unoptimized in static export (configured in `next.config.js`)

## Troubleshooting

### Site not updating after push
- Check GitHub Actions tab for workflow status
- Ensure workflow completed successfully
- Wait a few minutes for GitHub Pages to update

### Custom domain not working
- Verify DNS records are correct using [whatsmydns.net](https://www.whatsmydns.net)
- Ensure you added the custom domain in GitHub Pages settings
- Wait up to 24 hours for DNS propagation
- Check that SSL certificate is provisioned (may take time after DNS)

### Build errors
- Ensure Node.js version is 18+ (GitHub Actions uses Node 20)
- Run `npm install` to ensure all dependencies are installed
- Check that `next.config.js` has `output: 'export'` for static export

## Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [GitHub Pages Documentation](https://docs.github.com/en/pages)
- [Next.js Static Export](https://nextjs.org/docs/app/building-your-application/deploying/static-exports)
- [GitHub Actions Documentation](https://docs.github.com/en/actions)

## License

MIT

