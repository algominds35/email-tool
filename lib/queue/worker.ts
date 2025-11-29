import { Worker, Job } from 'bullmq';
import { prisma } from '@/lib/prisma';
import redis from '@/lib/redis';
import pLimit from 'p-limit';
import { getLinkedInData } from '@/lib/research/linkedin';
import { getWebsiteData, extractDomain } from '@/lib/research/website';
import { getCompanyNews } from '@/lib/research/news';
import { generateEmail } from '@/lib/ai/email-generator';
import { scoreEmail } from '@/lib/ai/quality-scorer';

interface ProcessCampaignJob {
  campaignId: string;
  userId: string;
}

export const campaignWorker = new Worker<ProcessCampaignJob>(
  'campaign-processing',
  async (job: Job<ProcessCampaignJob>) => {
    const { campaignId, userId } = job.data;

    console.log(`Starting campaign processing: ${campaignId}`);

    // Update campaign status to processing
    await prisma.campaign.update({
      where: { id: campaignId },
      data: { status: 'processing' },
    });

    // Get all leads for this campaign
    const leads = await prisma.lead.findMany({
      where: { campaignId },
    });

    console.log(`Processing ${leads.length} leads`);

    // Process 10 leads concurrently to avoid rate limits
    const limit = pLimit(10);
    let completed = 0;

    await Promise.all(
      leads.map(lead =>
        limit(async () => {
          try {
            console.log(`Processing lead: ${lead.email}`);

            // STEP 1: Research lead
            const [linkedInData, websiteData, newsData] = await Promise.all([
              getLinkedInData(lead.linkedinUrl),
              getWebsiteData(lead.companyWebsite || extractDomain(lead.email)),
              getCompanyNews(lead.company),
            ]);

            const research = {
              linkedIn: linkedInData,
              website: websiteData,
              news: newsData,
            };

            // Save research
            await prisma.lead.update({
              where: { id: lead.id },
              data: { researchData: research },
            });

            // STEP 2: Get user context
            const user = await prisma.user.findUnique({
              where: { clerkUserId: userId },
            });

            if (!user) {
              throw new Error('User not found');
            }

            // STEP 3: Generate email with OpenAI
            const emailData = await generateEmail(lead, research, user);

            // STEP 4: Score quality
            const score = scoreEmail(emailData.body, research);

            // STEP 5: Save email
            await prisma.email.create({
              data: {
                leadId: lead.id,
                subject: emailData.subject,
                body: emailData.body,
                confidenceScore: score,
                researchSummary: emailData.summary,
              },
            });

            // Update progress
            completed++;
            const progress = (completed / leads.length) * 100;
            await job.updateProgress(progress);

            console.log(`Completed lead ${completed}/${leads.length}: ${lead.email}`);

            // Update campaign progress
            await prisma.campaign.update({
              where: { id: campaignId },
              data: { processedLeads: completed },
            });

            // Decrement user's email credits
            await prisma.user.update({
              where: { id: user.id },
              data: {
                emailsRemaining: {
                  decrement: 1,
                },
              },
            });
          } catch (error) {
            console.error(`Error processing lead ${lead.id}:`, error);
            // Continue processing other leads even if one fails
          }
        })
      )
    );

    // Mark campaign complete
    await prisma.campaign.update({
      where: { id: campaignId },
      data: {
        status: 'complete',
        processedAt: new Date(),
      },
    });

    console.log(`Campaign ${campaignId} completed: ${completed} leads processed`);

    return { success: true, processed: completed };
  },
  {
    connection: redis,
    concurrency: 5, // Process up to 5 campaigns simultaneously
  }
);

// Error handling
campaignWorker.on('failed', (job, err) => {
  console.error(`Job ${job?.id} failed:`, err);
});

campaignWorker.on('completed', (job) => {
  console.log(`Job ${job.id} completed successfully`);
});

export default campaignWorker;

