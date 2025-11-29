// Quality scoring algorithm for generated emails

export function scoreEmail(emailBody: string, research: any): number {
  let score = 50; // Base score

  // Check length (50-100 words is ideal)
  const wordCount = emailBody.split(/\s+/).length;
  if (wordCount >= 50 && wordCount <= 100) {
    score += 15;
  } else if (wordCount >= 40 && wordCount <= 120) {
    score += 10;
  } else if (wordCount < 30 || wordCount > 150) {
    score -= 10;
  }

  // Check for personalization markers
  const hasSpecificDetails = /\b(noticed|saw|read|following|recent|post|article|announcement)\b/i.test(emailBody);
  if (hasSpecificDetails) {
    score += 15;
  }

  // Penalize for overused phrases
  const badPhrases = [
    'hope this finds you well',
    'wanted to reach out',
    'i came across',
    'pick your brain',
    'circle back',
    'touch base',
  ];
  
  const lowercaseBody = emailBody.toLowerCase();
  badPhrases.forEach(phrase => {
    if (lowercaseBody.includes(phrase)) {
      score -= 10;
    }
  });

  // Check for clear CTA
  const hasCTA = /\b(call|chat|discuss|explore|demo|meeting|calendly|available|interested)\b/i.test(emailBody);
  if (hasCTA) {
    score += 10;
  }

  // Check if research was actually used
  if (research?.linkedIn || research?.website || research?.news) {
    score += 10;
  }

  // Ensure score is between 0 and 100
  return Math.max(0, Math.min(100, score));
}

