import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { prisma } from '@/lib/prisma';
import { parseCSV } from '@/lib/csv';
import { addCampaignToQueue } from '@/lib/queue/queue';

// Create new campaign
export async function POST(req: NextRequest) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const formData = await req.formData();
    const name = formData.get('name') as string;
    const csvFile = formData.get('csv') as File;

    if (!name || !csvFile) {
      return NextResponse.json(
        { error: 'Campaign name and CSV file are required' },
        { status: 400 }
      );
    }

    // Parse CSV
    const csvText = await csvFile.text();
    const leads = await parseCSV(csvText);

    if (leads.length === 0) {
      return NextResponse.json(
        { error: 'No valid leads found in CSV' },
        { status: 400 }
      );
    }

    // Check if user has enough credits
    const user = await prisma.user.findUnique({
      where: { clerkUserId: userId },
    });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    if (user.emailsRemaining < leads.length && user.subscriptionStatus === 'free') {
      return NextResponse.json(
        { 
          error: `Not enough credits. You have ${user.emailsRemaining} emails remaining, but need ${leads.length}.`,
          creditsNeeded: leads.length,
          creditsAvailable: user.emailsRemaining,
        },
        { status: 402 }
      );
    }

    // Create campaign
    const campaign = await prisma.campaign.create({
      data: {
        name,
        userId: user.id,
        totalLeads: leads.length,
        source: 'csv_upload',
        leads: {
          create: leads.map(lead => ({
            email: lead.email,
            firstName: lead.first_name,
            lastName: lead.last_name || null,
            company: lead.company || null,
            title: lead.title || null,
            linkedinUrl: lead.linkedin_url || null,
            companyWebsite: lead.company_website || null,
          })),
        },
      },
      include: {
        leads: true,
      },
    });

    // Add to processing queue
    await addCampaignToQueue(campaign.id, userId);

    return NextResponse.json({
      success: true,
      campaign,
      message: `Campaign created with ${leads.length} leads. Processing started.`,
    });
  } catch (error) {
    console.error('Error creating campaign:', error);
    return NextResponse.json(
      { error: 'Failed to create campaign' },
      { status: 500 }
    );
  }
}

// Get all campaigns for user
export async function GET(req: NextRequest) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { clerkUserId: userId },
    });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

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

    return NextResponse.json({ campaigns });
  } catch (error) {
    console.error('Error fetching campaigns:', error);
    return NextResponse.json(
      { error: 'Failed to fetch campaigns' },
      { status: 500 }
    );
  }
}

