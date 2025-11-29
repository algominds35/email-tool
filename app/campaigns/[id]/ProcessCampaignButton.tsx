'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';

export function ProcessCampaignButton({ campaignId }: { campaignId: string }) {
  const [processing, setProcessing] = useState(false);
  const router = useRouter();

  const handleProcess = async () => {
    setProcessing(true);
    try {
      const response = await fetch(`/api/campaigns/${campaignId}/process`, {
        method: 'POST',
      });

      if (response.ok) {
        // Refresh the page to show new emails
        router.refresh();
      } else {
        alert('Failed to process campaign');
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Failed to process campaign');
    } finally {
      setProcessing(false);
    }
  };

  return (
    <Button 
      onClick={handleProcess} 
      disabled={processing}
      size="lg"
    >
      {processing ? 'Processing...' : 'Process Campaign Now'}
    </Button>
  );
}

