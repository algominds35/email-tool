import { Queue } from 'bullmq';
import redis from '@/lib/redis';

// Only create queue if Redis is configured
export const campaignQueue = process.env.UPSTASH_REDIS_REST_URL 
  ? new Queue('campaign-processing', {
      connection: redis,
      defaultJobOptions: {
        attempts: 3,
        backoff: {
          type: 'exponential',
          delay: 5000,
        },
        removeOnComplete: {
          count: 100,
        },
        removeOnFail: {
          count: 50,
        },
      },
    })
  : null;

export async function addCampaignToQueue(campaignId: string, userId: string) {
  // Skip queue if Redis not configured
  if (!campaignQueue) {
    console.log('Redis not configured, campaign will need to be processed manually or synchronously');
    return null;
  }

  const job = await campaignQueue.add(
    'process-campaign',
    {
      campaignId,
      userId,
    },
    {
      jobId: campaignId,
    }
  );

  return job;
}

