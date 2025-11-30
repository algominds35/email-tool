import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

interface Research {
  linkedIn?: any;
  website?: any;
  news?: any;
}

interface Lead {
  firstName: string;
  lastName?: string | null;
  company?: string | null;
  title?: string | null;
}

interface Angle {
  primaryAngle: string;
  angleType: 'trigger_event' | 'pain_point' | 'recent_activity' | 'timing_signal' | 'generic';
  confidence: number;
  supportingEvidence: string;
  whyNow: string;
  backupAngles: string[];
}

export async function findBestAngle(
  lead: Lead,
  research: Research,
  userProvidedResearch?: string | null  // NEW: User's research takes priority!
): Promise<Angle> {
  const prompt = `You are an expert sales researcher. Your job is to find the BEST ANGLE/REASON to reach out to this person.

LEAD INFORMATION:
- Name: ${lead.firstName} ${lead.lastName || ''}
- Title: ${lead.title || 'Unknown'}
- Company: ${lead.company || 'Unknown'}

${userProvidedResearch ? `
=== USER-PROVIDED RESEARCH (PRIORITY!) ===
This is specific research the user found about this person. USE THIS FIRST!

${userProvidedResearch}

===================================
` : ''}

RESEARCH DATA:
${formatResearchForAngleFinding(research)}

YOUR TASK:
Find the most compelling angle to open an email. Look for:

1. 🔥 TRIGGER EVENTS (BEST):
   - Company just raised funding
   - Hiring spree (especially in relevant roles)
   - Product launch or new initiative
   - Expansion to new market
   - Recent promotion/role change

2. 💡 RECENT ACTIVITY:
   - LinkedIn posts about challenges
   - Shared articles about industry trends
   - Speaking at conferences
   - Celebrating milestones

3. 🎯 PAIN POINTS (from context):
   - Job postings reveal gaps
   - Industry challenges they're facing
   - Company growth stage signals

4. ⏰ TIMING SIGNALS:
   - Why would they care RIGHT NOW?
   - What changed recently?

SCORING:
- Trigger event with specific evidence = 80-100 confidence
- Recent activity with context = 60-80 confidence
- Industry pain point inference = 40-60 confidence
- Generic/no strong angle = 20-40 confidence

Return ONLY valid JSON in this exact format:
{
  "primaryAngle": "One sentence: the best reason to reach out right now",
  "angleType": "trigger_event|recent_activity|pain_point|timing_signal|generic",
  "confidence": 75,
  "supportingEvidence": "Specific quote, data point, or observation from research",
  "whyNow": "One sentence: why this angle is timely/relevant RIGHT NOW",
  "backupAngles": ["Alternative angle 1", "Alternative angle 2"]
}`;

  try {
    const completion = await openai.chat.completions.create({
      model: 'gpt-4o',
      messages: [
        {
          role: 'system',
          content: 'You are an expert sales researcher who finds compelling, specific reasons to reach out to prospects. You always return valid JSON.',
        },
        {
          role: 'user',
          content: prompt,
        },
      ],
      temperature: 0.3, // Lower temperature for more consistent angle-finding
      max_tokens: 400,
      response_format: { type: "json_object" },
    });

    const responseText = completion.choices[0].message.content || '{}';
    const angleData = JSON.parse(responseText);

    return {
      primaryAngle: angleData.primaryAngle || 'Reaching out about potential collaboration',
      angleType: angleData.angleType || 'generic',
      confidence: angleData.confidence || 30,
      supportingEvidence: angleData.supportingEvidence || 'Based on your role and company',
      whyNow: angleData.whyNow || 'Good time to explore new solutions',
      backupAngles: angleData.backupAngles || [],
    };
  } catch (error) {
    console.error('Error finding angle with OpenAI:', error);
    
    // Fallback angle if AI fails
    return {
      primaryAngle: `Interested in ${lead.company}'s growth in ${lead.title || 'their industry'}`,
      angleType: 'generic',
      confidence: 25,
      supportingEvidence: `Working with similar ${lead.title || 'professionals'} at growing companies`,
      whyNow: 'Based on current market trends',
      backupAngles: [
        `${lead.company} appears to be scaling`,
        `Common challenges for ${lead.title || 'professionals'} in this space`
      ],
    };
  }
}

function formatResearchForAngleFinding(research: Research): string {
  let formatted = '';

  if (research.linkedIn?.profile) {
    formatted += '=== LINKEDIN PROFILE ===\n';
    formatted += `Headline: ${research.linkedIn.profile.headline || 'N/A'}\n`;
    formatted += `Current Role: ${research.linkedIn.profile.currentRole || 'N/A'}\n`;
    formatted += `Company: ${research.linkedIn.profile.currentCompany || 'N/A'}\n`;
    formatted += `Location: ${research.linkedIn.profile.location || 'N/A'}\n`;
    formatted += '\n';
  }

  if (research.linkedIn?.posts && research.linkedIn.posts.length > 0) {
    formatted += '=== RECENT LINKEDIN ACTIVITY (IMPORTANT!) ===\n';
    research.linkedIn.posts.forEach((post: any, i: number) => {
      const postText = post.text?.substring(0, 300) || 'No text';
      const postDate = post.date ? `(${post.date})` : '';
      formatted += `Post ${i + 1} ${postDate}:\n${postText}...\n\n`;
    });
  }

  if (research.news?.articles && research.news.articles.length > 0) {
    formatted += '=== RECENT COMPANY NEWS (KEY TRIGGERS!) ===\n';
    research.news.articles.forEach((article: any, i: number) => {
      formatted += `${i + 1}. ${article.title}\n`;
      if (article.description) {
        formatted += `   ${article.description.substring(0, 150)}...\n`;
      }
      formatted += '\n';
    });
  }

  if (research.website?.content) {
    formatted += '=== COMPANY WEBSITE ===\n';
    formatted += `${research.website.content.substring(0, 400)}...\n\n`;
  }

  if (!formatted || formatted.length < 50) {
    formatted = '=== LIMITED RESEARCH DATA ===\n';
    formatted += 'No specific LinkedIn posts, company news, or website data available.\n';
    formatted += 'Fall back to role-based and industry-based angles.\n';
  }

  return formatted;
}

