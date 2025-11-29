# 🚀 Quick Setup Guide

## Prerequisites

1. **Node.js 20+** - [Download](https://nodejs.org/)
2. **Git** - [Download](https://git-scm.com/)
3. **Code Editor** - VS Code recommended

## API Accounts Needed

### Free (Required)
- ✅ **Supabase** (PostgreSQL) - https://supabase.com
- ✅ **Upstash** (Redis) - https://upstash.com  
- ✅ **Clerk** (Auth) - https://clerk.com
- ✅ **OpenAI** (GPT-4o) - https://platform.openai.com

### Paid (Required)
- 💵 **Proxycurl** (LinkedIn data) - https://nubela.co/proxycurl
  - ~$0.01 per profile
  - $50-100 to start

### Free (Optional)
- ✅ **Jina AI** (website scraping) - Automatic, no key needed
- ✅ **Brave Search** (company news) - https://brave.com/search/api/
  - Free: 2,000 requests/month

---

## Step-by-Step Setup

### 1️⃣ Clone Repository

```bash
git clone <your-repo-url>
cd email-personalization-tool
```

### 2️⃣ Install Dependencies

```bash
npm install
```

### 3️⃣ Setup Supabase (Database)

1. Go to https://supabase.com
2. Create new project
3. Wait ~2 minutes for database to provision
4. Go to **Settings → Database**
5. Copy **Connection String** (URI format)
6. Replace `[YOUR-PASSWORD]` with your actual password

### 4️⃣ Setup Upstash (Redis)

1. Go to https://upstash.com
2. Create new Redis database
3. Copy the **UPSTASH_REDIS_REST_URL**
4. Note: Use the TLS/SSL URL (starts with `rediss://`)

### 5️⃣ Setup Clerk (Authentication)

1. Go to https://clerk.com
2. Create new application
3. Choose authentication methods (Email, Google, etc.)
4. Go to **API Keys**
5. Copy:
   - **Publishable Key** (starts with `pk_`)
   - **Secret Key** (starts with `sk_`)

### 6️⃣ Setup OpenAI

1. Go to https://platform.openai.com
2. Create account (requires phone verification)
3. Add payment method
4. Go to **API Keys**
5. Create new secret key
6. Copy key (starts with `sk-`)

**Note:** GPT-4o costs ~$0.01-0.02 per email

### 7️⃣ Setup Proxycurl (LinkedIn)

1. Go to https://nubela.co/proxycurl
2. Create account
3. Add $50-100 credit
4. Go to **Dashboard → API Key**
5. Copy your API key

**Cost:** ~$0.01 per LinkedIn profile

### 8️⃣ Setup Brave Search (Optional)

1. Go to https://brave.com/search/api/
2. Sign up for free tier
3. Get API key
4. Free tier: 2,000 requests/month

### 9️⃣ Create Environment File

Create `.env.local` in the root directory:

```bash
# Database
DATABASE_URL="postgresql://postgres:[YOUR-PASSWORD]@[HOST]:[PORT]/postgres"

# Redis
REDIS_URL="rediss://default:[PASSWORD]@[HOST]:[PORT]"

# Clerk Authentication
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY="pk_test_..."
CLERK_SECRET_KEY="sk_test_..."

# OpenAI
OPENAI_API_KEY="sk-..."

# Proxycurl (Required)
PROXYCURL_API_KEY="..."

# Brave Search (Optional - free)
BRAVE_SEARCH_API_KEY="..."

# App URL
NEXT_PUBLIC_URL="http://localhost:3000"
```

### 🔟 Setup Database

```bash
# Generate Prisma client
npx prisma generate

# Create database tables
npx prisma migrate dev --name init

# (Optional) View database
npx prisma studio
```

### 1️⃣1️⃣ Start Background Worker

**Option A: Separate Terminal**

Open a new terminal and run:

```bash
npx ts-node lib/queue/worker.ts
```

Keep this terminal open while development server is running.

**Option B: Worker Script**

Create `worker.js` in root:

```javascript
require('ts-node/register');
require('./lib/queue/worker.ts');
```

Then run:

```bash
node worker.js
```

### 1️⃣2️⃣ Start Development Server

```bash
npm run dev
```

Open http://localhost:3000

---

## ✅ Verify Setup

### Test 1: Homepage
- Visit http://localhost:3000
- Should see landing page with "Get Started" button

### Test 2: Sign Up
- Click "Get Started"
- Create account with email
- Should redirect to onboarding

### Test 3: Onboarding
- Fill in company information
- Should redirect to dashboard

### Test 4: CSV Upload

Create test CSV (`test-leads.csv`):

```csv
email,first_name,last_name,company,linkedin_url
john@example.com,John,Smith,Acme Corp,https://linkedin.com/in/johnsmith
```

- Go to "New Campaign"
- Upload test CSV
- Name campaign "Test"
- Click "Create Campaign"

### Test 5: Processing

- Should see progress bar
- Check worker terminal for logs
- Wait 1-2 minutes per lead

### Test 6: Review Email

- Click on generated email
- Verify subject and body look good
- Try editing, approving, regenerating

### Test 7: Export

- Go back to campaign
- Click "Download CSV"
- Verify CSV has personalized emails

---

## 🐛 Common Issues

### ❌ "Worker not processing campaigns"

**Fix:**
```bash
# Check Redis connection
curl $REDIS_URL

# Restart worker
npx ts-node lib/queue/worker.ts
```

### ❌ "Prisma Client initialization error"

**Fix:**
```bash
npx prisma generate
npx prisma migrate dev
```

### ❌ "Cannot find module '@/lib/...'"

**Fix:**
```bash
# Reinstall dependencies
rm -rf node_modules
npm install
```

### ❌ "OpenAI API error"

**Fix:**
- Check API key is correct
- Verify you have credits
- Try GPT-4o-mini: Change model in `lib/ai/email-generator.ts`

### ❌ "Proxycurl rate limit"

**Fix:**
- Check your credit balance
- Reduce concurrent requests in `lib/queue/worker.ts` (line 37)
- Change from 10 to 5: `const limit = pLimit(5);`

### ❌ "Clerk authentication not working"

**Fix:**
- Verify both keys are in `.env.local`
- Check keys match environment (test vs production)
- Restart dev server after adding keys

---

## 📊 Monitor Costs

### Per Lead Cost Breakdown:
- Proxycurl (LinkedIn): $0.01
- Jina AI (website): FREE
- Brave Search (news): FREE  
- OpenAI GPT-4o: $0.01-0.02
- **Total: ~$0.02-0.03 per lead**

### Monthly Estimates:

| Leads/Month | Cost |
|------------|------|
| 100 | $2-3 |
| 500 | $10-15 |
| 1,000 | $20-30 |
| 5,000 | $100-150 |

### Ways to Reduce Costs:

1. **Use GPT-4o-mini** instead of GPT-4o
   - Change in `lib/ai/email-generator.ts`
   - Cost: ~$0.001/email (100x cheaper)
   - Quality: Slightly lower

2. **Skip LinkedIn research** for some leads
   - Only research leads with LinkedIn URLs
   - Falls back to website/news only

3. **Cache research data**
   - Store in database
   - Reuse for similar companies

---

## 🚀 Deploy to Production

### Deploy App (Vercel)

```bash
npm i -g vercel
vercel
```

Add all environment variables in Vercel dashboard.

### Deploy Worker (Railway/Render)

**Option 1: Railway**
1. Create new project
2. Add `worker.js` as entrypoint
3. Add environment variables

**Option 2: Render**
1. Create new background worker
2. Build command: `npm install`
3. Start command: `node worker.js`

---

## 🎯 Next Steps

1. ✅ Test with 2-3 leads
2. ✅ Verify email quality
3. ✅ Check all research sources work
4. ✅ Test CSV export
5. 🚀 Deploy to production
6. 📈 Start with real leads!

---

## 💬 Need Help?

- Check `README.md` for full documentation
- Review API documentation:
  - OpenAI: https://platform.openai.com/docs
  - Proxycurl: https://nubela.co/proxycurl/docs
  - Clerk: https://clerk.com/docs

---

**Ready to generate your first personalized emails! 🎉**

