import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

interface Lead {
  firstName: string;
  lastName?: string | null;
  company?: string | null;
  title?: string | null;
  email: string;
}

interface User {
  companyName?: string | null;
  productDescription?: string | null;
  valueProp?: string | null;
  targetAudience?: string | null;
}

interface Research {
  linkedIn?: any;
  website?: any;
  news?: any;
}

export async function generateEmail(lead: Lead, research: Research, user: User) {
  const prompt = `You are an expert cold email copywriter. Write a highly personalized cold email.

LEAD INFORMATION:
- Name: ${lead.firstName} ${lead.lastName || ''}
- Title: ${lead.title || 'Unknown'}
- Company: ${lead.company || 'Unknown'}

RESEARCH DATA:
${formatResearch(research)}

SENDER'S BUSINESS CONTEXT:
- Company: ${user.companyName || 'Our company'}
- Product: ${user.productDescription || 'Our product'}
- Value Proposition: ${user.valueProp || 'Help businesses grow'}
- Target Audience: ${user.targetAudience || 'Business professionals'}

INSTRUCTIONS:
1. Write a 50-75 word personalized email body (NOT including subject line)
2. Reference specific recent activity from research (LinkedIn posts, company news, hiring)
3. Show you understand their specific situation or challenges
4. Include ONE clear, simple call-to-action (usually asking for a quick call)
5. Sound conversational and human, NOT robotic or salesy
6. DO NOT use overused phrases like:
   - "I hope this finds you well"
   - "I wanted to reach out"
   - "I came across your profile"
   - "I'd love to pick your brain"
7. Start with something specific about THEM (not you)
8. Keep it brief and scannable

Return ONLY valid JSON in this exact format:
{
  "subject": "subject line here (max 8 words, specific and intriguing)",
  "body": "email body here (50-75 words)",
  "summary": "brief 1-2 sentence summary of which research insights you used"
}`;

  try {
    const completion = await openai.chat.completions.create({
      model: 'gpt-4o',
      messages: [
        {
          role: 'system',
          content: 'You are an expert cold email copywriter who writes highly personalized, conversational emails that get replies. You always return valid JSON.',
        },
        {
          role: 'user',
          content: prompt,
        },
      ],
      temperature: 0.7,
      max_tokens: 500,
      response_format: { type: "json_object" },
    });

    const responseText = completion.choices[0].message.content || '{}';
    const emailData = JSON.parse(responseText);

    return {
      subject: emailData.subject || 'Quick question',
      body: emailData.body || '',
      summary: emailData.summary || 'Generated from available research',
    };
  } catch (error) {
    console.error('Error generating email with OpenAI:', error);
    
    // Fallback email if AI fails
    return {
      subject: `Quick question about ${lead.company}`,
      body: `Hi ${lead.firstName},\n\nI noticed you're working on ${lead.company}'s ${lead.title || 'team'}. We help companies like yours ${user.valueProp || 'achieve their goals'}.\n\nWorth a quick 15-minute call to explore if this could help ${lead.company}?\n\nBest,`,
      summary: 'Fallback template used due to AI generation error',
    };
  }
}

function formatResearch(research: Research): string {
  let formatted = '';

  if (research.linkedIn) {
    formatted += 'LINKEDIN PROFILE:\n';
    formatted += `- Headline: ${research.linkedIn.profile?.headline || 'N/A'}\n`;
    formatted += `- Current Role: ${research.linkedIn.profile?.currentRole || 'N/A'}\n`;
    formatted += `- Location: ${research.linkedIn.profile?.location || 'N/A'}\n`;
    
    if (research.linkedIn.posts && research.linkedIn.posts.length > 0) {
      formatted += '\nRECENT LINKEDIN POSTS:\n';
      research.linkedIn.posts.forEach((post: any, i: number) => {
        formatted += `Post ${i + 1}: ${post.text?.substring(0, 200) || 'No text'}...\n`;
      });
    }
    formatted += '\n';
  }

  if (research.website) {
    formatted += 'COMPANY WEBSITE:\n';
    formatted += `${research.website.content?.substring(0, 500) || 'No content available'}...\n\n`;
  }

  if (research.news && research.news.articles) {
    formatted += 'RECENT COMPANY NEWS:\n';
    research.news.articles.forEach((article: any, i: number) => {
      formatted += `${i + 1}. ${article.title}: ${article.description?.substring(0, 100) || ''}...\n`;
    });
    formatted += '\n';
  }

  if (!formatted) {
    formatted = 'No research data available. Write a professional cold email based on available lead information.\n';
  }

  return formatted;
}

