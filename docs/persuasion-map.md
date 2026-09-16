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

## Still to come

- Phase 2: story arc per audience page, honest FAQ, proof slots that render nothing until real.
- Phase 3: endowed progress, goal gradient, commitment and consistency, peak-end, reciprocity, truthful scarcity.
- Phase 4: the scroll story — self-reference (two shores), serial position, the flywheel, the journey thread.
- Phase 5: measurement, with no dark patterns in what is measured.
