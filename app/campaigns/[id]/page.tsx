import { auth } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';
import { prisma } from '@/lib/prisma';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { notFound } from 'next/navigation';
import { ProcessCampaignButton } from './ProcessCampaignButton';

export default async function CampaignDetailPage({ params }: { params: { id: string } }) {
  const { userId } = await auth();

  if (!userId) {
    redirect('/sign-in');
  }

  const user = await prisma.user.findUnique({
    where: { clerkUserId: userId },
  });

  if (!user) {
    redirect('/onboarding');
  }

  const campaign = await prisma.campaign.findUnique({
    where: { id: params.id },
    include: {
      leads: {
        include: {
          emails: true,
        },
        orderBy: { createdAt: 'desc' },
      },
    },
  });

  if (!campaign || campaign.userId !== user.id) {
    notFound();
  }

  const progress = campaign.totalLeads > 0 
    ? (campaign.processedLeads / campaign.totalLeads) * 100 
    : 0;

  const leadsWithEmails = campaign.leads.filter(lead => lead.emails.length > 0);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center gap-8">
            <Link href="/dashboard" className="text-2xl font-bold text-blue-600">
              EmailAI
            </Link>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <div className="mb-6">
          <Link href="/dashboard">
            <Button variant="ghost" size="sm">← Back to Dashboard</Button>
          </Link>
        </div>

        {/* Campaign Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-3xl font-bold mb-2">{campaign.name}</h1>
              <div className="flex items-center gap-3">
                <Badge
                  variant={
                    campaign.status === 'complete'
                      ? 'default'
                      : campaign.status === 'processing'
                      ? 'secondary'
                      : 'outline'
                  }
                >
                  {campaign.status}
                </Badge>
                <span className="text-sm text-gray-600">
                  {campaign.processedLeads} of {campaign.totalLeads} processed
                </span>
              </div>
            </div>
            {campaign.status === 'complete' && leadsWithEmails.length > 0 && (
              <div className="flex gap-3">
                <Link href={`/api/campaigns/${campaign.id}/export`}>
                  <Button>Download CSV</Button>
                </Link>
              </div>
            )}
          </div>

          {campaign.status === 'pending' && (
            <Card>
              <CardContent className="p-6 text-center">
                <p className="text-gray-600 mb-4">
                  Campaign created. Click below to start processing leads and generating emails.
                </p>
                <ProcessCampaignButton campaignId={campaign.id} />
              </CardContent>
            </Card>
          )}

          {campaign.status === 'processing' && (
            <Card>
              <CardContent className="p-6">
                <div className="mb-2 flex items-center justify-between text-sm">
                  <span className="font-medium">Processing leads...</span>
                  <span className="text-gray-600">{Math.round(progress)}%</span>
                </div>
                <Progress value={progress} className="h-2" />
                <p className="text-xs text-gray-600 mt-2">
                  This usually takes 1-2 minutes per lead. You can leave this page and come back later.
                </p>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Emails List */}
        <div className="mb-6">
          <h2 className="text-2xl font-bold mb-4">Generated Emails</h2>
          
          {leadsWithEmails.length === 0 ? (
            <Card className="p-12 text-center">
              <p className="text-gray-600">
                {campaign.status === 'processing' 
                  ? 'Emails are being generated. Please wait...' 
                  : 'No emails generated yet.'}
              </p>
            </Card>
          ) : (
            <div className="space-y-4">
              {leadsWithEmails.map((lead) => {
                const email = lead.emails[0]; // Get first email
                if (!email) return null;

                return (
                  <Link key={lead.id} href={`/campaigns/${campaign.id}/emails/${email.id}`}>
                    <Card className="hover:shadow-md transition-shadow cursor-pointer">
                      <CardContent className="p-6">
                        <div className="flex items-start justify-between gap-4">
                          <div className="flex-1">
                            <div className="flex items-center gap-3 mb-2">
                              <h3 className="font-semibold">
                                {lead.firstName} {lead.lastName}
                              </h3>
                              {lead.company && (
                                <span className="text-sm text-gray-600">@ {lead.company}</span>
                              )}
                              <Badge
                                variant={
                                  email.confidenceScore >= 80
                                    ? 'default'
                                    : email.confidenceScore >= 60
                                    ? 'secondary'
                                    : 'outline'
                                }
                              >
                                {email.confidenceScore}/100
                              </Badge>
                            </div>
                            <div className="text-sm text-gray-600 mb-2">{lead.email}</div>
                            <div className="mt-3">
                              <div className="text-sm font-medium text-gray-700 mb-1">
                                Subject: {email.subject}
                              </div>
                              <div className="text-sm text-gray-600 line-clamp-2">
                                {email.body.substring(0, 200)}...
                              </div>
                            </div>
                          </div>
                          <div className="flex flex-col items-end gap-2">
                            <Badge variant={email.status === 'approved' ? 'default' : 'outline'}>
                              {email.status}
                            </Badge>
                            <Button variant="outline" size="sm">
                              Review
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </Link>
                );
              })}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

