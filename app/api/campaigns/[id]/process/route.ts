import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { prisma } from '@/lib/prisma';
import { getLinkedInData } from '@/lib/research/linkedin';
import { getWebsiteData } from '@/lib/research/website';
import { getCompanyNews } from '@/lib/research/news';
import { generateEmail } from '@/lib/ai/email-generator';
import { scoreEmail } from '@/lib/ai/quality-scorer';

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const authResult = await auth();
    
    if (!authResult.userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const campaign = await prisma.campaign.findUnique({
      where: { id: params.id },
      include: {
        leads: true,
        user: true,
      },
    });

    if (!campaign) {
      return NextResponse.json({ error: 'Campaign not found' }, { status: 404 });
    }

    if (campaign.user.clerkUserId !== authResult.userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    // Process each lead
    let processed = 0;
    
    for (const lead of campaign.leads) {
      try {
        // Research lead
        const [linkedinData, websiteData, newsData] = await Promise.all([
          getLinkedInData(lead.linkedinUrl),
          getWebsiteData(lead.companyWebsite),
          getCompanyNews(lead.company),
        ]);

        // Generate email
        const emailData = await generateEmail(
          {
            firstName: lead.firstName,
            lastName: lead.lastName || '',
            email: lead.email,
            company: lead.company || '',
            title: lead.title || '',
          },
          {
            linkedIn: linkedinData,
            website: websiteData,
            news: newsData,
          },
          {
            companyName: campaign.user.companyName || '',
            productDescription: campaign.user.productDescription || '',
            valueProp: campaign.user.valueProp || '',
            targetAudience: campaign.user.targetAudience || '',
          }
        );

        // Score email
        const qualityScore = scoreEmail(emailData.subject, emailData.body);

        // Save email
        await prisma.email.create({
          data: {
            leadId: lead.id,
            subject: emailData.subject,
            body: emailData.body,
            status: 'generated',
            confidenceScore: qualityScore,
            researchData: JSON.stringify({
              linkedin: linkedinData,
              website: websiteData,
              news: newsData,
            }),
          },
        });

        processed++;

        // Update campaign progress
        await prisma.campaign.update({
          where: { id: campaign.id },
          data: {
            processedLeads: processed,
            status: processed === campaign.totalLeads ? 'completed' : 'processing',
          },
        });
      } catch (error) {
        console.error(`Error processing lead ${lead.id}:`, error);
        // Continue with next lead
      }
    }

    return NextResponse.json({
      success: true,
      processed,
      total: campaign.totalLeads,
    });
  } catch (error) {
    console.error('Error processing campaign:', error);
    return NextResponse.json(
      { error: 'Failed to process campaign' },
      { status: 500 }
    );
  }
}

