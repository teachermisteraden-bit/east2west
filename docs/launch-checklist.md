# Launch checklist

Measured state as of the last full run. Anything not ticked is named honestly
rather than quietly dropped.

## Truth and content

- [x] Every visible string comes from `messages/*.json`; draft additions are listed in `docs/draft-strings.md`
- [x] No invented numbers, partners, logos, testimonials, speakers, prices, press or licences anywhere
- [x] The founding-stage status is stated on About and answered in the FAQ
- [x] Social proof components render nothing while empty
- [x] "Founded in Madinah, serving all of Saudi Arabia" appears in the hero eyebrow and the footer
- [x] Nine programmes, the six-week challenge, the member journey, four values, three pillars, the flywheel, chapters and the roadmap are all present
- [ ] **Arabic draft strings reviewed by a native speaker** — see `docs/draft-strings.md`
- [ ] **Privacy wording confirmed with an adviser** — marked a draft on the page

## Bilingual and cultural

- [x] `/en` and `/ar` exist for every route; the switch keeps the visitor on the same page (tested)
- [x] `lang`, `dir` and `data-script` correct; layout mirrors through logical properties; Arabic is never letter-spaced
- [x] The sun's path stays geographically true in both languages (tested in both locales)
- [x] Hijri (Umm al-Qura) and Gregorian dates on events and confirmations
- [x] No Qur'anic text, name of Allah, mosque imagery, emblem, flag or royal symbol anywhere
- [x] The women's circle preference is optional, private, and never displayed

## Experience

- [x] The hero is complete on first paint with no JavaScript (tested with scripting disabled)
- [x] Motion uses the noble easing and durations; nothing bounces
- [x] Native scrolling; no smooth-scroll library; two sticky scenes, desktop only, 190vh each (tested)
- [x] Page transitions use the native View Transitions API, with silent fallback
- [x] Hairline frames, gold focus rings, hover lines and the 404 finished to the same standard
- [x] Reduced motion shows every scene in its final state (tested)
- [ ] Optional WebGL hero enhancement — **not built.** The static hero stands on its own, which was always the requirement; the enhancement was optional and the budget was better spent elsewhere

## Conversion

- [x] One primary action per view, with reassurance beneath it
- [x] Five form modes with a real progress thread, autosaved draft, kind bilingual errors, honeypot and rate limiting
- [x] Consent is required and never pre-ticked, and is not restored from a draft
- [x] Submissions store UTM, campaign and referral data (tested end to end)
- [x] Acknowledgement emails are sent in the visitor's language
- [x] The invitation card shows name, both calendars, next step, invite link and the journey lit
- [x] All five `/go` campaign routes redirect with UTM parameters (tested)
- [x] WhatsApp, share buttons and add-to-calendar work, and hide when unconfigured
- [x] Downloads have no email gate
- [x] Newsletter uses double opt-in, with separate lists per language
- [x] `docs/persuasion-map.md` lists every principle, component and file

## Measurement and admin

- [x] Analytics are cookieless and load nothing unless `ANALYTICS_ENABLED=true` (tested)
- [x] Funnel events fire: door click, form start, each step, submit, WhatsApp, download, share, newsletter
- [x] `/admin` is protected, shows submissions by mode and campaign, CSV export, status changes and the Opportunities panel
- [x] Feature flags work and are off by default
- [ ] **Move `/admin` to Supabase Auth with an email allowlist.** It is a single shared password today. This is the most important item on this page: the CSV export is the whole database in one click, and this is other people's personal data under PDPL. The check lives in one file, `src/lib/admin-auth.ts`

## Quality — measured, not assumed

Lighthouse, mobile preset, median of repeated runs:

| Page | Perf | A11y | Best practices | SEO | LCP | CLS |
|---|---|---|---|---|---|---|
| `/en` | 97 | 100 | 100 | 92 | 3.18s | 0.014 |
| `/ar` | 91 | 100 | 100 | 92 | 3.91s | 0.012 |
| `/en/graduates` | 98 | 100 | 100 | 92 | 3.00s | 0.000 |
| `/ar/sponsors` | 96 | 100 | 100 | 92 | 3.46s | 0.000 |
| `/en/join` | 98 | 100 | 100 | 100 | 3.15s | 0.000 |

- [x] Mobile Lighthouse ≥90 in every category on every page measured
- [x] CLS ≤0.05 — measured 0.000 to 0.014
- [x] First-load JavaScript ≤200 KB gzipped — largest route 167 KB, enforced by `npm run budget`
- [x] WCAG 2.2 AA: axe reports zero violations on every route in both locales, including the form mid-error; keyboard complete; visible gold focus ring; text equivalents for the flywheel and the map
- [x] Responsive at 360, 768, 1024 and 1440 px with no horizontal scroll (tested)
- [x] Dark mode follows the system setting and the manual toggle
- [x] SEO: bilingual metadata, `hreflang`, canonicals, sitemap, robots, Organization and Event structured data with nothing unverifiable
- [x] Open Graph images per locale and per audience page
- [x] Security: server-side validation, secrets only in the environment, RLS enabled on every table with no anonymous access
- [x] Playwright passes: every route in both locales, all five form modes, `/go` redirects, reduced motion, the admin boundary and the accessibility sweep
- [ ] **LCP is 3.0–3.9s against the 2.5s target.** Not met, and worth being precise about: the phase breakdown is TTFB 455ms, load delay 0ms, load time 0ms, **render delay 1.9–3.5s**. It is main-thread work under Lighthouse's 4× CPU throttle, not the network. Fonts were already cut from 420 KB to 116 KB on English pages and CLS from 0.154 to 0.014. Closing the rest means splitting the single stylesheet and inlining critical CSS per route

## Before going live

- [ ] Fill in the environment variables in `docs/placeholders.md`
- [ ] Apply `supabase/schema.sql`, then the two migrations in `supabase/migrations/`
- [ ] Confirm RLS is on and the anon key can read nothing
- [ ] Schedule the daily sweep of `rate_limits` noted at the foot of migration 0001
- [ ] Send one test application in each language and confirm the email arrives
- [ ] Check the five `/go` links resolve on a real phone before the posters are printed
- [ ] Set `ANALYTICS_ENABLED=true` and `PLAUSIBLE_DOMAIN` once the domain is live
