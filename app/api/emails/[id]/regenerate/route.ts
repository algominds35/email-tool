import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { prisma } from '@/lib/prisma';
import { generateEmail } from '@/lib/ai/email-generator';
import { scoreEmail } from '@/lib/ai/quality-scorer';

export async function POST(
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

    // Get email with lead and research data
    const email = await prisma.email.findUnique({
      where: { id: params.id },
      include: {
        lead: {
          include: {
            campaign: true,
          },
        },
      },
    });

    if (!email) {
      return NextResponse.json({ error: 'Email not found' }, { status: 404 });
    }

    if (email.lead.campaign.userId !== user.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    // Regenerate email
    const research = email.lead.researchData as any;
    const newEmailData = await generateEmail(email.lead, research, user);
    const newScore = scoreEmail(newEmailData.body, research);

    // Update email
    const updatedEmail = await prisma.email.update({
      where: { id: params.id },
      data: {
        subject: newEmailData.subject,
        body: newEmailData.body,
        confidenceScore: newScore,
        researchSummary: newEmailData.summary,
        status: 'generated',
      },
    });

    return NextResponse.json({ email: updatedEmail });
  } catch (error) {
    console.error('Error regenerating email:', error);
    return NextResponse.json(
      { error: 'Failed to regenerate email' },
      { status: 500 }
    );
  }
}

