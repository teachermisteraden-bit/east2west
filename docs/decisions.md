# Decisions taken under creative control

The owner asked for complete creative control on 2026-09-16, with the roadmap
"Madinah pilot, then Saudi as a whole, then other Muslim countries". These are the
calls I made on the five questions left open in `docs/step-0-review.md` §E, plus
the architectural consequences of that roadmap.

## The five open questions

1. **Contrast tokens — adopted.** `--gold-deep: #967336` for focus rings and
   informational hairlines on light surfaces, `--gold-text: #7B5E2C` for gold text.
   The designed `--antique-gold` is unchanged and still carries every decorative
   hairline, where no contrast minimum applies.

   Related, found while building: `--palm` on obsidian measures 2.31:1, so a filled
   primary button on the dark hero could not state its own edge. Rather than
   lighten the fill to `--palm-soft` — which reads mint, not noble — the deep green
   stays and a gold hairline (`--btn-edge`, 9.84:1 on obsidian) marks the boundary.

2. **Zod 4, with the port.** `z.literal(true, { error: "consent" })` and
   `z.coerce.number({ error: "graduationYear" })`. Building the guard test then
   found a third case of the same bug: every `z.enum` was emitting English prose
   such as `Invalid option: expected one of "graduate"|"student"`. All seven enums
   now carry message keys. `tests/schemas.test.mjs` fails the build if any schema
   ever emits prose instead of a key again.

3. **Draft strings — English drafted, Arabic written carefully and flagged.**
   Each addition gets a `<key>_draft: true` sibling in both locale files and is
   listed in `docs/draft-strings.md` for review. Nothing is machine-translated.

4. **`/admin` — password gate now, behind one seam.** Built in Phase 5 as
   `src/lib/admin-auth.ts`: a timing-safe password check over an HMAC-signed,
   httpOnly session cookie, rate limited, `noindex`, absent from the sitemap, and
   scoped to `/admin` so it is never sent with an ordinary page request. Every
   mutation re-checks the session rather than trusting the page that called it.
   Moving to Supabase Auth with an email allowlist means changing that one file.

   **The recommendation stands: move before real applications arrive.** A shared
   password is weak protection for other people's personal data under PDPL, and
   the CSV export is the whole database in a single click.

5. **Posters — still needed as files.** Open Graph images will be generated from
   the tokens and approved copy, and the posters swapped in when they arrive.

## Built for the roadmap

The pilot is Madinah, but nothing in the architecture assumes Saudi Arabia or two
languages.

- **`src/i18n/locales.ts` is the single place a language is added.** Routing,
  `lang`/`dir`, fonts, the switcher, the sitemap, `hreflang` and form validation all
  derive from it. Turkish, Urdu, Bahasa Indonesia, Malay and French are already
  declared and disabled; each stays disabled until a native speaker has written its
  copy. We never ship a half-translated language.
- **Typography keys off `data-script`, not `lang`.** A new Arabic-script language
  (Urdu) inherits the correct faces, sizes and leading with no new CSS.
- **Chapters carry an ISO country code from day one**
  (`src/content/chapters.ts`), so grouping by country later needs no migration.
  Only real chapters appear: Madinah founding, Jeddah and Riyadh next. "Alumni
  chapters abroad" stays approved copy, not data.
- **`tests/messages.test.mjs` reads the locale registry**, so every language added
  later is automatically held to key parity, placeholder parity, list-length parity
  and an untranslated-string check.
- **The compass layer** (`.compass-fixed`) keeps the sun's path geographically
  true regardless of page direction, so it holds for any right-to-left language,
  not just Arabic.

## Constraints discovered while building

- **View Transitions**: Next 16 has no `experimental.viewTransition` flag and does
  not expose React's `<ViewTransition>`. Page transitions use the native CSS
  `@view-transition { navigation: auto }` instead — zero JavaScript, and browsers
  without support simply navigate normally. This is a better fit for the budget.
- **The JavaScript budget is the real constraint.** React 19 + Next 16 costs
  147.1 KB gzipped before a line of our own client code, leaving 52.9 KB against
  the 200 KB ceiling. Framer Motion would spend over half of what is left, so
  motion is CSS scroll-driven first, as `01` §3 already prefers.
  `scripts/check-bundle-budget.mjs` measures the real prerendered pages and fails
  the build over budget.
- **Next 16 removed `next lint`** and renamed `middleware.ts` to `proxy.ts`. Both
  updated.
