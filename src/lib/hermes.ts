const HERMES_URL = process.env.HERMES_API_URL || 'http://localhost:3001';

export async function callHermes(prompt: string): Promise<string> {
  const res = await fetch(`${HERMES_URL}/api/chat`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ prompt }),
  });
  const data = await res.json();
  return data.response || data.message || JSON.stringify(data);
}

export async function searchJobs(query: string, location?: string, remote?: boolean) {
  const filters = [
    query,
    location ? `in ${location}` : '',
    remote ? 'remote only' : '',
  ].filter(Boolean).join(' ');

  const prompt = `Search for the following jobs across job boards (LinkedIn, Indeed, Glassdoor, and local South African boards). Return a JSON array with these fields for each job: id, title, company, location, description (3-4 sentences), url, source, salary (if available). Return ONLY valid JSON, no other text.

Search: ${filters}
Industry focus: law, forensic auditing, compliance, finance
Max results: 10`;

  const response = await callHermes(prompt);
  try {
    // Extract JSON from response
    const jsonMatch = response.match(/\[[\s\S]*\]/);
    if (jsonMatch) return JSON.parse(jsonMatch[0]);
    return [];
  } catch {
    return [];
  }
}

export async function generateCV(jobDescription: string, baseCV: string) {
  const prompt = `You are an expert CV writer. Given the base CV and the job description below, rewrite the CV to be maximally relevant to this specific role. Highlight matching experience, use keywords from the job description, adjust the professional summary to target this role. Keep it professional and factual — never invent experience. Return the tailored CV in clean markdown format.

BASE CV:
${baseCV}

JOB DESCRIPTION:
${jobDescription}

TAILORED CV:`;

  return callHermes(prompt);
}

export async function generateCoverLetter(jobTitle: string, company: string, jobDescription: string, baseCV: string) {
  const prompt = `You are a professional cover letter writer. Write a compelling cover letter for the role below. Reference specific experience from the CV that matches the job requirements. Address it to "Hiring Manager" at ${company}. Keep it to 3-4 paragraphs. Return in clean markdown format.

JOB TITLE: ${jobTitle}
COMPANY: ${company}

JOB DESCRIPTION:
${jobDescription}

CANDIDATE CV:
${baseCV}

COVER LETTER:`;

  return callHermes(prompt);
}
