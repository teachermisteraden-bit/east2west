# Persuasion map

Every principle from `02-psychology-and-conversion-map.md`, the component that
applies it, and its file. Each entry also records the ethical limit being held.

Grows with each phase. Phase 1 covers the foundation only.

## Phase 1 — Foundation

| Principle | Where it lives | File | Limit held |
|---|---|---|---|
| Aesthetic–usability effect | The whole token system: high-contrast serif, generous space, hairline rules, slow easing | `src/styles/tokens.css`, `src/styles/globals.css` | Beauty never hides information. Every token that carries meaning is contrast-checked; see `docs/step-0-review.md` §B1–B3 |
| First impression (50 ms visual judgement) | Hero renders complete on first paint — inline SVG lattice, CSS dawn gradient, no image, no JavaScript, no loader | `src/components/scenes/Hero.tsx`, `src/components/scenes/Lattice.tsx` | Nothing shown before it is true; no placeholder implies a claim |
| Above-the-fold attention (NN/g, 84%) | Eyebrow, headline, standfirst and the primary action all clear the fold at 900 px and at 390×844 | `src/components/scenes/hero.css` | — |
| Hick's law | One filled button per view. The header's only filled control is "Apply"; the hero's is "Find your door". Every other control is a quiet link | `src/components/ui/SiteHeader.tsx`, `src/components/ui/chrome.css` | Secondary options stay visible, never hidden behind a menu on desktop |
| Isolation (Von Restorff) | `.btn--primary` is the single palm-green fill; nothing else on the page uses that colour as a background | `src/components/ui/chrome.css` | — |
| Self-reference and identity | The four audience routes lead the navigation, before the society's own pages | `src/config/nav.ts` | All four audiences given equal weight and ordering |
| Unity and belonging | Dual-script wordmark, Arabic and English as equals, `/en` and `/ar` both prefixed so neither is the "real" site | `src/components/brand/Wordmark.tsx`, `src/i18n/routing.ts` | No audience ranked by nationality or language |
| Cognitive fluency | One idea per block, 66-character measure, 16 px minimum body, Arabic given its own sizes and leading | `src/styles/tokens.css` | Conditions are never simplified away |
| Costly signalling (restraint) | Hairline rules, 2 px radii, 400 ms hover, 900 ms reveals, nothing bounces | `src/styles/tokens.css` | Luxury feel never implies high fees or exclusion |
| Truthfulness | Founding-stage sentence sits in the footer on every page; social links render only when a URL exists | `src/components/ui/SiteFooter.tsx`, `src/config/site.ts` | Empty config hides its UI rather than showing a placeholder |
| Reassurance under the ask | Response-time line in the footer, drawn from config, never invented | `src/components/ui/SiteFooter.tsx` | The time shown must be one the society can keep |

## Phase 2 — Content

Every audience page follows the arc from the master prompt §4: outcome → empathy →
the guide and the plan → what changes → what it takes → proof → honest FAQ → the
invitation.

| Principle | Where it lives | File | Limit held |
|---|---|---|---|
| Customer as hero (StoryBrand) | All four audience pages run the same arc, with the society as guide rather than protagonist | `src/app/[locale]/{graduates,universities,sponsors,businesses}/page.tsx` | The plan shown is the real process: apply, learn, connect, build, earn, lead |
| Self-reference and identity | Each page opens with the reader's own outcome, in their words, before anything about the society | the four audience pages | Every audience gets the same structure and weight; none is treated as secondary |
| Empathy before solution | Graduates: "Don't let your degree wait on a network", naming the silence problem | `graduates/page.tsx` | The single permitted use of loss framing (02). Never fear-based, never shaming |
| Goal-gradient effect | The journey's final step is the visually brightest | `src/components/ui/Steps.tsx`, `content.css` `[data-goal]` | The steps shown are the real ones |
| Serial position effect | Benefits lead with weekly networking and close with startup support — the two strongest for this audience | `graduates/page.tsx` | Order follows the approved copy; nothing is overstated to win a position |
| Social proof | Testimonials, partner logos, speakers and counters | `src/components/proof/ProofSlot.tsx` | **Renders nothing while empty.** No "coming soon" where a quote would go, no greyed-out logo strip — nothing that could be read as a claim |
| Truthful scarcity | "One seat per industry" on the businesses page | `businesses/page.tsx`, `.seat` | A real rule of the Business Circle, not a countdown. Live counts need both the flag and real data |
| Authority, honestly bounded | The impact report is shown as a **layout**, with a hairline where each figure will go | `sponsors/page.tsx`, `.report__rule` | Every position carries the "illustrative" label. No figure is invented, not even a plausible one |
| Reciprocity | `/downloads` has no email field anywhere on the page | `src/app/[locale]/downloads/page.tsx` | Free really means free. With no file yet, nothing is offered — better than a link that 404s |
| Cognitive fluency | Hairline-separated lists, one idea per card, 66-character measure | `content.css` | Conditions are never simplified away |
| Hick's law | One filled button per page — the closing invitation. The micro-yes is a quieter link beneath it | `src/components/ui/Invitation.tsx` | The smaller step stays visible, never hidden |
| Peak-end rule | Every audience page ends on the invitation card, with reassurance directly under the action | `Invitation.tsx` | The response time shown comes from config and must be one the society can keep |
| Honest FAQ | Shared across About and all four audience pages | `src/components/ui/SiteFaq.tsx` | Answers "not yet" about registration and "no" about guaranteeing jobs, in both languages |
| Truthfulness | Founding stage on About; privacy marked as a draft on the page itself; the logo page says the mark is not final | `about/`, `privacy/`, `press/` | The visitor can see what is still being worked out |
| Anticipation over absence | The events empty state is framed as a card, reading "First events announced soon" | `events/page.tsx` | No invented events, no fake scarcity, and a real next step so it is not a dead end |

## Still to come

- Phase 3: endowed progress, goal gradient, commitment and consistency, peak-end, reciprocity, truthful scarcity.
- Phase 4: the scroll story — self-reference (two shores), serial position, the flywheel, the journey thread.
- Phase 5: measurement, with no dark patterns in what is measured.
