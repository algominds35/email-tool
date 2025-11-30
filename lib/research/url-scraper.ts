import axios from 'axios';

/**
 * Detects if a string is a URL
 */
export function isURL(text: string): boolean {
  if (!text) return false;
  
  // Check if it starts with http/https or common domains
  const urlPattern = /^(https?:\/\/|www\.)/i;
  return urlPattern.test(text.trim());
}

/**
 * Scrapes content from a URL using Jina AI Reader (FREE!)
 * Works for: LinkedIn posts, news articles, blog posts, any public page
 */
export async function scrapeURL(url: string): Promise<string | null> {
  if (!isURL(url)) {
    return null;
  }

  try {
    // Jina AI Reader - FREE API for URL content extraction
    // Converts any URL to clean markdown text
    const jinaUrl = `https://r.jina.ai/${url.trim()}`;
    
    const response = await axios.get(jinaUrl, {
      timeout: 15000,
      headers: {
        'Accept': 'text/plain',
      },
    });

    const content = response.data;
    
    if (!content || content.length < 50) {
      console.log(`Scraped content too short for URL: ${url}`);
      return null;
    }

    // Limit to first 2000 chars to keep it reasonable
    const truncated = content.substring(0, 2000);
    
    console.log(`✅ Scraped URL: ${url} (${truncated.length} chars)`);
    return truncated;
    
  } catch (error) {
    console.error(`Error scraping URL ${url}:`, error);
    return null;
  }
}

/**
 * Processes user research: if it's a URL, scrapes it; otherwise returns as-is
 */
export async function processUserResearch(userResearch: string | null | undefined): Promise<string | null> {
  if (!userResearch || userResearch.trim().length === 0) {
    return null;
  }

  const trimmed = userResearch.trim();

  // If it's a URL, scrape it
  if (isURL(trimmed)) {
    console.log(`🔍 Detected URL in research, scraping: ${trimmed}`);
    const scrapedContent = await scrapeURL(trimmed);
    
    if (scrapedContent) {
      return scrapedContent;
    } else {
      // If scraping fails, return the URL itself as fallback
      console.log(`⚠️ Scraping failed, using URL as-is: ${trimmed}`);
      return `Content from: ${trimmed}`;
    }
  }

  // If it's plain text, return as-is
  console.log(`📝 Using text research as-is (${trimmed.length} chars)`);
  return trimmed;
}

