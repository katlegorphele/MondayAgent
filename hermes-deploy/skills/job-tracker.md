# Job Tracker

Track job applications through the full lifecycle: draft → ready → applied → interview → offer.

## Trigger
When the user wants to view, update, or manage their application pipeline.

## Steps

1. Query the applications database
2. Group by status: draft, ready, applied, interview, offer, rejected, archived
3. Present a clear pipeline view showing count per stage
4. Allow moving applications between stages
5. For "applied" status, record the application date
6. For "interview" status, prompt for the interview date and add it as a note

## Status Definitions
| Status | Meaning |
|--------|---------|
| draft | CV/cover letter not yet generated |
| ready | Documents generated, ready for user review |
| applied | Application submitted |
| interview | Interview scheduled or completed |
| offer | Job offer received |
| rejected | Application unsuccessful |
| archived | No longer active, hidden from main view |

## Pitfalls
- Never auto-move an application to "applied" — the user must explicitly confirm
- Don't delete applications — use "archived" status instead
