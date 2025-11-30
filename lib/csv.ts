import Papa from 'papaparse';

export interface CSVLead {
  email: string;
  first_name: string;
  last_name?: string;
  company?: string;
  title?: string;
  linkedin_url?: string;
  company_website?: string;
  research_notes?: string;  // NEW: User-provided research/trigger events
}

export function parseCSV(csvText: string): Promise<CSVLead[]> {
  return new Promise((resolve, reject) => {
    Papa.parse(csvText, {
      header: true,
      skipEmptyLines: true,
      transformHeader: (header) => header.toLowerCase().replace(/\s+/g, '_'),
      complete: (results) => {
        const leads: CSVLead[] = results.data.map((row: any) => ({
          email: row.email || '',
          first_name: row.first_name || row.firstname || row.name || '',
          last_name: row.last_name || row.lastname || '',
          company: row.company || row.company_name || '',
          title: row.title || row.job_title || '',
          linkedin_url: row.linkedin_url || row.linkedin || '',
          company_website: row.company_website || row.website || '',
          research_notes: row.research_notes || row.notes || row.research || row.trigger || '',
        }));

        // Filter out invalid leads (must have email and first name)
        const validLeads = leads.filter(lead => lead.email && lead.first_name);
        resolve(validLeads);
      },
      error: (error: Error) => reject(error),
    });
  });
}

export function generateCSV(emails: any[]): string {
  const data = emails.map(email => ({
    email: email.lead.email,
    first_name: email.lead.firstName,
    last_name: email.lead.lastName || '',
    company: email.lead.company || '',
    title: email.lead.title || '',
    subject: email.subject,
    body: email.body,
    linkedin_url: email.lead.linkedinUrl || '',
    confidence_score: email.confidenceScore,
    research_notes: email.researchSummary || '',
  }));

  return Papa.unparse(data);
}

