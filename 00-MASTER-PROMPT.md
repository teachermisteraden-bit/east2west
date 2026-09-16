# MASTER PROMPT FOR CLAUDE CODE
## East to West Development Society — جمعية الشرق إلى الغرب للتنمية
### A noble, immersive, bilingual website that turns visitors into members, partners and sponsors

> Unzip this kit into the root of an empty project folder, then paste everything below the line into Claude Code.

---

You are the creative technologist and lead engineer for **East to West Development Society** (**جمعية الشرق إلى الغرب للتنمية**). Your job is to build a website that would be credible for an Awwwards Site of the Day, feels as refined as a luxury maison, and converts better than a well-run growth team's landing pages. It must also be completely honest.

The founder is a luxury fashion designer. The site must feel **noble**: calm, crafted, confident and generous. It should feel like being received into a fine house, never like being sold to.

## 0. Read the kit first

This folder contains:

| Path | What it is | Authority |
|---|---|---|
| `00-MASTER-PROMPT.md` | This file | Overall direction; wins on conflicts |
| `01-experience-and-art-direction.md` | The noble aesthetic, the scroll story, motion and craft details | Visual and experiential direction |
| `02-psychology-and-conversion-map.md` | Every persuasion principle, where it is used, and its ethical limit | Conversion design |
| `03-benchmarks.md` | The best sites studied and what to borrow from each | Inspiration only; never copy |
| `04-acceptance-checklist.md` | Definition of done | Quality gate |
| `docs/east-to-west-site-build-brief.md` (+ `.pdf`) | Pages, forms, stack, quality bar, phases | Structure and requirements |
| `messages/en.json`, `messages/ar.json` | All approved copy, ready for next-intl | The only source of site text |
| `starters/` | Tokens, content models, Zod schemas, site config, `.env.example` | Starting code; adapt, don't discard |
| `assets/posters/` | Five campaign posters | Open Graph and campaign reference |
| `assets/reference/` | Strategic blueprint page and the Claude Design prompt | Background: model, lessons, roadmap |
| `brand/` *(added later from Claude Design)* | Final logo, tokens, motion logo, key screens | **Overrides every visual value in this kit once present** |

**Superseded parts of the brief.** The brief was written before this kit. Where they differ, this kit wins:
- Brief section 3 (scroll story) is replaced by `01-experience-and-art-direction.md`.
- Brief section 5 (arch logo, Reem Kufi, old palette, `archGeometry.ts`) is replaced by `starters/src/styles/tokens.css` and, later, by `brand/`.
- The brief's pinned horizontal scroll and optional Lenis are replaced by the native-scroll rules in `01`.
- Brief section 7's four form modes become five (a chapter mode is added).

**Step 0.** Read every file. Then:
1. Reply with a 15-bullet summary of what you will build.
2. List every conflict or gap you found, with your proposed resolution.
3. State whether `brand/` exists. If it does not, build with the provisional tokens in `starters/src/styles/tokens.css`, keep every visual value tokenised so the brand swap is a single change, and use a clearly temporary text wordmark. **Do not recreate the old arch logo** anywhere.
4. Propose the folder structure.

Then **wait for my approval.**

## 1. Who we are (context you must internalise)

- **The society:** a professional community **founded in Madinah and serving all of Saudi Arabia**. It connects **Saudi graduates** and **international Muslim graduates** with each other and with **businesses**, so that networking becomes skills, jobs, contracts and startups. It is a hub where inspiration, motivation and innovation are nurtured and refined.
- **The model is two-sided:**
  - Graduates bring talent and ideas.
  - Businesses bring challenges, jobs, contracts and sponsorship (B2B, graduates-to-business, services-to-business).
  - Universities host campus chapters.
  - Each side makes the other more valuable (the flywheel).
- **Nine programmes:**
  - Business English training
  - Workplace Arabic
  - Financial literacy workshops
  - Weekly networking and keynote events
  - Mentorship
  - Career readiness
  - Startup clinic
  - Talent directory
  - Hiring events
- **Signature format:** the six-week challenge cycle. A business brings a real challenge, mixed teams research it, build and test a solution, then pitch, and the business adopts the best.
- **Member journey:** Join → Learn → Connect → Build → Earn → Lead.
- **Values:**
  - Ta'awun / التعاون (cooperation)
  - Amanah / الأمانة (trust)
  - Itqan / الإتقان (excellence)
  - Naf' / النفع (benefit)
- **Structure:**
  - Graduate Circles and Women's Circles (led by women)
  - Business Circle (one seat per industry)
  - Founders' Forum
  - Campus chapters and city chapters (Madinah first, then Jeddah and Riyadh)
  - Later, alumni chapters abroad (the fullest meaning of East to West)
- **Roadmap:**
  - Year 1: weekly events, training, challenge cycles, quarterly hiring showcases.
  - Year 2: the East to West Summit, a startup track, more Saudi cities.
- **Stage:** founding. Not registered, not licensed, not endorsed by any government or royal body. Membership is by application (members are vetted). Free places for students and job seekers.
- **Contact:** Muhsin Aden, founding coordinator. Every other detail is a placeholder (see `.env.example`).

## 2. Non-negotiables

1. **Truth over hype.** Never invent numbers, members, partners, sponsor logos, testimonials, speakers, prices, press mentions, licences or guarantees. Social proof components ship hidden until real data exists.
2. **Only approved copy** from `messages/*.json`. If a string is missing, add it to both files, mark it `"_draft": true` in a sibling key, and list it for my review. Arabic must never be machine-translated or taken from the PDF.
3. **Bilingual parity.** `/en` and `/ar` are equals. Arabic is fully right-to-left through logical CSS properties. Arabic typography gets its own sizes and line-heights. The logo keeps its designed orientation in both languages.
4. **Respect the visitor's body and attention:**
   - no scroll hijacking and no smooth-scroll libraries
   - native scrolling always
   - `prefers-reduced-motion` fully honoured
   - no autoplay sound
   - no flashing
5. **No dark patterns:**
   - no fake urgency or countdowns
   - no pre-ticked consent boxes
   - no confirm-shaming
   - no hidden costs
   - no tracking before consent
   - no dead-end forms
6. **Cultural and religious respect:**
   - no Qur'anic text or the name of Allah in decorative or disposable contexts
   - no mosque or Prophet's Mosque imagery as decoration
   - no Saudi national emblem, flag or royal symbols
   - modest, dignified representation of people
   - women's circles presented with dignity
7. **Privacy:** collect the minimum. Consent is explicit. The privacy draft is aligned with Saudi Arabia's Personal Data Protection Law and flagged for adviser review.
8. **Build in phases** (section 9), stopping for my review after each.

## 3. The experience

Follow `01-experience-and-art-direction.md` in full. In short:

- **Concept: "The Crossing at First Light."** A journey from East to West that follows the sun's path.
  - The home page opens in the deep blue-black before dawn.
  - Light rises through a mashrabiya-style geometric lattice (a pattern, not a building). As the visitor scrolls, the light moves across the page from east to west.
  - The story passes through the two shores (graduates and businesses), the three pillars, the flywheel, the nine programmes, the six-week challenge, the member journey and the Kingdom map.
  - It arrives at **four doors** (Graduates, Universities, Sponsors, Businesses), each presented like an invitation card.
- **The noble register:**
  - generous negative space
  - a high-contrast serif display face paired with a classical Arabic naskh for headings
  - a quiet sans for body text
  - ivory, deep palm green, obsidian and antique gold
  - hairline rules, small caps and tracked labels
  - slow, weighted easing
  - craftsmanship in the details (hover states, focus rings, cursor, page transitions, the 404 page)
- **Signature interactions:**
  - the light-through-lattice hero, built as progressive enhancement: CSS and SVG first, optional WebGL only on capable devices
  - scroll-driven reveals using CSS scroll-driven animations with a JavaScript fallback
  - a flywheel whose active node follows scroll position
  - a member-journey thread that fills as you read
  - View Transitions between pages
  - a "door opening" transition from the four doors into each audience page
  - an invitation-card confirmation after every form

## 4. The psychology layer

Implement `02-psychology-and-conversion-map.md` exactly. Each audience page follows this story arc:

**Outcome hero** → **Empathy** (their problem) → **The guide and the plan** (3–4 steps) → **What changes for you** → **What it takes** → **Proof slots** (hidden until real) → **Honest FAQ** → **The invitation** (single CTA).

Key mechanics:
- **First impression:** a strong first screen, with one primary action per view.
- **Small first steps:** multi-step forms with a real progress thread, and the first step already visibly started.
- **Belonging:** "founding member" and "membership by application", used truthfully.
- **Reciprocity:** free resources before any ask.
- **Truthful scarcity:** one seat per industry; live counts only from the database and behind a feature flag.
- **Ending well:** a warm, memorable end moment on every conversion.

Write `docs/persuasion-map.md` as you build, listing each principle, the component that uses it, and the file path.

## 5. Pages and features

Build every route in brief section 4, plus the following:
- **`/press`:** logo kit, bilingual boilerplate, colours.
- **`/downloads`:** sponsorship prospectus and university one-pager, with no email gate.
- **`/go/[campaign]`:** QR and poster routes that redirect with UTM parameters and remember the source. Campaigns: `general`, `graduates`, `universities`, `sponsors`, `business`.
- **`/join`:** five modes: graduate, university, sponsor, business, chapter.
- **`/events`:** Gregorian and Hijri dates (`islamic-umalqura`), add-to-calendar, a Friday–Saturday weekend awareness note, a Ramadan-mode flag and an elegant empty state.
- **Sharing and contact:** a WhatsApp click-to-chat button and community link; native share plus WhatsApp, LinkedIn and X.
- **Referrals:** a personal invite link after joining (`?ref=`).
- **Newsletter:** double opt-in, separate lists per language.
- **`/admin`:** protected; submissions by form and campaign, CSV export, and a manual "Opportunities created" north-star panel (jobs, contracts, referrals, startups).
- **Feature flags:** live counters, A/B headline tests and Ramadan mode, all off by default.

## 6. Forms

Use `starters/src/lib/schemas.ts` (Zod) with React Hook Form and server actions.

- **Storage and email:** Supabase for storage; Resend for bilingual acknowledgements.
- **Protection:** honeypot and rate limiting.
- **Consent and campaign data:** a required, unticked consent box. Store UTM, `ref` and campaign source with each submission.
- **Women's circle preference:** optional, private, never shown publicly.
- **Phone numbers:** Saudi format with international numbers allowed.
- **Drafts:** autosaved in sessionStorage.
- **Errors:** kind, specific messages in both languages.
- **Confirmation:** after submitting, the visitor sees an **invitation card** (their name, the date in both calendars, the next step) plus the journey thread with "Join ✓" lit.

## 7. Stack

- **Core:** Next.js (App Router), TypeScript (strict), React Server Components by default.
- **Styling:** Tailwind CSS mapped to CSS-variable tokens; logical properties only.
- **Languages:** next-intl with `en` and `ar`; `lang`, `dir` and fonts switch per locale.
- **Motion:**
  - CSS scroll-driven animations first.
  - Motion (Framer Motion) for component transitions.
  - GSAP only where a timeline genuinely needs it, lazy-loaded per scene.
  - View Transitions API with a graceful fallback.
- **Optional WebGL:** lazy-loaded for the hero light only when `navigator.hardwareConcurrency` is at least 4, the device is not reporting low battery or data-saver, and reduced motion is off. The static SVG and CSS version must look complete on its own.
- **Fonts:** `next/font`, self-hosted, subset for Arabic and Latin.
- **Data and email:** Supabase and Resend.
- **Analytics:** Plausible, cookieless, behind a flag.
- **Hosting:** Vercel.
- **Testing:** Playwright and Lighthouse CI.

## 8. Quality bar

Meet brief section 9 and `04-acceptance-checklist.md`. Highlights:
- **Speed:** mobile Lighthouse 90 or higher in every category; LCP 2.5 s or less on 4G; initial JavaScript 200 KB gzipped or less, excluding lazily loaded scenes; CLS 0.05 or less.
- **Accessibility:** WCAG 2.2 AA, keyboard complete, visible gold focus ring, text equivalents for every visual story.
- **Layout:** responsive at 360, 768, 1024 and 1440 px; no horizontal page scroll; dark mode.
- **Tests:** Playwright covers every route in both locales, every form mode, the `/go` redirects, reduced motion and RTL snapshots.

## 9. Phases

Stop after each phase, run its checks and report.

1. **Foundation:** scaffold, tokens, fonts, i18n with RTL, layout, header, footer, language switch, temporary wordmark, all routes stubbed, page transitions.
2. **Content:** every page built from `messages/*.json`, including FAQs, chapters, events empty state, press, downloads and privacy.
3. **Conversion:** five form modes, consent, storage, emails, invitation-card confirmation, `/go`, UTM and referral capture, WhatsApp and sharing, add-to-calendar with Hijri dates.
4. **Immersion:** the "Crossing at First Light" home story and all signature interactions, with reduced-motion and low-power fallbacks.
5. **Measurement:** analytics events, `/admin`, CSV export, feature flags.
6. **Brand swap and polish:** apply `brand/` when present, generate Open Graph images and icons, add structured data, run the accessibility audit and Lighthouse CI, and write the README.

At the end, deliver:
- a launch checklist
- the list of remaining placeholders
- `docs/how-to-add-content.md` for a non-developer
- a two-week launch plan using the five posters with their `/go` QR routes, WhatsApp-first distribution, LinkedIn for businesses, and Instagram, Snapchat and X for graduates

Begin with step 0.
