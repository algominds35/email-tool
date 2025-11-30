# 🚀 Deployment Steps - Angle-First Email System

## What We Just Built:

✅ **User-provided research system** - Users paste LinkedIn URLs/text in CSV  
✅ **Jina AI URL scraping** - Auto-scrapes URLs (FREE!)  
✅ **Angle-finding AI** - Extracts trigger events, pain points, timing  
✅ **Angle-first emails** - Writes emails around the best angle  
✅ **No API dependencies** - Works without Proxycurl or expensive scrapers

---

## 🔥 Critical Steps After Deployment:

### STEP 1: Update Database Schema (REQUIRED!)

Run this command locally OR in Vercel:
```bash
npx prisma db push --accept-data-loss
```

This adds the new `userResearch` field to the Lead model.

**⚠️ Important:** You MUST do this or the app will crash!

---

### STEP 2: Add Brave Search API Key (Optional but Recommended)

1. Go to: https://brave.com/search/api/
2. Sign up (FREE - 2,000 searches/month)
3. Get your API key
4. Add to Vercel:
   - Go to Vercel dashboard
   - Your project → Settings → Environment Variables
   - Add: `BRAVE_SEARCH_API_KEY=your_key_here`
   - Redeploy

**Why:** Brave finds company news as bonus research angles (funding, launches, etc.)

---

## 📋 New CSV Format:

Users now upload CSVs like this:

```csv
email,first_name,last_name,company,research_notes
mike@sales.com,Mike,Jones,Salesforce,"https://linkedin.com/posts/mikejones-scaling-team"
sarah@tech.com,Sarah,Chen,TechStartup,"Just posted about hiring 5 engineers and onboarding chaos"
emma@shop.com,Emma,Williams,Shopify,"Company raised $50M Series B last week"
```

**The `research_notes` column accepts:**
- ✅ LinkedIn post URLs (auto-scraped with Jina AI)
- ✅ News article URLs (auto-scraped)
- ✅ Plain text notes (used directly)
- ✅ Any public webpage URL

---

## 🎯 How It Works:

1. **User uploads CSV** with URLs or text in `research_notes`
2. **Jina AI scrapes URLs** automatically (FREE!)
3. **Angle-finder AI** reads content and extracts:
   - Trigger events (promotions, funding, hiring)
   - Pain points (what they're struggling with)
   - Timing signals (why reach out NOW)
   - Best angle to use
4. **Email writer AI** creates angle-first email
5. **User sees angle + evidence + email** in dashboard

---

## 💰 Cost Per Lead:

- Jina AI (URL scraping): **FREE**
- OpenAI (angle finding): **~$0.01**
- OpenAI (email writing): **~$0.03**
- Brave Search (optional): **FREE**

**Total: ~$0.04 per lead**

---

## 🧪 Testing After Deploy:

1. Create new campaign
2. Upload test CSV with `research_notes` column
3. Use sample from `test-5-leads.csv`
4. Process campaign
5. Check that angles are displayed with evidence
6. Verify emails are angle-first (not generic)

---

## 📝 Files Changed:

- `lib/csv.ts` - Parse `research_notes` column
- `lib/research/url-scraper.ts` - NEW: Jina AI scraping
- `lib/ai/angle-finder.ts` - Prioritize user research
- `lib/queue/worker.ts` - Process user research + scrape URLs
- `prisma/schema.prisma` - Add `userResearch` field to Lead model
- `app/api/campaigns/route.ts` - Save user research
- `app/campaigns/new/page.tsx` - Update UI hints
- `app/campaigns/[id]/page.tsx` - Display angles
- `app/campaigns/[id]/emails/[emailId]/page.tsx` - Show angle details
- `sample-leads.csv` - Updated with `research_notes`
- `test-5-leads.csv` - Updated with `research_notes`

---

## 🎉 What This Solves:

❌ **Problem:** Proxycurl shut down, LinkedIn scraping APIs are unreliable  
✅ **Solution:** Users provide research, we extract angles automatically

❌ **Problem:** Expensive API costs ($0.01-0.10 per lead)  
✅ **Solution:** Jina AI is free, total cost is $0.04/lead

❌ **Problem:** Generic personalized emails  
✅ **Solution:** Angle-first emails with real trigger events

❌ **Problem:** Scraper dependencies that break  
✅ **Solution:** User-controlled research + free URL scraping

---

## 🚨 REMEMBER:

**After deployment, run:**
```bash
npx prisma db push --accept-data-loss
```

**Then optionally add Brave Search API key to Vercel!**

---

## 🎯 Next Steps (Optional):

1. Add Brave Search API key (FREE)
2. Test with real leads
3. Gather user feedback
4. Iterate on angle-finding prompts based on results

**You're now live with angle-first email generation! 🚀**

