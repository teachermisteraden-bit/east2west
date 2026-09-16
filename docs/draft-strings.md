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

## Still to request

These are needed for the five form modes in Phase 3. Two can be sourced from
copy the owner has already approved; one genuinely needs new wording.

| Need | Proposal |
|---|---|
| University `interest` options (campus chapter / training / hiring event / challenge cycle) | Re-key from the approved `universities.bring` entries, which already name all four in both languages. No new wording |
| Sponsorship `options` (six) | Re-key from the approved `sponsors.options` array, which names all six in both languages. No new wording |
| Chapter `coDirector` (yes / no / not yet) | Genuinely new. Will be drafted and flagged here |
