# Deploying to Vercel

## 1. The one variable that changes what crawlers see

```
SITE_URL = https://east2westds.vercel.app
```

Full origin, with the scheme, **no trailing slash**. A bare `east2westds.vercel.app`
would be published verbatim as a canonical URL and is invalid.

Every absolute URL on the site is built from this: canonical links, hreflang
alternates, the sitemap, Open Graph image URLs and the invite links in
confirmation emails. If it is unset, `src/config/site.ts` now falls back to
Vercel's own `VERCEL_PROJECT_PRODUCTION_URL`, so a deploy is correct with no
configuration at all — but set it anyway, because it is what you will point at a
real domain later, and it removes any dependence on the platform's variables.

**Changing it requires a redeploy.** Most pages are prerendered, so the canonical
link, the hreflang alternates and the whole sitemap are baked into the HTML at
build time. Saving the variable and reloading the page shows the old URLs and
looks like the change failed. Deployments → latest → ⋯ → Redeploy.

## 2. Order matters for the admin gate

Set these **together**, not `ADMIN_PASSWORD` first:

```
ADMIN_PASSWORD        = <long random string>
ADMIN_SESSION_SECRET  = <32+ random characters>
SUPABASE_URL          = https://<project>.supabase.co
SUPABASE_SERVICE_ROLE_KEY = <service role key>
RATE_LIMIT_SALT       = <random string>
```

The reason is not obvious. `/admin` is rate limited per IP, but the counter is
stored in Supabase; without it the limiter falls back to a per-process counter,
which on serverless resets with every cold instance. Set `ADMIN_PASSWORD` while
Supabase is still unconfigured and you have a live password gate on a public URL
with no durable limit behind it. A one-second delay on every wrong password now
brakes that, but a brake is not a lock.

Until `ADMIN_PASSWORD` is set, `/admin` refuses to open at all, which is the safe
state. There is no rush to set it.

**Before real applications arrive**, move this off a shared password to Supabase
Auth with an email allowlist. `src/lib/admin-auth.ts` is the only file that
changes. The CSV export hands over the entire database in one click, and that is
personal data under Saudi Arabia's PDPL.

## 3. Everything else degrades honestly

Unset, these hide their own UI rather than rendering a broken promise:

```
RESEND_API_KEY, EMAIL_FROM     acknowledgement emails; without them a
                               submission still succeeds and still shows the
                               invitation card, it just sends no email
CONTACT_EMAIL, CONTACT_PHONE   /contact shows no mailto: or tel: link
WHATSAPP_COMMUNITY_URL         the WhatsApp buttons do not render
SOCIAL_*                       the footer social row does not render
ANALYTICS_ENABLED              analytics are off unless this is "true"
```

Run `docs/placeholders.md` for the full list and what each one gates.

Note that with **no** Supabase configured, forms validate and then fail at the
final step with a storage error. That is a dead end for an applicant, so set
Supabase before you publicise any link that leads to `/join`.

## 4. After the redeploy

1. Check `/en` and `/ar` both load, and the language switch keeps the page.
2. View source on any page and confirm `<link rel="canonical">` points at your
   real origin, not `localhost:3000`.
3. Fetch `/sitemap.xml` and confirm the same.
4. Submit one test application and confirm the invitation card appears.
5. Run PageSpeed Insights. Expect the Lantern column in `docs/performance.md`,
   not the real-throttling one — that difference is explained there.
