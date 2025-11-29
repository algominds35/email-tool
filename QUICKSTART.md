# ⚡ 5-Minute Quick Start

Want to see it work ASAP? Follow this guide.

## What You'll Need (5 min setup)

1. **Supabase** (Free PostgreSQL)
2. **Upstash** (Free Redis)  
3. **Clerk** (Free Auth)
4. **OpenAI** (Paid - $5 minimum)
5. **Proxycurl** (Paid - $50 minimum for testing)

---

## 🚀 Rapid Setup

### 1. Clone & Install (1 min)

```bash
git clone <repo-url>
cd email-personalization-tool
npm install
```

### 2. Get API Keys (3 min)

**Supabase:**
- https://supabase.com → New Project → Copy DATABASE_URL

**Upstash:**
- https://upstash.com → Create Redis → Copy REDIS_URL

**Clerk:**
- https://clerk.com → New Application → Copy both keys

**OpenAI:**
- https://platform.openai.com → API Keys → Create key

**Proxycurl:**
- https://nubela.co/proxycurl → Add $50 credit → Copy API key

### 3. Create .env.local (1 min)

```bash
DATABASE_URL="your-supabase-url"
REDIS_URL="your-upstash-url"
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY="pk_test_..."
CLERK_SECRET_KEY="sk_test_..."
OPENAI_API_KEY="sk-..."
PROXYCURL_API_KEY="your-proxycurl-key"
NEXT_PUBLIC_URL="http://localhost:3000"
```

### 4. Setup Database (30 sec)

```bash
npx prisma generate
npx prisma migrate dev
```

### 5. Start Everything (30 sec)

**Terminal 1:** Start worker
```bash
node worker.js
```

**Terminal 2:** Start app
```bash
npm run dev
```

Open http://localhost:3000

---

## ✅ Test It (2 min)

### 1. Sign Up
- Click "Get Started"
- Create account
- Fill onboarding form

### 2. Upload Test CSV

Create `test.csv`:
```csv
email,first_name,last_name,company,linkedin_url
test@example.com,John,Smith,Acme,https://linkedin.com/in/johnsmith
```

- Dashboard → New Campaign
- Upload test.csv
- Click "Create Campaign"

### 3. Watch It Work!
- Progress bar appears
- Check worker terminal for logs
- Wait ~1-2 minutes
- Click on generated email
- See personalized content!

### 4. Export
- Click "Download CSV"
- Open file - see subject + body!

---

## 🎉 You're Done!

You now have a working AI email personalization tool!

### Next Steps:
1. Try with real leads (5-10 to start)
2. Review generated emails for quality
3. Adjust prompts if needed (`lib/ai/email-generator.ts`)
4. Deploy to production when ready

---

## 💡 Quick Tips

**Lower Costs:**
- Change GPT-4o to GPT-4o-mini in `lib/ai/email-generator.ts`
- Only include leads with LinkedIn URLs

**Better Quality:**
- Adjust prompt in `lib/ai/email-generator.ts`
- Increase quality score threshold

**Faster Processing:**
- Increase concurrent limit in `lib/queue/worker.ts` (line 37)
- Be careful of API rate limits!

---

## 🐛 Something Broke?

**Worker not starting:**
```bash
npm install -g ts-node
node worker.js
```

**Database errors:**
```bash
npx prisma migrate reset
npx prisma migrate dev
```

**Dependencies missing:**
```bash
rm -rf node_modules package-lock.json
npm install
```

---

**That's it! Start generating personalized emails! 🚀**

Full docs: See `README.md` and `SETUP.md`

