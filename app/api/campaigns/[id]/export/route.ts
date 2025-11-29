import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { prisma } from '@/lib/prisma';
import { generateCSV } from '@/lib/csv';

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
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

    // Get campaign with all emails
    const campaign = await prisma.campaign.findUnique({
      where: { id: params.id },
      include: {
        leads: {
          include: {
            emails: {
              orderBy: { createdAt: 'desc' },
              take: 1, // Get most recent email for each lead
            },
          },
        },
      },
    });

    if (!campaign) {
      return NextResponse.json({ error: 'Campaign not found' }, { status: 404 });
    }

    if (campaign.userId !== user.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    // Get all emails (flatten the structure)
    const emails = campaign.leads
      .filter(lead => lead.emails.length > 0)
      .map(lead => ({
        ...lead.emails[0],
        lead,
      }));

    if (emails.length === 0) {
      return NextResponse.json(
        { error: 'No emails to export' },
        { status: 400 }
      );
    }

    // Generate CSV
    const csv = generateCSV(emails);

    // Return CSV file
    return new NextResponse(csv, {
      headers: {
        'Content-Type': 'text/csv',
        'Content-Disposition': `attachment; filename="${campaign.name.replace(/[^a-z0-9]/gi, '_')}_emails.csv"`,
      },
    });
  } catch (error) {
    console.error('Error exporting campaign:', error);
    return NextResponse.json(
      { error: 'Failed to export campaign' },
      { status: 500 }
    );
  }
}

