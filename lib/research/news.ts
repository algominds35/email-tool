import axios from 'axios';

export async function getCompanyNews(companyName: string | null) {
  if (!companyName) {
    return null;
  }

  try {
    // Option 1: Brave Search API (free tier - 2,000 requests/month)
    if (process.env.BRAVE_SEARCH_API_KEY) {
      const response = await axios.get('https://api.search.brave.com/res/v1/web/search', {
        params: {
          q: `${companyName} funding OR news OR announcement`,
          count: 5,
        },
        headers: {
          'Accept': 'application/json',
          'X-Subscription-Token': process.env.BRAVE_SEARCH_API_KEY,
        },
        timeout: 15000,
      });

      const results = response.data.web?.results || [];
      return {
        articles: results.map((result: any) => ({
          title: result.title,
          description: result.description,
          url: result.url,
          date: result.age,
        })),
        source: 'brave',
      };
    }

    // Option 2: SerpAPI (paid, if API key is provided)
    if (process.env.SERPAPI_KEY) {
      const response = await axios.get('https://serpapi.com/search', {
        params: {
          engine: 'google',
          q: `${companyName} funding news`,
          api_key: process.env.SERPAPI_KEY,
          num: 5,
        },
        timeout: 15000,
      });

      const results = response.data.organic_results || [];
      return {
        articles: results.map((result: any) => ({
          title: result.title,
          description: result.snippet,
          url: result.link,
        })),
        source: 'serpapi',
      };
    }

    // No API keys configured
    return null;
  } catch (error) {
    console.error('Error fetching company news:', error);
    return null;
  }
}

