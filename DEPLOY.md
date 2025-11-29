# 🚀 Production Deployment Guide

Complete guide to deploy your AI email tool to production.

## Architecture Overview

```
┌─────────────┐     ┌──────────────┐     ┌─────────────┐
│   Vercel    │────▶│  Supabase    │     │   Upstash   │
│  (Next.js)  │     │ (PostgreSQL) │     │   (Redis)   │
└─────────────┘     └──────────────┘     └─────────────┘
       │                                          │
       │                                          │
       ▼                                          ▼
┌─────────────────────────────────────────────────────┐
│          Railway/Render (Background Worker)         │
└─────────────────────────────────────────────────────┘
```

---

## Part 1: Deploy Next.js App (Vercel)

### Step 1: Push to GitHub

```bash
git init
git add .
git commit -m "Initial commit"
git remote add origin <your-github-repo>
git push -u origin main
```

### Step 2: Deploy to Vercel

1. Go to https://vercel.com
2. Click "New Project"
3. Import your GitHub repo
4. Configure:
   - **Framework Preset:** Next.js
   - **Root Directory:** ./
   - **Build Command:** `npm run build`
   - **Install Command:** `npm install`

### Step 3: Add Environment Variables

In Vercel dashboard, add these variables:

```
DATABASE_URL=<your-supabase-url>
REDIS_URL=<your-upstash-url>
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=<clerk-publishable>
CLERK_SECRET_KEY=<clerk-secret>
OPENAI_API_KEY=<openai-key>
PROXYCURL_API_KEY=<proxycurl-key>
BRAVE_SEARCH_API_KEY=<brave-key> (optional)
NEXT_PUBLIC_URL=https://your-app.vercel.app
```

### Step 4: Deploy

Click "Deploy" and wait ~2 minutes.

Your app will be live at: `https://your-app.vercel.app`

---

## Part 2: Deploy Background Worker

You need to deploy the worker separately because it needs to run continuously.

### Option A: Railway (Recommended - Easiest)

**Step 1: Create Railway Project**

1. Go to https://railway.app
2. Sign up with GitHub
3. Click "New Project"
4. Choose "Deploy from GitHub repo"
5. Select your repo

**Step 2: Configure**

1. Click on your service
2. Go to "Settings"
3. Set these:
   - **Root Directory:** ./
   - **Start Command:** `node worker.js`
   - **Build Command:** `npm install && npx prisma generate`

**Step 3: Add Environment Variables**

Add the same variables as Vercel:
- `DATABASE_URL`
- `REDIS_URL`
- `OPENAI_API_KEY`
- `PROXYCURL_API_KEY`
- `BRAVE_SEARCH_API_KEY`

**Step 4: Deploy**

Railway will automatically deploy. Check logs to verify worker is running.

**Cost:** ~$5-20/month depending on usage

---

### Option B: Render (Alternative)

**Step 1: Create Render Account**

1. Go to https://render.com
2. Sign up with GitHub

**Step 2: Create Background Worker**

1. Click "New +"
2. Select "Background Worker"
3. Connect your GitHub repo
4. Configure:
   - **Name:** email-tool-worker
   - **Environment:** Node
   - **Build Command:** `npm install && npx prisma generate`
   - **Start Command:** `node worker.js`

**Step 3: Add Environment Variables**

Same as Railway (see above)

**Step 4: Deploy**

Click "Create Background Worker"

**Cost:** ~$7/month (starter plan)

---

### Option C: Docker (Advanced)

**Dockerfile:**

```dockerfile
FROM node:20-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci --only=production

COPY . .
RUN npx prisma generate

CMD ["node", "worker.js"]
```

Deploy to:
- AWS ECS
- Google Cloud Run
- DigitalOcean App Platform
- Fly.io

---

## Part 3: Production Database (Supabase)

### Already Setup?

If you used Supabase for development, you're done! 

Just make sure you're using the **production** connection string in Vercel/Railway.

### Need Separate Production DB?

1. Create new Supabase project (call it "production")
2. Get new `DATABASE_URL`
3. Update environment variables in Vercel + Railway
4. Run migrations:

```bash
DATABASE_URL="your-production-url" npx prisma migrate deploy
```

---

## Part 4: Production Redis (Upstash)

### Already Setup?

If you used Upstash for development, you're done!

### Need Separate Production Redis?

1. Create new Upstash database (call it "production")
2. Get new `REDIS_URL`
3. Update environment variables in Vercel + Railway

---

## Part 5: Update Clerk (Auth)

### Update Allowed Domains

1. Go to Clerk dashboard
2. Navigate to "Domains"
3. Add your production domain: `your-app.vercel.app`

### Update Redirect URLs

1. Go to "Paths"
2. Update:
   - **Sign-in URL:** `/sign-in`
   - **Sign-up URL:** `/sign-up`
   - **After sign-in:** `/dashboard`
   - **After sign-up:** `/onboarding`

---

## Part 6: Testing Production

### Test Checklist

- [ ] Visit production URL
- [ ] Sign up with new account
- [ ] Complete onboarding
- [ ] Upload test CSV (2-3 leads)
- [ ] Verify worker processes campaign
- [ ] Check generated emails
- [ ] Test CSV export
- [ ] Verify all research APIs work

### Monitor Logs

**Vercel (App):**
- Dashboard → Your Project → Deployments → View Function Logs

**Railway/Render (Worker):**
- Dashboard → Your Service → Logs

**Check for:**
- Worker processing campaigns
- API errors (OpenAI, Proxycurl)
- Database connection issues

---

## Part 7: Domain Setup (Optional)

### Buy Domain

Use Namecheap, GoDaddy, or Google Domains

### Point to Vercel

1. Vercel Dashboard → Your Project → Settings → Domains
2. Add your domain: `yourdomain.com`
3. Follow Vercel's DNS instructions
4. Add DNS records:
   - **A Record:** `76.76.21.21`
   - **CNAME:** `cname.vercel-dns.com`

Wait 10-60 minutes for DNS to propagate.

### Update Environment Variables

Change `NEXT_PUBLIC_URL` to your domain in:
- Vercel environment variables
- Clerk allowed domains

---

## Part 8: Monitoring & Scaling

### Monitor Costs

**Monthly Cost Estimate (1,000 leads/month):**

| Service | Cost |
|---------|------|
| Vercel (Hobby) | Free (or $20 Pro) |
| Railway Worker | $5-20 |
| Supabase | Free (or $25 Pro) |
| Upstash Redis | Free (or $10 Pro) |
| OpenAI | $10-20 |
| Proxycurl | $10 |
| **Total** | **$25-75/month** |

### Set Up Alerts

**Vercel:**
- Dashboard → Integrations → Add monitoring (Sentry, LogRocket)

**Upstash:**
- Dashboard → Set usage alerts

**OpenAI:**
- Platform → Usage Limits → Set monthly budget

### Scale Up

**More Concurrent Processing:**

In `lib/queue/worker.ts`, increase:
```typescript
const limit = pLimit(20); // Was 10
```

**More Workers:**

Deploy multiple worker instances on Railway/Render.

**Database Optimization:**

Upgrade Supabase plan for:
- More connections
- Better performance
- Point-in-time recovery

---

## Part 9: Security Checklist

- [ ] All API keys in environment variables (never in code)
- [ ] Clerk production keys (not test keys)
- [ ] HTTPS enabled (automatic on Vercel)
- [ ] Database connection uses SSL
- [ ] Redis uses TLS (rediss://)
- [ ] No .env files in Git
- [ ] Enable Vercel password protection (optional)

---

## Part 10: Backup & Recovery

### Database Backups

**Supabase:**
- Auto backups (paid plans)
- Manual: `pg_dump` via CLI

**Prisma:**
```bash
# Export data
npx prisma db pull

# Backup to SQL
pg_dump $DATABASE_URL > backup.sql
```

### Redis Backups

Upstash has automatic backups on paid plans.

For free tier: Data is ephemeral (job queue only, not critical).

---

## 🚀 You're Live!

Your production deployment checklist:

- ✅ App deployed on Vercel
- ✅ Worker running on Railway/Render
- ✅ Database on Supabase (production)
- ✅ Redis on Upstash (production)
- ✅ Clerk configured for production domain
- ✅ All environment variables set
- ✅ Test campaign processed successfully
- ✅ Monitoring and alerts enabled

---

## 📊 Post-Launch

### Week 1:
- Monitor error logs daily
- Check processing times
- Verify email quality
- Track costs

### Month 1:
- Analyze usage patterns
- Optimize slow queries
- Adjust worker concurrency
- Review API costs

### Ongoing:
- Keep dependencies updated
- Monitor for API changes
- Backup database regularly
- Scale as needed

---

## 🆘 Production Issues?

**Worker not processing:**
```bash
# SSH into Railway/Render
# Check logs
pm2 logs (if using pm2)
```

**High costs:**
- Reduce concurrent processing
- Use GPT-4o-mini instead of GPT-4o
- Cache research data
- Implement rate limiting

**Slow processing:**
- Add more workers
- Increase concurrency limit
- Upgrade database plan
- Use connection pooling

---

**Congratulations! You're running in production! 🎉**

Need help? Check logs first, then review API docs.

