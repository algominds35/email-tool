import { auth } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';
import { prisma } from '@/lib/prisma';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { formatDistanceToNow } from 'date-fns';

export default async function DashboardPage() {
  const { userId } = await auth();

  if (!userId) {
    redirect('/sign-in');
  }

  // Get or create user
  let user = await prisma.user.findUnique({
    where: { clerkUserId: userId },
  });

  // If user doesn't exist, check if they need onboarding
  if (!user) {
    redirect('/onboarding');
  }

  // Get user's campaigns
  const campaigns = await prisma.campaign.findMany({
    where: { userId: user.id },
    orderBy: { createdAt: 'desc' },
    include: {
      _count: {
        select: {
          leads: true,
        },
      },
    },
  });

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-8">
              <Link href="/dashboard" className="text-2xl font-bold text-blue-600">
                EmailAI
              </Link>
              <nav className="flex gap-6">
                <Link href="/dashboard" className="text-sm font-medium text-gray-900">
                  Campaigns
                </Link>
                <Link href="/settings" className="text-sm font-medium text-gray-600 hover:text-gray-900">
                  Settings
                </Link>
              </nav>
            </div>
            <div className="flex items-center gap-4">
              <div className="text-sm text-gray-600">
                Credits: <span className="font-semibold text-gray-900">{user.emailsRemaining}</span>
              </div>
              <Link href="/pricing">
                <Button size="sm" variant="outline">Upgrade</Button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        {/* Stats */}
        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="pb-2">
              <CardDescription>Total Campaigns</CardDescription>
              <CardTitle className="text-3xl">{campaigns.length}</CardTitle>
            </CardHeader>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardDescription>Total Leads</CardDescription>
              <CardTitle className="text-3xl">
                {campaigns.reduce((sum, c) => sum + c.totalLeads, 0)}
              </CardTitle>
            </CardHeader>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardDescription>Emails Generated</CardDescription>
              <CardTitle className="text-3xl">
                {campaigns.reduce((sum, c) => sum + c.processedLeads, 0)}
              </CardTitle>
            </CardHeader>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardDescription>Credits Remaining</CardDescription>
              <CardTitle className="text-3xl">{user.emailsRemaining}</CardTitle>
            </CardHeader>
          </Card>
        </div>

        {/* Campaigns List */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold">Your Campaigns</h2>
          <Link href="/campaigns/new">
            <Button>+ New Campaign</Button>
          </Link>
        </div>

        {campaigns.length === 0 ? (
          <Card className="p-12 text-center">
            <div className="max-w-md mx-auto">
              <h3 className="text-xl font-semibold mb-2">No campaigns yet</h3>
              <p className="text-gray-600 mb-6">
                Upload a CSV of leads to get started generating personalized emails.
              </p>
              <Link href="/campaigns/new">
                <Button size="lg">Create Your First Campaign</Button>
              </Link>
            </div>
          </Card>
        ) : (
          <div className="space-y-4">
            {campaigns.map((campaign) => (
              <Link key={campaign.id} href={`/campaigns/${campaign.id}`}>
                <Card className="hover:shadow-md transition-shadow cursor-pointer">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="text-lg font-semibold">{campaign.name}</h3>
                          <Badge
                            variant={
                              campaign.status === 'complete'
                                ? 'default'
                                : campaign.status === 'processing'
                                ? 'secondary'
                                : campaign.status === 'error'
                                ? 'destructive'
                                : 'outline'
                            }
                          >
                            {campaign.status}
                          </Badge>
                        </div>
                        <div className="flex items-center gap-6 text-sm text-gray-600">
                          <span>{campaign.totalLeads} leads</span>
                          <span>{campaign.processedLeads} processed</span>
                          <span>
                            Created {formatDistanceToNow(new Date(campaign.createdAt), { addSuffix: true })}
                          </span>
                        </div>
                      </div>
                      <div className="text-right">
                        {campaign.status === 'processing' && (
                          <div className="text-sm text-blue-600 font-medium">
                            Processing... {Math.round((campaign.processedLeads / campaign.totalLeads) * 100)}%
                          </div>
                        )}
                        {campaign.status === 'complete' && (
                          <Button variant="outline" size="sm">
                            View Emails
                          </Button>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}

