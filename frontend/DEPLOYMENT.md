# Frontend Deployment Guide

## 🚀 Quick Deploy Options

### Option 1: Vercel (Recommended - 5 minutes)

**Best for**: Quick demos, investor presentations, staging environments

1. **Install Vercel CLI**
```bash
npm i -g vercel
```

2. **Deploy**
```bash
cd frontend
vercel
```

3. **Follow prompts**:
   - Link to existing project or create new
   - Set build settings (auto-detected for Next.js)
   - Deploy!

4. **Set Environment Variables** (in Vercel dashboard):
   - `NEXT_PUBLIC_API_URL` = Your backend URL

**Result**: Live URL in ~2 minutes (e.g., `studented-frontend.vercel.app`)

---

### Option 2: Google Cloud Run (Production-Ready)

**Best for**: Production deployment, auto-scaling, cost-effective

#### Prerequisites
- Google Cloud account
- gcloud CLI installed

#### Steps

1. **Build Docker Image**
```bash
cd frontend

# Build
docker build -t gcr.io/YOUR_PROJECT_ID/studented-frontend .

# Test locally
docker run -p 3001:3001 \
  -e NEXT_PUBLIC_API_URL=http://localhost:3000/api/v1 \
  gcr.io/YOUR_PROJECT_ID/studented-frontend
```

2. **Push to Google Container Registry**
```bash
# Enable Container Registry API
gcloud services enable containerregistry.googleapis.com

# Configure Docker auth
gcloud auth configure-docker

# Push image
docker push gcr.io/YOUR_PROJECT_ID/studented-frontend
```

3. **Deploy to Cloud Run**
```bash
gcloud run deploy studented-frontend \
  --image gcr.io/YOUR_PROJECT_ID/studented-frontend \
  --platform managed \
  --region us-central1 \
  --allow-unauthenticated \
  --set-env-vars NEXT_PUBLIC_API_URL=https://api.studented.me/api/v1 \
  --port 3001
```

4. **Get URL**
```bash
gcloud run services describe studented-frontend --region us-central1 --format 'value(status.url)'
```

**Cost**: ~$5-20/month (pay only for requests)

---

### Option 3: AWS Amplify

**Best for**: AWS ecosystem integration

1. **Install Amplify CLI**
```bash
npm install -g @aws-amplify/cli
amplify configure
```

2. **Initialize Amplify**
```bash
cd frontend
amplify init
```

3. **Deploy**
```bash
amplify add hosting
amplify publish
```

---

### Option 4: Netlify

**Best for**: Simple static hosting

1. **Install Netlify CLI**
```bash
npm install -g netlify-cli
```

2. **Deploy**
```bash
cd frontend
netlify deploy --prod
```

3. **Set Environment Variables** (in Netlify dashboard):
   - `NEXT_PUBLIC_API_URL`

---

## 🔧 Environment Variables

All deployment platforms need this variable:

| Variable | Example | Required |
|----------|---------|----------|
| `NEXT_PUBLIC_API_URL` | `https://api.studented.me/api/v1` | ✅ Yes |

**Important**: The variable MUST start with `NEXT_PUBLIC_` to be accessible in the browser.

---

## 🎯 For Investor Demo (5-Minute Setup)

### Quick Vercel Deploy

```bash
# 1. Navigate to frontend
cd frontend

# 2. Install dependencies
npm install

# 3. Deploy to Vercel
vercel --prod

# 4. Set backend URL (in Vercel dashboard)
# Go to: Settings > Environment Variables
# Add: NEXT_PUBLIC_API_URL = your-backend-url

# 5. Redeploy
vercel --prod
```

**Done!** You now have a live URL to show investors.

---

## 📊 Production Checklist

Before going to production, ensure:

- [ ] Environment variables set correctly
- [ ] Backend URL uses HTTPS
- [ ] CORS configured on backend
- [ ] Analytics added (Google Analytics, Mixpanel)
- [ ] Error tracking enabled (Sentry)
- [ ] Custom domain configured
- [ ] SSL certificate active
- [ ] Performance monitoring enabled
- [ ] SEO meta tags added
- [ ] Sitemap generated

---

## 🌐 Custom Domain Setup

### Vercel

1. Go to Vercel dashboard
2. Select project > Settings > Domains
3. Add your domain (e.g., `app.studented.me`)
4. Update DNS records as shown
5. Wait for propagation (~5 minutes)

### Cloud Run

1. Map custom domain:
```bash
gcloud run domain-mappings create \
  --service studented-frontend \
  --domain app.studented.me \
  --region us-central1
```

2. Update DNS:
   - Add CNAME record: `app` → `ghs.googlehosted.com`

---

## 🚨 Troubleshooting

### Issue: "API connection failed"

**Solution**:
1. Check environment variable: `echo $NEXT_PUBLIC_API_URL`
2. Verify backend is accessible: `curl YOUR_BACKEND_URL/api/v1/health`
3. Check CORS settings on backend
4. Ensure URL uses `https://` in production

### Issue: "Build failed"

**Solution**:
```bash
# Clear cache
rm -rf .next node_modules

# Reinstall
npm install

# Try build
npm run build
```

### Issue: "Authentication not working"

**Solution**:
1. Clear browser localStorage
2. Check backend JWT secret matches
3. Verify token expiry times
4. Check browser console for errors

---

## 🔄 CI/CD Setup

### GitHub Actions (Auto-deploy on push)

Create `.github/workflows/deploy.yml`:

```yaml
name: Deploy Frontend

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3

      - name: Setup Node
        uses: actions/setup-node@v3
        with:
          node-version: '20'

      - name: Install dependencies
        working-directory: frontend
        run: npm ci

      - name: Build
        working-directory: frontend
        env:
          NEXT_PUBLIC_API_URL: ${{ secrets.NEXT_PUBLIC_API_URL }}
        run: npm run build

      - name: Deploy to Vercel
        uses: amondnet/vercel-action@v25
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.VERCEL_ORG_ID }}
          vercel-project-id: ${{ secrets.VERCEL_PROJECT_ID }}
          working-directory: frontend
```

---

## 📈 Performance Optimization

### Before Deployment

1. **Optimize Images**
   - Use Next.js Image component
   - Add image optimization config

2. **Enable Compression**
   - Already enabled in Next.js by default

3. **Add Caching**
   - Set cache headers in `next.config.mjs`

4. **Bundle Analysis**
```bash
npm run build
# Check bundle size in output
```

---

## 💰 Cost Estimates

| Platform | Cost/Month | Notes |
|----------|-----------|-------|
| Vercel | $0-20 | Free tier: 100GB bandwidth |
| Google Cloud Run | $5-20 | Pay per request |
| AWS Amplify | $15-30 | Includes hosting + CDN |
| Netlify | $0-19 | Free tier: 100GB bandwidth |

---

## 🎯 Recommended Setup

**For Investor Demo**: Vercel (free, instant)

**For MVP/Beta**: Google Cloud Run (scalable, cheap)

**For Production**: Google Cloud Run + Cloudflare CDN

---

## 📞 Support

Questions about deployment?
1. Check the [README.md](README.md)
2. Review Next.js deployment docs
3. Contact the dev team

---

**Last updated**: March 2026
