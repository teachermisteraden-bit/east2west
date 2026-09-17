# Everything still waiting on a real value

Nothing here is invented in the code. Each item either hides its own feature
until it is set, or states plainly that it is not final.

## Needed before launch

| What | Where | What happens without it |
|---|---|---|
| Contact email | `CONTACT_EMAIL` | The email link is hidden on Contact, the footer and in structured data |
| WhatsApp number | `CONTACT_PHONE` | The click-to-chat link is hidden |
| WhatsApp community link | `WHATSAPP_COMMUNITY_URL` | Every "join the community" micro-step is hidden, including on the confirmation card |
| Domain | `SITE_URL` | Metadata, sitemap and personal invite links fall back to localhost |
| Social links | `SOCIAL_LINKEDIN`, `SOCIAL_INSTAGRAM`, `SOCIAL_X`, `SOCIAL_SNAPCHAT` | Each icon hides on its own |
| Membership cost wording | `MEMBERSHIP_COST_EN` / `_AR` | The FAQ says fees will be announced, which is true |
| Response time | `RESPONSE_TIME_EN` / `_AR` | Defaults to three working days — change it if that is not the promise |
| Supabase project | `NEXT_PUBLIC_SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY` | Forms tell the visitor honestly that the application could not be saved |
| Resend | `RESEND_API_KEY`, `NOTIFY_EMAIL` | Applications still save; no acknowledgement is sent |
| Admin password and secret | `ADMIN_PASSWORD`, `ADMIN_SESSION_SECRET` | The admin cannot be opened at all |
| Rate limit salt | `RATE_LIMIT_SALT` | A new salt each boot, so counters reset on deploy |

## Content still missing

| What | Where | Current state |
|---|---|---|
| Founder note | `about.founderNote.placeholder` | Says "Founder note coming soon" on the About page |
| Events | `src/content/events.ts` | Empty. The page shows its waiting message |
| Partners, speakers, testimonials | `src/components/proof/ProofSlot.tsx` | Empty, and therefore invisible — no "coming soon" where a claim would be |
| Sponsorship prospectus, university one-pager | `src/content/downloads.ts` | Empty. The page says so rather than linking to a missing file |
| The five campaign posters | `public/og/` | Never supplied. Open Graph cards are generated from the tokens and approved copy instead |
| Privacy wording | `privacy.body` | Marked a draft **on the page itself**; needs an adviser before launch |
| The logo | `src/components/brand/Wordmark.tsx` | A temporary text wordmark. The press page says so |

## Copy awaiting review

`docs/draft-strings.md` lists every string added beyond the approved copy, with
its English and Arabic. The Arabic was written carefully and **not**
machine-translated, but it still needs a native speaker before launch —
particularly `join.options.coDirectorNotYet` and the five `join.typeNoun`
phrases, which have to read naturally inside a sentence.
