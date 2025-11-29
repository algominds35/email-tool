import axios from 'axios';

interface LinkedInProfile {
  full_name?: string;
  headline?: string;
  summary?: string;
  experiences?: any[];
  education?: any[];
  city?: string;
  country?: string;
}

interface LinkedInPost {
  text?: string;
  posted_on?: string;
  urn?: string;
}

export async function getLinkedInData(linkedinUrl: string | null) {
  if (!linkedinUrl || !process.env.PROXYCURL_API_KEY) {
    return null;
  }

  try {
    // Get profile data
    const profileResponse = await axios.get('https://nubela.co/proxycurl/api/v2/linkedin', {
      params: { url: linkedinUrl },
      headers: { 'Authorization': `Bearer ${process.env.PROXYCURL_API_KEY}` },
      timeout: 30000,
    });

    // Get recent posts
    let posts: LinkedInPost[] = [];
    try {
      const postsResponse = await axios.get('https://nubela.co/proxycurl/api/linkedin/profile/posts', {
        params: { url: linkedinUrl },
        headers: { 'Authorization': `Bearer ${process.env.PROXYCURL_API_KEY}` },
        timeout: 30000,
      });
      posts = postsResponse.data.posts?.slice(0, 3) || [];
    } catch (postError) {
      console.error('Error fetching LinkedIn posts:', postError);
      // Continue without posts if they fail
    }

    const profile: LinkedInProfile = profileResponse.data;

    return {
      profile: {
        name: profile.full_name,
        headline: profile.headline,
        summary: profile.summary,
        location: `${profile.city || ''} ${profile.country || ''}`.trim(),
        currentRole: profile.experiences?.[0]?.title || '',
        currentCompany: profile.experiences?.[0]?.company || '',
      },
      posts: posts.map(post => ({
        text: post.text,
        date: post.posted_on,
      })),
    };
  } catch (error) {
    console.error('Error fetching LinkedIn data:', error);
    return null;
  }
}

