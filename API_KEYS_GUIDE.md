# 🔑 API Keys Guide - Priority & Setup

## 🚨 CRITICAL: Required for App to Work

These API keys are **MANDATORY** for the app to function:

### 1. DATABASE_URL (Supabase)
**Priority:** ⚠️ CRITICAL  
**Cost:** Free tier available  
**Setup:**
1. Go to https://supabase.com
2. Create new project
3. Settings → Database → Connection String (URI)
4. Copy the connection string

**Add to Vercel:**
```
DATABASE_URL=postgresql://postgres:[PASSWORD]@[HOST]:[PORT]/postgres
```

---

### 2. REDIS_URL (Upstash)
**Priority:** ⚠️ CRITICAL  
**Cost:** Free tier available  
**Setup:**
1. Go to https://upstash.com
2. Create Redis database
3. Copy the TLS URL (starts with `rediss://`)

**Add to Vercel:**
```
REDIS_URL=rediss://default:[PASSWORD]@[HOST]:[PORT]
```

---

### 3. Clerk Auth Keys
**Priority:** ⚠️ CRITICAL  
**Cost:** Free for up to 10,000 users  
**Setup:**
1. Go to https://clerk.com
2. Create application
3. Go to API Keys

**Add to Vercel:**
```
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_...
CLERK_SECRET_KEY=sk_test_...
```

⚠️ **IMPORTANT:** Also add your production domain in Clerk dashboard under "Domains"

---

### 4. OPENAI_API_KEY
**Priority:** ⚠️ CRITICAL  
**Cost:** ~$0.03-0.05 per email (GPT-4o)  
**Setup:**
1. Go to https://platform.openai.com
2. Create account
3. Add payment method
4. API Keys → Create new secret key

**Add to Vercel:**
```
OPENAI_API_KEY=sk-...
```

💡 **Cost optimization:** The app uses GPT-4o for quality. You can change to GPT-4o-mini in `lib/ai/email-generator.ts` and `lib/ai/angle-finder.ts` to reduce costs by 90%.

---

## 🎯 ANGLE-FINDING: Highly Recommended

These APIs make your **angle-finding** powerful. Without them, angles will be generic.

### 5. PROXYCURL_API_KEY (LinkedIn Data)
**Priority:** 🔥 HIGH (makes angles 10x better)  
**Cost:** $0.01 per profile lookup  
**What it does:** 
- Scrapes LinkedIn profiles
- Gets recent posts (trigger events!)
- Finds job titles, company info
- **THIS IS THE SECRET SAUCE FOR GOOD ANGLES**

**Setup:**
1. Go to https://nubela.co/proxycurl
2. Sign up and get API key
3. Add payment method ($29 minimum)

**Add to Vercel:**
```
PROXYCURL_API_KEY=...
```

**Example angles WITH Proxycurl:**
- "Saw you're hiring 5 engineers—onboarding becomes chaos at that scale..."
- "Your post about scaling challenges resonated..."
- "Congrats on the promotion to VP! When teams grow this fast..."

**Example angles WITHOUT Proxycurl:**
- "I noticed you work at TechStartup..." (generic)

---

### 6. BRAVE_SEARCH_API_KEY (Company News)
**Priority:** 🔥 MEDIUM-HIGH (finds trigger events)  
**Cost:** FREE for 2,000 requests/month  
**What it does:**
- Finds recent company news
- Detects funding rounds
- Product launches
- Hiring announcements

**Setup:**
1. Go to https://brave.com/search/api/
2. Sign up (it's free!)
3. Get API key

**Add to Vercel:**
```
BRAVE_SEARCH_API_KEY=...
```

**Example angles WITH Brave:**
- "Congrats on the Series A—when you're growing that fast, X usually breaks first..."
- "Saw you launched the new AI product. We help teams like yours..."

---

## 📦 Optional: Website Scraping

### 7. FIRECRAWL_API_KEY (Website Scraping - Paid)
**Priority:** 🟡 OPTIONAL  
**Cost:** Paid ($29/mo for 500 scrapes)  
**What it does:** High-quality website scraping

**Setup:**
1. Go to https://firecrawl.dev
2. Sign up and get API key

**Add to Vercel:**
```
FIRECRAWL_API_KEY=...
```

**Alternative:** If not provided, the app automatically uses **Jina AI** (free) for website scraping. It's good enough for most use cases.

---

## 💳 Optional: Payments (Stripe)

### 8. Stripe Keys
**Priority:** 🟢 NOT NEEDED FOR MVP  
**Cost:** Free (Stripe takes 2.9% + $0.30 per transaction)  
**What it does:** Lets you charge users

**Setup:**
1. Go to https://stripe.com
2. Dashboard → Developers → API Keys

**Add to Vercel:**
```
STRIPE_SECRET_KEY=sk_test_...
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...
```

---

## 🎯 Recommended Setup Strategy

### Phase 1: Get It Working (NOW)
✅ Already done (your app is live!)
- DATABASE_URL
- REDIS_URL
- Clerk keys
- OPENAI_API_KEY

### Phase 2: Add Angle-Finding (DO THIS NEXT!)
🔥 **These make your product 10x better:**
1. **PROXYCURL_API_KEY** ($29 minimum, ~$0.01/lead)
2. **BRAVE_SEARCH_API_KEY** (FREE!)

**Why:** Right now your angles are probably generic because there's no real research data. These APIs will give you:
- Recent LinkedIn posts (gold for angles!)
- Company news (funding, launches)
- Job changes (promotions, new roles)

### Phase 3: Scale (Later)
- Add Stripe for payments
- Consider Firecrawl for better website data

---

## 📊 Cost Breakdown (Per Lead)

| Service | Cost per Lead | Why You Need It |
|---------|--------------|-----------------|
| OpenAI (GPT-4o) | $0.03-0.05 | Generate email + find angle |
| Proxycurl | $0.01 | LinkedIn data (BEST for angles) |
| Brave Search | Free | Company news (FREE!) |
| Website scraping | Free | Jina AI (auto-fallback) |
| **TOTAL** | **~$0.04-0.06/lead** | Full angle-first email |

**If you process 100 leads:**
- Total cost: $4-6
- Time saved: 30+ hours (vs manual research)
- ROI: If you close 1 deal, this pays for itself 100x

---

## 🚀 How to Add These to Vercel RIGHT NOW

1. Go to your Vercel dashboard
2. Click your project
3. Settings → Environment Variables
4. Add each key one by one
5. Click "Save"
6. **Important:** Redeploy your app (Deployments → Redeploy)

---

## ❓ Which Keys Should I Add First?

**If you want GOOD angles (you should!):**

1. **PROXYCURL_API_KEY** ← Add this FIRST
   - Go to https://nubela.co/proxycurl
   - Sign up, add $29 credit
   - Get your API key
   - Add to Vercel
   - Redeploy

2. **BRAVE_SEARCH_API_KEY** ← Add this SECOND
   - Go to https://brave.com/search/api/
   - Sign up (free!)
   - Get API key
   - Add to Vercel
   - Redeploy

**Total cost to add both:** $29 (covers ~2,900 leads)

**Result:** Your angles go from generic → highly specific with real trigger events

---

## 🧪 Testing After Adding Keys

1. Add API keys to Vercel
2. Redeploy your app
3. Create new test campaign
4. Upload 1-2 test leads with LinkedIn URLs
5. Process campaign
6. Check the angle quality:
   - Look for specific mentions of LinkedIn posts
   - Check for recent company news
   - Verify confidence scores are 60-90+ (vs 20-40 before)

---

## 💡 Pro Tips

1. **Start with Proxycurl + Brave** - these give you the best angle-finding for lowest cost
2. **Skip Firecrawl for now** - Jina AI (free) works fine
3. **Skip Stripe for MVP** - add it later when you have paying customers
4. **Monitor costs** - Set usage alerts in OpenAI dashboard
5. **Batch processing** - Process leads in batches to manage API costs

---

## 🆘 Troubleshooting

**"My angles are still generic"**
- Check if PROXYCURL_API_KEY is set in Vercel
- Make sure you redeployed after adding keys
- Verify your test leads have LinkedIn URLs

**"High OpenAI costs"**
- Switch from GPT-4o to GPT-4o-mini (edit `model:` in both AI files)
- Reduces cost from $0.05 → $0.005 per email

**"Proxycurl errors"**
- Check your Proxycurl balance
- Verify API key is correct
- Make sure LinkedIn URLs are valid

---

## 📝 Summary

**✅ Already configured:**
- Database, Redis, Clerk, OpenAI

**🔥 Add NEXT for 10x better angles:**
- PROXYCURL_API_KEY ($29 for ~2,900 leads)
- BRAVE_SEARCH_API_KEY (FREE!)

**⏰ Total time to add:** 10 minutes  
**💰 Total cost:** $29 upfront  
**📈 Impact:** Generic angles → Specific trigger-based angles

