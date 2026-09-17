# East to West Development Society — website

جمعية الشرق إلى الغرب للتنمية

A bilingual (English and Arabic) website for a professional community founded in
Madinah, connecting Saudi graduates and international Muslim graduates with each
other and with businesses across the Kingdom.

---

## Running it

```bash
npm install
cp .env.example .env.local     # then fill in what you have; empty values hide their UI
npm run dev                    # http://localhost:3000
```

Nothing is required to see the site. Every unset value hides its own feature
rather than showing a placeholder: no contact email means no email link, no
WhatsApp number means no WhatsApp button, no Supabase means forms report
honestly that they could not be saved.

## The checks

```bash
npm run check        # typecheck, unit tests, build, bundle budget
npm run typecheck
npm run lint
npm test             # unit tests (node:test via tsx)
npm run test:e2e     # Playwright: routes, forms, story, admin, accessibility
npm run budget       # first-load JS per route, against the 200 KB budget
npx lhci autorun     # Lighthouse CI, mobile preset
```

`npm run budget` only sees statically rendered routes unless you point it at a
running server, and `/join` — the heaviest page — is dynamic:

```bash
npm run build && npx next start -p 4300 &
BUDGET_BASE_URL=http://localhost:4300 npm run budget
```

## Environment

Everything lives in `.env.example`. None of it is required to run the site.

| Variable | What it does | Without it |
|---|---|---|
| `SITE_URL` | Canonical origin, used in metadata, sitemap and invite links | Falls back to localhost |
| `CONTACT_EMAIL` | Shown on Contact and in the footer | The email link is hidden |
| `CONTACT_PHONE` | WhatsApp click-to-chat | The WhatsApp link is hidden |
| `WHATSAPP_COMMUNITY_URL` | The community invitation | Every "join the community" link is hidden |
| `SOCIAL_LINKEDIN` / `_INSTAGRAM` / `_X` / `_SNAPCHAT` | Footer and structured data | Each icon hides on its own |
| `RESPONSE_TIME_EN` / `_AR` | "We reply within …" | Defaults to 3 working days |
| `MEMBERSHIP_COST_EN` / `_AR` | The FAQ answer about cost | Says fees will be announced, which is true |
| `NEXT_PUBLIC_SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY` | Storing submissions | Forms tell the visitor honestly that it failed |
| `RESEND_API_KEY`, `NOTIFY_EMAIL` | Acknowledgement emails | Submissions still save; no email is sent |
| `ADMIN_PASSWORD`, `ADMIN_SESSION_SECRET` | The `/admin` gate | The admin cannot be opened |
| `RATE_LIMIT_SALT` | Salts the hashed IP used for rate limiting | A per-boot salt is generated |
| `ANALYTICS_ENABLED`, `PLAUSIBLE_DOMAIN` | Cookieless analytics | Nothing is loaded at all |
| `FLAG_*` | Feature flags | All off except the WebGL hero |

## How it is put together

```
messages/en.json, ar.json   the only source of site text
src/i18n/locales.ts         the one place a language is added
src/config/                 site values, nav, feature flags
src/content/                programmes, events, chapters, downloads, the map
src/lib/                    schemas, dates, analytics, auth, storage
src/components/scenes/      the home story, scene by scene
src/components/forms/       the five join modes
src/app/[locale]/           every public route
src/app/admin/              the owner's workspace, outside locale routing
supabase/                   schema and migrations
docs/                       decisions, persuasion map, handover
```

A few rules the code holds to, each with a test that fails if it is broken:

- **Every visible string comes from `messages/*.json`.** Nothing is authored in a
  component. `tests/messages.test.mjs` holds the locales to key, placeholder and
  list-length parity, and flags any string left identical to English.
- **Truth over hype.** Social proof renders nothing until real data exists. No
  figure, partner, testimonial or licence is invented anywhere.
- **The sun keeps its real direction.** The hero light, the two shores, the map
  and the dusk close sit in a `.compass-fixed` layer that does not mirror for
  Arabic, because east is east in both languages.
- **200 KB of first-load JavaScript.** `npm run budget` fails the build over it.
- **Reduced motion shows every scene finished**, never a paused animation.

## Adding a language

1. Write `messages/<code>.json`.
2. Set `enabled: true` for that locale in `src/i18n/locales.ts`.

Routing, `lang`/`dir`, fonts, the language switch, the sitemap, `hreflang`, form
validation and the whole test suite follow from the registry. A locale stays
disabled until its copy is complete and human-written.

## Before launch

See `docs/launch-checklist.md` for the full list, and
`docs/placeholders.md` for everything still waiting on a real value.

The one item worth repeating here: **`/admin` is a single shared password.**
Before real applications arrive, move it to Supabase Auth with an email
allowlist. The check lives in one file, `src/lib/admin-auth.ts`, so it is a
small change — and the CSV export is the whole database in one click.
