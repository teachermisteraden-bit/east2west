# Adding content

Written for someone who is not a developer. Every change below is a text file
edited on GitHub, then saved — the site rebuilds itself.

Two rules hold everywhere:

- **Everything needs both languages.** If you add an English line without an
  Arabic one, the build fails. That is deliberate.
- **Nothing goes on the site until it is true.** A partner is not listed until
  they have agreed. An event is not listed until it is booked.

---

## Adding an event

Open `src/content/events.ts`. Add an entry inside the square brackets:

```ts
{
  slug: "first-gathering",              // short name, lowercase, hyphens
  type: "gathering",                     // gathering | keynote | workshop | hiring | showcase | summit
  title: { en: "First weekly gathering", ar: "أول لقاء أسبوعي" },
  summary: { en: "An evening of introductions.", ar: "أمسية تعارف." },
  start: "2026-10-08T19:00:00+03:00",    // Saudi time, so keep +03:00
  end:   "2026-10-08T21:00:00+03:00",
  city:  { en: "Madinah", ar: "المدينة المنورة" },
  venue: { en: "Partner venue", ar: "مقر شريك" },   // optional
},
```

The Hijri date, the add-to-calendar file and the "upcoming" or "past" grouping
all happen on their own. While the list is empty the page shows its waiting
message, which is correct — it is better than an invented event.

## Adding a chapter

Open `src/content/chapters.ts`:

```ts
{
  slug: "jeddah",
  kind: "city",            // city | campus | alumni
  status: "next",          // founding | next | later
  country: "SA",           // ISO code, so other countries group correctly later
  name: { en: "Jeddah", ar: "جدة" },
  coords: [39.19, 21.49],  // [longitude, latitude], for the map
},
```

## Adding a partner, a speaker or a testimonial

Open `src/components/proof/ProofSlot.tsx` and add to the matching list.

**These sections are invisible until you add something real.** That is on
purpose: an empty testimonial slot showing "coming soon" reads as a claim the
society cannot yet make. Add a quote only with the person's permission, and a
logo only once an agreement exists.

## Adding a download

Put the PDF in `public/downloads/`, then add it to `src/content/downloads.ts`.
Until a file is there, the page says so rather than offering a broken link.
There is no email field on that page and there should never be one.

## Changing wording

All site text lives in `messages/en.json` and `messages/ar.json`. Find the line
and change both files. If you add a new line, add it to both or the build fails.

Anything marked `"_draft": true` is waiting for review. When you are happy with
it, delete that `_draft` line. `docs/draft-strings.md` lists them all.

## Changing contact details, links or response time

None of these are in the code. They are environment variables — set them in
Vercel under Settings → Environment Variables. `README.md` lists every one.
An empty value hides its own feature, so a missing WhatsApp number simply means
no WhatsApp button, never a broken one.

## Recording an opportunity

Sign in at `/admin`, open **Opportunities**, and record it. This is the number
the society is judged on, and it is typed in by hand because a job offer happens
in a room rather than in a browser. It stays at zero until something real
happens, and that is the honest state.
