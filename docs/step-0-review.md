# Step 0 — Kit review, conflicts and proposed structure

Status: awaiting owner approval. No site code written yet.

## A. What I will build (15 points)

1. A bilingual Next.js (App Router) site, TypeScript strict, React Server Components by
   default, at `/en` and `/ar` as true equals, with `/` redirecting by `Accept-Language`.
2. Every visible string resolved from `messages/en.json` / `messages/ar.json` through
   next-intl. No string is authored in a component.
3. A tokenised visual system driven entirely by `starters/src/styles/tokens.css`, so the
   later `brand/` swap is one file, plus a clearly temporary text wordmark. No arch logo.
4. The home page as "The Crossing at First Light": pre-dawn hero, two shores, three
   pillars, flywheel, nine programmes, six-week challenge, member journey, Kingdom map,
   four doors, dusk closing.
5. A hero that is complete on first paint with no JavaScript: CSS and SVG lattice with the
   dawn gradient; optional WebGL only behind the capability gate.
6. Native scrolling everywhere, no smooth-scroll library, at most two sticky scenes
   (flywheel, challenge), desktop only, each under 200vh.
7. Scroll reveals via CSS `animation-timeline` with an IntersectionObserver fallback, and a
   reduced-motion path that renders every scene in its final state.
8. Four audience pages on the fixed arc: outcome hero, empathy, guide and plan, what
   changes, what it takes, proof slots, honest FAQ, single invitation.
9. Proof components (testimonials, partner logos, speakers, counters) that render nothing
   until real data exists, so no placeholder ever implies a claim.
10. `/join` with five modes (graduate, university, sponsor, business, chapter) on the
    starter Zod schemas, React Hook Form, server actions, a real progress thread, a
    sessionStorage draft, honeypot and rate limiting.
11. A required, never pre-ticked consent box; UTM, campaign and `ref` stored with every
    submission; women's circle preference optional and never shown publicly.
12. An invitation-card confirmation: name, Gregorian and Umm al-Qura dates, next step,
    personal invite link, and the journey thread with "Join ✓" lit.
13. `/go/[campaign]` QR redirects, WhatsApp chat and community links, native and social
    sharing, add-to-calendar, ungated downloads, and double opt-in newsletter per language.
14. A protected `/admin` with submissions by mode and campaign, CSV export, status changes,
    and the manual "Opportunities created" north-star panel; feature flags off by default.
15. The quality bar enforced, not hoped for: a CI bundle budget, Lighthouse CI, and
    Playwright across every route in both locales, all five form modes, the `/go`
    redirects, reduced motion and RTL snapshots.

## B. Conflicts and gaps

Findings marked **verified** were reproduced by running code in this repo.

### B1. The gold focus ring fails WCAG 2.2 — **verified**

`tokens.css` sets `--focus: var(--antique-gold)` and `:focus-visible { outline: 2px solid
var(--focus) }`. Measured contrast of `#B0873F`:

| Surface | Ratio | SC 1.4.11 needs 3:1 |
|---|---|---|
| `--ivory` `#F5F1E8` (page) | 2.92:1 | **fail** |
| `--stone` `#E6E0D3` (cards) | 2.50:1 | **fail** |
| `--surface` `#FBF9F4` | 3.13:1 | pass |
| `--gold-light` on `--obsidian` (dark mode) | 9.84:1 | pass |

The checklist demands both "visible gold focus ring" and WCAG 2.2 AA; as tokenised these
contradict on light surfaces.

**Proposed resolution.** Keep `--antique-gold` exactly as designed for decorative hairlines
(which carry no information and are exempt), and add two tokens for the cases where
contrast is required:

- `--gold-deep: #967336` — focus rings and informational hairlines on light surfaces.
  Minimum 3.32:1 across ivory, surface and stone.
- `--gold-text: #7B5E2C` — gold numerals and text on light surfaces. Minimum 4.59:1 across
  all three, so it clears AA body text.

Dark mode is unchanged. This preserves the art direction's intent (gold stays the accent)
and makes it pass.

### B2. Gold numerals on ivory fail — **verified**

`01` §2 asks for journey, step and flywheel numerals in antique gold, and separately says
gold must never be small text on ivory. At 2.92:1, gold fails even the 3:1 large-text
threshold on ivory.

**Proposed resolution.** Gold numerals on dark surfaces only (5.67:1 on obsidian, as
designed). On ivory use `--gold-text` above, or `--palm` (7.15:1).

### B3. The primary button on the obsidian hero — **verified**

`--palm` on `--obsidian` is 2.31:1, so a palm button's edge against the hero background is
not discernible (SC 1.4.11). The label itself is fine (ivory on palm, 7.15:1), and
`tokens.css` already maps `--primary` to `--palm-soft` in dark theme — but the hero is
obsidian even in light theme.

**Proposed resolution.** Scope an `.on-dark` context that maps `--primary: var(--palm-soft)`
(6.60:1), and give the primary button a persistent `--gold-light` hairline (9.84:1) rather
than only tracing it on hover. This matches the craft detail in `01` §2 and supplies the
boundary.

### B4. Zod 4 silently discards two error message keys — **verified**

`starters/src/lib/schemas.ts` uses Zod 3 option names. Current Zod is 4.6.5. Parsed under
Zod 4, the message keys are ignored and English defaults surface instead:

| Field | Expected key | Zod 4 actually returns |
|---|---|---|
| `graduationYear` (`invalid_type_error`) | `graduationYear` | `Invalid input: expected number, received NaN` |
| `consent` (`errorMap`) | `consent` | `Invalid input: expected true` |

This leaks untranslated English into the Arabic form, breaking non-negotiable 2 and the
"kind bilingual errors" checklist item — and it hits precisely the graduation-year message
that `02` §4 quotes as the microcopy standard.

**Proposed resolution.** Adopt Zod 4 and port both to its `error` key:
`z.literal(true, { error: "consent" })` and `z.coerce.number({ error: "graduationYear" })`.
Verified to return `["consent","graduationYear"]`. Add a unit test asserting every schema
issue message is a known `join.errors.*` key, so this cannot regress silently.

### B5. Option labels missing from the approved copy — **verified**

Schema enums with no corresponding strings in `messages/*.json`:

| Schema field | Enum values | Copy status |
|---|---|---|
| `universitySchema.interest` | campusChapter, training, hiringEvent, challengeCycle | no labels |
| `chapterSchema.coDirector` | yes, no, notYet | no labels |
| `sponsorSchema.options` | six keys | `sponsors.options` exists but as an **unkeyed array**, so it cannot be mapped to enum keys by index safely |

`businessSchema.roles` and `graduateSchema.status` are fully covered.

**Proposed resolution, in three parts.**
- `sector`, `semester`, `languages`, `budget`: keep as free text or optional inputs. The
  schemas already type them as strings, so no new copy is needed at all.
- Sponsor options: add a keyed `join.options.*` block that reuses the exact approved names
  already in `sponsors.options`. Re-keying, not rewriting — nothing invented.
- University `interest` and chapter `coDirector`: genuinely new strings. I will draft
  English, mark `"_draft": true`, and **not** machine-translate the Arabic. These two
  controls stay out of the shipped form until you supply Arabic.

### B6. "Two shores. One bridge." survives from the superseded concept

`home.shores.title` reads "Two shores. One bridge." / "ضفتان، وجسر واحد." — the brief's
retired Bridge concept, in copy that is non-negotiable and approved.

**Proposed resolution.** Keep the copy verbatim and let Scene 1's gold thread drawing across
the divide be the bridge. The word stays; the arch logo does not appear anywhere.

### B7. The sun's path versus RTL mirroring

`01` §7 requires the layout to mirror in Arabic while dawn stays on the right and dusk on
the left. But Scene 1 places graduates on the East shore, so plain mirroring would flip East
to the left and break the geography. The brief (§9) similarly exempts "the arch and the map".

**Proposed resolution.** Define a non-mirroring compass layer. The hero light origin, the
two-shores east/west placement, the Kingdom map and the dusk close use physical properties
and are explicitly exempt; everything else uses logical properties and mirrors. Expressed as
a single `.compass-fixed` utility so the exemption is greppable, and covered by the RTL
snapshot tests.

### B8. Sticky and pinned scenes: brief versus kit

Brief §3 scene 6 pins and scrolls horizontally, and §8 allows Lenis. The master prompt and
`01` §3 replace both.

**Proposed resolution.** Kit wins. Two sticky scenes only — flywheel and six-week challenge
— desktop ≥1024px, each under 200vh, native scroll throughout. The challenge becomes a
vertical timeline below 1024px and under reduced motion. No Lenis.

### B9. The JavaScript budget versus the motion stack

Initial JS is capped at 200 KB gzipped with mobile Lighthouse ≥90 in every category, while
the stack permits Framer Motion, GSAP, WebGL and View Transitions.

**Proposed resolution.** CSS scroll-driven animations carry the default case; Framer Motion
appears only in leaf client components; GSAP is dynamically imported per scene and only
≥1024px; WebGL sits behind the capability gate. A CI bundle-budget check fails the build
over 200 KB so the ceiling is enforced rather than assumed.

### B10. `/admin` authentication is unspecified

`.env.example` offers only `ADMIN_PASSWORD`.

**Proposed resolution.** For now: a single-password gate over a signed, httpOnly session
cookie, rate-limited, `noindex`, with all data access server-side through the service role.
I want to flag plainly that a shared password is weak protection for personal data under
PDPL. My recommendation is Supabase Auth with an email allowlist before real submissions
arrive. **This needs your decision.**

### B11. Newsletter double opt-in

Resend does not provide double opt-in. `schema.sql` already carries `token` and
`confirmed_at`, and `unique (email, locale)` gives separate lists per language.

**Proposed resolution.** Implement the confirm flow on those columns. `token` is `not null`
with no default and no index; I will add both in a migration rather than editing the
supplied schema in place.

### B12. RLS is enabled with no policies

All three tables enable RLS and define no policies, so nothing is readable by the anon key.
That is correct and safe for service-role-only access, and I will keep it that way — reading
the checklist item as "enabled with no anonymous access". The anon key will never touch
these tables. Noting it so the absence of policies is understood as deliberate.

### B13. Missing kit assets

`assets/posters/` and `assets/reference/` never arrived as files. The posters are needed for
per-page Open Graph images and for the two-week launch plan; I have seen them in
conversation but have no files on disk.

**Proposed resolution.** Please send the five poster files. Until then I will generate OG
images from the tokens and approved copy with `next/og`, inventing nothing, and swap the
posters in when they arrive. `assets/reference/` is background only and is not blocking.

### B14. Copy gaps for features the brief predates

No approved strings exist for: `/admin` UI, share labels, newsletter confirm and success
states, Ramadan mode, or the dark-mode toggle. Per non-negotiable 2 I will add each to both
files with `"_draft": true` siblings and list them for your review. `/admin` is owner-facing
and English-only unless you want it bilingual.

### B15. Smaller notes

- Hero CTA "Find your door" uses native CSS smooth scrolling only; `tokens.css` already
  forces `scroll-behavior: auto` under reduced motion. Compliant as written.
- Western digits are the default in both languages, matching `dates.ts` (`nu-latn`) and
  `FLAG_ARABIC_INDIC_DIGITS=false`. The brief left this for you to confirm.
- The dual-calendar helper is verified working on this Node: 16 September 2026 renders as
  "Rabiʻ II 5, 1448 AH" and "٥ ربيع الآخر ١٤٤٨ هـ" in Latin digits.
- `referral_code text unique` permits multiple NULLs in Postgres, so non-graduate modes are
  fine as-is.

## C. Does `brand/` exist?

**No.** There is no `brand/` directory. As instructed I will build on the provisional tokens
in `starters/src/styles/tokens.css`, keep every colour, font, radius, duration and easing
referenced only through a token so the swap is a single change, and ship a clearly temporary
text wordmark. The retired arch logo will not be recreated anywhere.

## D. Proposed folder structure

```
east2west/
├─ 00-MASTER-PROMPT.md … 04-acceptance-checklist.md   kit, reference only
├─ KIT-README.md
├─ brand/                          (later, from Claude Design; overrides tokens)
├─ docs/
│  ├─ east-to-west-site-build-brief.md / .pdf
│  ├─ step-0-review.md             this file
│  ├─ persuasion-map.md            written during the build
│  ├─ how-to-add-content.md        phase 6
│  ├─ launch-checklist.md          phase 6
│  └─ launch-plan-two-weeks.md     phase 6
├─ messages/en.json, ar.json       the only source of site text
├─ starters/                       kept as supplied, for diffing
├─ public/fonts/ og/ downloads/ icons/
├─ supabase/schema.sql, migrations/
├─ src/
│  ├─ app/
│  │  ├─ [locale]/
│  │  │  ├─ layout.tsx             lang, dir, fonts, header, footer, view transitions
│  │  │  ├─ page.tsx               home — The Crossing at First Light
│  │  │  ├─ about/ programmes/ graduates/ universities/ sponsors/ businesses/
│  │  │  ├─ events/ chapters/ join/ contact/ privacy/ press/ downloads/
│  │  │  └─ not-found.tsx
│  │  ├─ go/[campaign]/route.ts    UTM redirects
│  │  ├─ admin/                    protected
│  │  ├─ api/newsletter/confirm/route.ts
│  │  ├─ sitemap.ts, robots.ts, opengraph-image.tsx
│  │  └─ layout.tsx                root redirect by Accept-Language
│  ├─ components/
│  │  ├─ brand/Wordmark.tsx        TEMPORARY text wordmark, no arch
│  │  ├─ scenes/                   Hero, TwoShores, Pillars, Flywheel, Programmes,
│  │  │                            Challenge, Journey, KingdomMap, FourDoors, Closing
│  │  ├─ ui/                       Button, Card, InvitationCard, Hairline, Eyebrow,
│  │  │                            LanguageSwitch, ThemeToggle, Cursor, ShareRow,
│  │  │                            AddToCalendar, WhatsAppButton
│  │  ├─ forms/                    JoinForm, five mode steps, ProgressThread, ConsentBox
│  │  └─ proof/                    Testimonials, PartnerLogos, Counters — null when empty
│  ├─ content/                     programmes.ts, events.ts, chapters.ts
│  ├─ config/                      site.ts, flags.ts
│  ├─ lib/                         schemas.ts, dates.ts, campaigns.ts, supabase.ts,
│  │                               email.ts, rateLimit.ts, analytics.ts, referral.ts
│  ├─ styles/                      tokens.css, globals.css
│  └─ i18n/                        next-intl routing and request config
├─ tests/e2e/                      routes × locales, five form modes, /go,
│                                  reduced motion, RTL snapshots
├─ .env.example
├─ lighthouserc.json
└─ tailwind.config.ts, next.config.ts, tsconfig.json
```

## E. Decisions I need from you

1. **B1–B3, the contrast tokens.** Approve `--gold-deep` and `--gold-text` as above?
2. **B4, Zod 4 and the port.** Approve, or would you rather pin Zod 3?
3. **B5 and B14, draft copy.** Approve me drafting English-only `_draft` strings and holding
   the affected controls until you supply Arabic?
4. **B10, `/admin` auth.** Password gate for now, or Supabase Auth with an allowlist?
5. **B13, the posters.** Please send the five files.
