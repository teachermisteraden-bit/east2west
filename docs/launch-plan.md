# The first two weeks

A plan for launching with the five posters and the `/go` links, written for a
founding society with no audience yet and nothing to prove but its seriousness.

The aim of these two weeks is **not** a large number of applications. It is
twenty real graduates, three or four businesses in the room, and one university
conversation — enough to run the first gathering well.

## Before day one

- Print the five posters with their QR codes pointing at the `/go` links below.
  **Scan each one on a real phone first**, in both languages: the redirect
  resolves the visitor's language from the browser, and a poster is expensive to
  reprint.
- Put a WhatsApp community link in `WHATSAPP_COMMUNITY_URL`. Most of this plan
  runs through WhatsApp, and without that link every "join the community" step
  hides itself.
- Set `ANALYTICS_ENABLED=true` so the week can be read afterwards.

| Poster | Link | Lands on | Tagged as |
|---|---|---|---|
| General | `/go/general` | Home | `poster-general` |
| Graduates | `/go/graduates` | Graduates | `poster-membership` |
| Universities | `/go/universities` | Universities | `poster-universities` |
| Sponsors | `/go/sponsors` | Sponsors | `poster-sponsorship` |
| Business | `/go/business` | Businesses | `poster-business` |

Each carries its own UTM tags and drops a first-party cookie, so an application
submitted three days after a scan is still attributed to that poster. `/admin`
groups submissions by campaign.

## Week one — people you already know

The society's first members should come from real relationships, not from reach.

**Day 1–2. WhatsApp, one message at a time.**
Send the graduates poster to people individually, not to a broadcast list. A
message that names the person and says why you thought of them will convert an
order of magnitude better than anything else in this plan. Aim for thirty
messages, not three hundred.

**Day 3. LinkedIn, for businesses.**
One post from Muhsin's own account, not a page: what the society is, that it is
at founding stage, and what a Business Circle seat means. Link `/go/business`.
Reply to every comment; the replies matter more than the post.

**Day 4–5. Universities.**
Email two or three career centres in Madinah, with the universities poster
attached and `/go/universities` in the signature. Ask for a twenty-minute
meeting, not a partnership. The one-pager should exist by now.

**Day 6–7. Read the week.**
Open `/admin`, group by campaign, and see which poster actually moved. Check
where the form is being abandoned — the "Form Step" event records the step
people reach. If everyone stops at the same step, that step is too long.

## Week two — the first gathering

**Day 8–9. Confirm a date and a venue**, then add it to
`src/content/events.ts`. The events page stops showing its waiting message the
moment a real event exists, the Hijri date and the calendar file appear on their
own, and every "see upcoming events" link on the site starts pointing somewhere.

**Day 10–11. Instagram, Snapchat and X, for graduates.**
The general and graduates posters, linking `/go/graduates`. These are the
channels where reach helps; the WhatsApp messages of week one are what convert.

**Day 12. Sponsors, quietly.**
Approach two businesses who already know the founder, with the sponsorship
poster and `/go/sponsors`. Founding sponsors are a relationship, not a campaign.

**Day 13. Remind, once.**
One message to everyone who started an application and did not finish. Once
only — the site does not nag and neither should the launch.

**Day 14. Hold the gathering, then record what came of it.**
Afterwards, open `/admin` → Opportunities and record anything real: a job, a
contract, a referral, a startup. That number is the only one that matters, and
it is typed in by hand because it happens in a room rather than in a browser.

## What to watch, and what to ignore

**Watch:** applications by campaign; where the form is abandoned; how many
people join the WhatsApp community; how many turn up to the gathering having
said they would.

**Ignore:** page views, impressions, followers. None of them is an opportunity
created, and a founding society that starts optimising for them will end up with
an audience instead of a membership.

## Two things not to do

- **Do not add a countdown, a fake seat counter or "only 3 places left".** The
  site has no dark patterns in it and the launch should not introduce any. The
  one seat per industry is a real rule of the Business Circle; a live count
  appears only when the flag is on *and* the database holds real numbers.
- **Do not publish a partner logo, a testimonial or a number before it is true.**
  The proof sections are empty on purpose and will stay invisible until there is
  something real to put in them. Two weeks of honest emptiness costs far less
  than one invented figure.
