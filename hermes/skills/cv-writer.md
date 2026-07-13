# CV Writer

Tailor the user's base CV to a specific job description. Maximise keyword matching without fabricating experience.

## Trigger
When a job description and base CV are provided, rewrite the CV for that specific role.

## Steps

1. Read the base CV from the database or provided file
2. Read the job description fully
3. Identify key requirements and keywords in the job description
4. Reorder and rephrase CV sections to highlight matching experience
5. Adjust the professional summary to target this specific role and company
6. Insert relevant keywords naturally where the candidate has genuine experience
7. Remove or minimise sections irrelevant to this role
8. Output the tailored CV in clean, professional markdown format

## Rules
- NEVER invent experience, skills, qualifications, or job titles
- NEVER change dates, company names, or factual details
- Only rephrase and reorder existing content
- Keep it professional — no exaggeration, no buzzword stuffing
- If the candidate lacks a required qualification, do not add it

## Output Format
Clean markdown CV with sections: Professional Summary, Experience, Education, Skills, Certifications (if applicable).
