import axios from 'axios';

export async function getWebsiteData(url: string | null) {
  if (!url) {
    return null;
  }

  // Ensure URL has protocol
  if (!url.startsWith('http://') && !url.startsWith('https://')) {
    url = 'https://' + url;
  }

  try {
    // Option 1: Firecrawl (paid, if API key is provided)
    if (process.env.FIRECRAWL_API_KEY) {
      const response = await axios.post(
        'https://api.firecrawl.dev/v0/scrape',
        {
          url: url,
          formats: ['markdown'],
        },
        {
          headers: {
            'Authorization': `Bearer ${process.env.FIRECRAWL_API_KEY}`,
          },
          timeout: 30000,
        }
      );
      
      return {
        content: response.data.data?.markdown || response.data.data?.text || '',
        source: 'firecrawl',
      };
    }

    // Option 2: Jina AI Reader (free)
    const jinaUrl = `https://r.jina.ai/${encodeURIComponent(url)}`;
    const response = await axios.get(jinaUrl, {
      headers: {
        'Accept': 'text/plain',
        'X-Return-Format': 'text',
      },
      timeout: 30000,
    });

    // Limit content to first 3000 characters to save tokens
    const content = response.data.substring(0, 3000);

    return {
      content: content,
      source: 'jina',
    };
  } catch (error) {
    console.error('Error fetching website data:', error);
    return null;
  }
}

export function extractDomain(email: string): string {
  const match = email.match(/@(.+)$/);
  return match ? match[1] : '';
}

