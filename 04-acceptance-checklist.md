# 04 — Acceptance checklist (definition of done)

Tick every box before launch. Claude Code reports against this list at the end of each phase.

## Truth and content
- [ ] Every visible string comes from `messages/en.json` or `messages/ar.json`. Draft additions are listed for owner review.
- [ ] No invented numbers, partners, logos, testimonials, speakers, prices, press or licences anywhere.
- [ ] The founding-stage status is stated honestly (FAQ and About).
- [ ] Social proof components are hidden when their data is empty.
- [ ] "Founded in Madinah, serving all of Saudi Arabia" appears in the hero eyebrow and the footer.
- [ ] All nine programmes, the six-week challenge, the member journey, the four values, the three pillars, the flywheel, the chapters and the roadmap are present.

## Bilingual and cultural
- [ ] `/en` and `/ar` exist for every route, and the language switch keeps the visitor on the equivalent page.
- [ ] `lang` and `dir` are correct; layout mirrors through logical properties; no letter-spacing on Arabic.
- [ ] The sun's path stays geographically true (dawn on the right, dusk on the left) in both languages.
- [ ] Hijri (Umm al-Qura) and Gregorian dates appear on events and confirmations.
- [ ] No Qur'anic text, name of Allah, mosque imagery, national emblem, flag or royal symbols used decoratively.
- [ ] Women's circle preference is optional, private and never displayed publicly.

## Noble experience
- [ ] The hero looks complete on first paint without JavaScript.
- [ ] Motion uses the noble easing and durations from the tokens; nothing bounces.
- [ ] Native scrolling everywhere; no smooth-scroll library; at most two sticky scenes, desktop only, each no taller than 200vh.
- [ ] Optional WebGL loads only on capable devices, and the static fallback is equally polished.
- [ ] Page transitions (View Transitions) and the door-opening transition work, with graceful fallback.
- [ ] Hairline frames, gold focus rings, hover lines, custom cursor (fine pointer only) and the 404 page are finished to the same standard.
- [ ] Reduced motion shows every scene in its final state.

## Conversion
- [ ] Exactly one primary CTA per view; reassurance text under every CTA.
- [ ] Five form modes with progress thread, autosaved draft, kind bilingual errors, honeypot and rate limit.
- [ ] Consent box is required and never pre-ticked.
- [ ] Submissions store UTM, campaign and referral data; acknowledgement emails go out in the visitor's language.
- [ ] The invitation-card confirmation shows name, dual-calendar date, next step, invite link and "Join ✓".
- [ ] `/go/general`, `/go/graduates`, `/go/universities`, `/go/sponsors` and `/go/business` redirect correctly with UTM parameters.
- [ ] WhatsApp chat and community links, share buttons and add-to-calendar all work (and hide when their config is empty).
- [ ] Downloads have no email gate.
- [ ] Newsletter uses double opt-in.
- [ ] `docs/persuasion-map.md` lists every principle, component and file path.

## Measurement and admin
- [ ] Analytics are cookieless and off unless `ANALYTICS_ENABLED=true`.
- [ ] Funnel events fire: door click, form start, each step, submit, WhatsApp click, download, share.
- [ ] `/admin` is protected and shows submissions by mode and campaign, CSV export, status changes, and the Opportunities Created panel.
- [ ] Feature flags work and are off by default (except the WebGL hero).

## Quality
- [ ] Mobile Lighthouse is 90 or above for performance, accessibility, best practices and SEO on home and every audience page, in both languages.
- [ ] LCP is 2.5 s or less on 4G, CLS is 0.05 or less, and initial JavaScript is 200 KB gzipped or less.
- [ ] WCAG 2.2 AA: keyboard complete, visible focus, text alternatives for every visual story, AA contrast (no small gold text on ivory).
- [ ] Responsive at 360, 768, 1024 and 1440 px, with no horizontal page scroll.
- [ ] Dark mode works with the system setting and the manual toggle.
- [ ] SEO: bilingual metadata, `hreflang`, canonical URLs, sitemap, robots, Organization and Event structured data (no unverifiable claims), Open Graph images per page.
- [ ] Security: server-side validation, secrets only in the environment, RLS enabled on every table.
- [ ] Playwright passes: all routes in both locales, all form modes, `/go` redirects, reduced motion, RTL snapshots.

## Handover
- [ ] README lists every environment variable and placeholder.
- [ ] `docs/how-to-add-content.md` explains, for a non-developer, how to add an event, a partner, a speaker and a testimonial.
- [ ] Launch checklist and two-week launch plan delivered.
- [ ] Brand swap from `brand/` completed and the temporary wordmark removed.
