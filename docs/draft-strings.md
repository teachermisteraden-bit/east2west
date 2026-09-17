# Draft strings awaiting owner review

Strings the approved copy does not yet cover. Each carries a `<key>_draft: true`
sibling in `messages/en.json` and `messages/ar.json`.

Arabic here is written, not machine-translated, and still needs a native speaker's
review before launch. Delete the `_draft` sibling once approved.

## Phase 1

| Key | English | Arabic | Why it was needed |
|---|---|---|---|
| `common.themeToggle` | Switch theme | تغيير المظهر | Accessible label for the dark-mode control. The checklist requires a manual toggle; the kit predates it |
| `join.errors.url` | Please enter a valid link, starting with https:// | يرجى إدخال رابط صحيح يبدأ بـ ‎https:// | The LinkedIn field could only fail with English Zod prose |
| `join.errors.tooLong` | Please shorten this a little so it fits | يرجى اختصار النص قليلًا ليتناسب مع المساحة | Free-text length limits had no message key |

## Phase 3

Re-keyed from copy the owner already approved — the wording is unchanged, only
the key is new, so these carry **no** `_draft` marker:

| Keys | Sourced from |
|---|---|
| `join.options.interest*` (4) | `universities.bring` — the same four things, already named in both languages |
| `join.options.{programme,hiringEvent,chapterPatron,scholarship,keynoteSeries,summit}` | `sponsors.options` — the six options, in order, already named in both languages |

Genuinely new, and flagged for review:

| Key | English | Arabic |
|---|---|---|
| `join.options.coDirectorYes/No/NotYet` | Yes / No / Not yet, but I am looking | نعم / لا / ليس بعد، وأبحث عن شريك |
| `join.typeNoun.*` (5) | membership application, partnership enquiry, sponsorship enquiry, collaboration enquiry, chapter enquiry | طلب العضوية، طلب الشراكة، طلب الرعاية، طلب التعاون، طلب إطلاق الفرع |
| `join.optional` | Optional | اختياري |
| `join.selectAll` | Select all that apply | اختر كل ما ينطبق |
| `join.submitting` | Sending… | جارٍ الإرسال… |
| `join.draftSaved` | Your answers are saved on this device. | حُفظت إجاباتك على هذا الجهاز. |
| `join.stepsTitle` | Your application | طلبك |
| `share.*` (6) | Share, WhatsApp, LinkedIn, X, Copy link, Link copied | شارك، واتساب، لينكدإن، إكس، انسخ الرابط، تم نسخ الرابط |
| `newsletter.*` (6) | Subscribe, and the four confirmation states | اشترك، وحالات التأكيد الأربع |
| `email.subject/greeting/signoff` | We have received your {type} / Hello {name}, / With thanks, | استلمنا {type} / مرحبًا {name}، / مع الشكر، |

The Arabic above was written, not machine-translated. It still needs a native
speaker's review before launch — particularly `join.options.coDirectorNotYet`
and the `typeNoun` phrases, which have to read naturally inside a sentence.

## Launchpad Labs

New programme, added after the approved copy was written, so both languages are
drafts:

| Key | English | Arabic |
|---|---|---|
| `programmes.items.launchpadLabs.name` | Launchpad Labs | مختبرات الإطلاق |
| `programmes.items.launchpadLabs.body` | Members put the highest-value unsolved problems on the table, argue them out, and leave having started to build the ones that hold up. | يطرح الأعضاء أهم المشكلات التي لم تُحل بعد، ويناقشونها، ثم يخرجون وقد بدأوا العمل على ما يستحق البناء منها. |

Two things to decide, both of which need the owner rather than a translator:

- **The Arabic name.** `مختبرات الإطلاق` reads as "Launch Labs" and is clean
  Arabic. The alternative is to keep *Launchpad Labs* in Latin script on the
  Arabic page, the way many Saudi organisations keep a programme's brand name
  untranslated. That is a branding decision, not a translation one.
- **The English body** describes the format as we understand it — members bring
  the highest-value unsolved problems, defend them, and start building the ones
  that survive. It deliberately promises no cadence, no cohort size and no
  outcomes, because none of those are decided yet. Tighten it once they are.
