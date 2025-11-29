# AI Email Personalization Tool

> Generate deeply personalized cold emails with AI research. Built with Next.js 14, OpenAI GPT-4o, and modern stack.

## 🎯 What This Does

Upload a CSV of leads → AI researches each lead → Generates personalized emails → Review & export

- **Researches**: LinkedIn profiles, company websites, recent news
- **Generates**: 50-75 word personalized emails with AI
- **Scores**: Quality score (0-100) for each email
- **Exports**: CSV ready for email tools (Instantly, Smartlead, etc.)

## 🚀 Features

- ✅ CSV upload with lead data
- ✅ Background job processing (BullMQ + Redis)
- ✅ Multi-source research (Proxycurl, Jina AI, Brave Search)
- ✅ OpenAI GPT-4o email generation
- ✅ Quality scoring algorithm
- ✅ Email review & editing interface
- ✅ CSV export with personalized emails
- ✅ User authentication (Clerk)
- ✅ PostgreSQL database (Prisma ORM)
- ⏳ Stripe payments (coming soon)

## 📊 Tech Stack

**Frontend:**
- Next.js 14 (App Router)
- TypeScript
- Tailwind CSS + shadcn/ui
- Zustand (state)
- React Hook Form

**Backend:**
- Next.js API Routes
- Prisma ORM
- PostgreSQL (Supabase)
- BullMQ + Redis (Upstash)

**APIs:**
- OpenAI GPT-4o (email generation)
- Proxycurl (LinkedIn data)
- Jina AI (website scraping - FREE)
- Brave Search (company news - FREE)

## 🛠️ Setup Instructions

### 1. Prerequisites

- Node.js 20+
- PostgreSQL database (Supabase recommended)
- Redis instance (Upstash recommended)

### 2. Clone & Install

```bash
git clone <your-repo>
cd email-personalization-tool
npm install
```

### 3. Environment Variables

Copy `.env.example` to `.env.local` and fill in your keys:

```bash
cp .env.example .env.local
```

**Required API Keys:**
- **Supabase**: Create free account at https://supabase.com
- **Upstash Redis**: Create free account at https://upstash.com
- **Clerk**: Create free account at https://clerk.com
- **OpenAI**: Get API key at https://platform.openai.com
- **Proxycurl**: Get API key at https://nubela.co/proxycurl (~$0.01/profile)

**Optional (Free Alternatives):**
- Jina AI: Automatically used for website scraping (no key needed)
- Brave Search: Free tier at https://brave.com/search/api/

### 4. Database Setup

```bash
# Generate Prisma client
npx prisma generate

# Run migrations
npx prisma migrate dev

# (Optional) Open Prisma Studio to view data
npx prisma studio
```

### 5. Start Background Worker

In a separate terminal, start the BullMQ worker:

```bash
# Create a worker.js file in the root
node -e "require('./lib/queue/worker.ts')"

# Or using ts-node
npx ts-node lib/queue/worker.ts
```

**Note:** For production, run this as a separate process/service.

### 6. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

## 📝 Usage

### 1. Sign Up & Onboarding
- Create account
- Fill in your company info (for AI context)

### 2. Create Campaign
- Upload CSV with leads
- Required columns: `email`, `first_name`
- Optional: `last_name`, `company`, `linkedin_url`, `title`

### 3. Processing
- AI researches each lead (1-2 min/lead)
- Generates personalized emails
- Assigns quality score

### 4. Review Emails
- View all generated emails
- Edit, regenerate, or approve
- Filter by quality score

### 5. Export
- Download CSV with personalized emails
- Upload to your email tool

## 📊 CSV Format

**Input (upload):**
```csv
email,first_name,last_name,company,linkedin_url
john@acme.com,John,Smith,Acme Corp,linkedin.com/in/johnsmith
```

**Output (export):**
```csv
email,first_name,subject,body,linkedin_url,confidence_score
john@acme.com,John,"Loved your post about AI","Hey John...",linkedin.com/in/johnsmith,87
```

## 💰 Cost Breakdown (Per Lead)

- Proxycurl (LinkedIn): ~$0.01
- Jina AI (website): FREE
- Brave Search (news): FREE
- OpenAI GPT-4o: ~$0.01-0.02
- **Total: ~$0.02-0.03 per lead**

If you charge $0.50/lead → **94% margin** 🔥

## 🚀 Deployment

### Deploy to Vercel

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel
```

### Environment Variables in Vercel

Add all variables from `.env.local` to your Vercel project settings.

### Background Worker

Deploy the worker separately:
- **Option 1**: Vercel Cron Jobs (for scheduled processing)
- **Option 2**: Railway/Render (run `lib/queue/worker.ts` as separate service)
- **Option 3**: Docker container

## 🧪 Testing

Create a test CSV with 2-3 leads to verify:
1. CSV upload works
2. Research APIs are working
3. Emails are generated
4. Export works

## 🐛 Troubleshooting

**Worker not processing:**
- Check Redis connection
- Verify worker is running in separate terminal
- Check logs: `console.log` statements in worker

**No research data:**
- Verify API keys in `.env.local`
- Check API limits (Proxycurl, Brave)
- Check LinkedIn URLs are valid

**OpenAI errors:**
- Check API key is valid
- Verify you have credits
- Try GPT-4o-mini for cheaper alternative

**Database errors:**
- Run `npx prisma migrate dev`
- Check DATABASE_URL is correct
- Verify Supabase connection

## 📚 Project Structure

```
├── app/
│   ├── api/           # API routes
│   ├── campaigns/     # Campaign pages
│   ├── dashboard/     # Dashboard
│   ├── onboarding/    # User setup
│   └── sign-in/       # Auth pages
├── components/
│   └── ui/            # shadcn/ui components
├── lib/
│   ├── ai/            # Email generation & scoring
│   ├── queue/         # BullMQ worker
│   └── research/      # API integrations
├── prisma/
│   └── schema.prisma  # Database schema
└── public/
```

## 🎯 Roadmap

- [x] Core email generation
- [x] CSV upload/export
- [x] Background processing
- [x] Email review interface
- [ ] Stripe payments
- [ ] Email analytics
- [ ] Bulk regeneration
- [ ] Team features
- [ ] API access

## 📄 License

MIT

## 🤝 Contributing

Contributions welcome! Please open an issue first.

---

Built with ❤️ using Next.js 14, OpenAI, and modern stack

