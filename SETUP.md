# Quick Setup Checklist

Follow these steps in order to get your website live:

## 1. Install Dependencies
```bash
npm install
```

## 2. Test Locally
```bash
npm run dev
```
Visit http://localhost:3000 to see your site.

## 3. Create GitHub Repository
1. Go to https://github.com/new
2. Create a new **public** repository
3. Name it (e.g., `hotdogfatcat`)
4. **Don't** initialize with README

## 4. Push Code to GitHub
```bash
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO_NAME.git
git push -u origin main
```

## 5. Enable GitHub Pages
1. Go to your repository → **Settings** → **Pages**
2. Under **Source**, select **GitHub Actions**
3. The workflow will automatically deploy on the next push

## 6. Buy Domain (Optional but Recommended)
- **Namecheap**: https://www.namecheap.com
- **Cloudflare Registrar**: https://www.cloudflare.com/products/registrar
- **Squarespace Domains**: https://www.squarespace.com/domains

## 7. Configure Custom Domain
1. In GitHub Pages settings, add your domain
2. At your domain registrar, add DNS records:
   - **A records** (4 total): `185.199.108.153`, `185.199.109.153`, `185.199.110.153`, `185.199.111.153`
   - **CNAME** for www: `YOUR_USERNAME.github.io`
3. Wait 24-48 hours for DNS propagation
4. SSL certificate will be automatically provisioned

## 8. Set Up Free Email (Optional)
- **Zoho Mail** (Best free option): https://www.zoho.com/mail/
  - Free tier: 5GB, 5 users, custom domain
- **Cloudflare Email Routing**: Free forwarding (requires Cloudflare)

## Next Steps
- Customize `app/page.tsx` for your landing page
- Add more pages in the `app` directory
- Add images to the `public` directory
- Modify `app/globals.css` for styling

See README.md for detailed instructions.

