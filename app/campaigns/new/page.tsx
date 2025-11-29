'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export default function NewCampaignPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [campaignName, setCampaignName] = useState('');
  const [csvFile, setCsvFile] = useState<File | null>(null);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!csvFile) {
      setError('Please select a CSV file');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const formData = new FormData();
      formData.append('name', campaignName);
      formData.append('csv', csvFile);

      const response = await fetch('/api/campaigns', {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();

      if (response.ok) {
        router.push(`/campaigns/${data.campaign.id}`);
      } else {
        setError(data.error || 'Failed to create campaign');
      }
    } catch (error) {
      console.error('Error creating campaign:', error);
      setError('Failed to create campaign');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center gap-8">
            <Link href="/dashboard" className="text-2xl font-bold text-blue-600">
              EmailAI
            </Link>
            <nav className="flex gap-6">
              <Link href="/dashboard" className="text-sm font-medium text-gray-600 hover:text-gray-900">
                Campaigns
              </Link>
            </nav>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          <div className="mb-6">
            <Link href="/dashboard">
              <Button variant="ghost" size="sm">← Back to Dashboard</Button>
            </Link>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Create New Campaign</CardTitle>
              <CardDescription>
                Upload a CSV file with your leads to start generating personalized emails
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <Label htmlFor="campaignName">Campaign Name</Label>
                  <Input
                    id="campaignName"
                    placeholder="Q1 2025 Outbound"
                    value={campaignName}
                    onChange={(e) => setCampaignName(e.target.value)}
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="csvFile">CSV File</Label>
                  <Input
                    id="csvFile"
                    type="file"
                    accept=".csv"
                    onChange={(e) => setCsvFile(e.target.files?.[0] || null)}
                    required
                  />
                  <p className="text-sm text-gray-600 mt-2">
                    Your CSV should include: <code className="bg-gray-100 px-1 rounded">email</code>,{' '}
                    <code className="bg-gray-100 px-1 rounded">first_name</code>,{' '}
                    <code className="bg-gray-100 px-1 rounded">linkedin_url</code> (optional)
                  </p>
                </div>

                {error && (
                  <div className="bg-red-50 border border-red-200 rounded-md p-4">
                    <p className="text-sm text-red-800">{error}</p>
                  </div>
                )}

                <div className="bg-blue-50 border border-blue-200 rounded-md p-4">
                  <h4 className="font-semibold text-blue-900 mb-2">📋 CSV Format Example:</h4>
                  <pre className="text-xs bg-white p-2 rounded overflow-x-auto">
{`email,first_name,last_name,company,linkedin_url
john@acme.com,John,Smith,Acme Corp,linkedin.com/in/johnsmith
sarah@techco.com,Sarah,Johnson,TechCo,linkedin.com/in/sarahj`}
                  </pre>
                </div>

                <Button type="submit" className="w-full" size="lg" disabled={loading}>
                  {loading ? 'Creating Campaign...' : 'Create Campaign & Start Processing'}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}

