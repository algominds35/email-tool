import { Queue } from 'bullmq';
import redis from '@/lib/redis';

export const campaignQueue = new Queue('campaign-processing', {
  connection: redis,
  defaultJobOptions: {
    attempts: 3,
    backoff: {
      type: 'exponential',
      delay: 5000,
    },
    removeOnComplete: {
      count: 100, // Keep last 100 completed jobs
    },
    removeOnFail: {
      count: 50, // Keep last 50 failed jobs
    },
  },
});

export async function addCampaignToQueue(campaignId: string, userId: string) {
  const job = await campaignQueue.add(
    'process-campaign',
    {
      campaignId,
      userId,
    },
    {
      jobId: campaignId, // Use campaign ID as job ID to prevent duplicates
    }
  );

  return job;
}

