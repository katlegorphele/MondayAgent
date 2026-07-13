# Job Search

Find relevant job postings across job boards for law, forensic auditing, compliance, and finance roles.

## Trigger
When the user asks to search for jobs or find job listings.

## Steps

1. Parse the query: extract job title, location, industry, and any filters (remote, salary range)
2. Use browser or web search to scan job boards:
   - LinkedIn Jobs
   - Indeed
   - Glassdoor
   - CareerJunction (South Africa)
   - PNet (South Africa)
3. For each job found, extract: title, company, location, description (3-4 sentence summary), URL, and salary if listed
4. Filter to only law, compliance, forensic auditing, and finance roles
5. Return results as a structured list

## Output Format
Return a list of jobs. For each:
- Title
- Company
- Location
- Short description
- Direct link to apply
- Salary (if available)

## Pitfalls
- Job board layout changes break scraping — prefer search + extract over brittle selectors
- Some job boards block automated access — use browser simulation
- Don't include obviously stale listings (>30 days old)
