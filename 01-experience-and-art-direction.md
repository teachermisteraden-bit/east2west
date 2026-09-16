# 01 — Experience and art direction
## "The Crossing at First Light"

## 1. The feeling

A visitor should feel **received, not sold to**. Picture being welcomed into a fine house in Madinah at dawn: quiet, unhurried, beautifully made, and warm. The luxury here is **restraint and care**, not gold everywhere.

**Three words:** noble, generous, precise.

| Noble means | It does not mean |
|---|---|
| Space, slowness, restraint | Emptiness or vagueness |
| Craft in small details | Ornament on everything |
| Quiet confidence | Arrogance or exclusivity for its own sake |
| Heritage expressed through geometry and light | Religious or royal symbols used as decoration |
| An invitation | A hard sell |

The society is inclusive (free places, women's circles, all nationalities). The noble register must **elevate** that inclusion, never contradict it. Membership is "by application" because members are genuinely vetted.

## 2. Provisional visual system

These values are superseded by `brand/` when it exists. Keep all of them as tokens.

### Colour

| Token | Value | Role |
|---|---|---|
| `--obsidian` | `#101315` | Pre-dawn sky, hero, footer |
| `--night` | `#1A2124` | Dark surfaces |
| `--palm` | `#1F5A45` | Primary brand green, primary buttons |
| `--palm-soft` | `#6FA58B` | Green on dark, links on dark |
| `--antique-gold` | `#B0873F` | Accent: hairlines, numerals, focus rings (never small text on ivory) |
| `--gold-light` | `#D9B878` | Gold on dark backgrounds |
| `--ivory` | `#F5F1E8` | Page background (light) |
| `--stone` | `#E6E0D3` | Cards, dividers |
| `--ink` | `#16191A` | Body text on ivory |
| `--ink-muted` | `#5B605C` | Secondary text |
| `--dawn` | `#E9C9A0` | The light itself (hero gradient only) |

**Proportion:** about 70% ivory or obsidian, 20% ink or text, 8% palm, 2% gold. Keep gold rare so it stays precious.

### Typography

| Role | Latin | Arabic |
|---|---|---|
| Display (hero, section titles) | Bodoni Moda (high-contrast serif), 400–500, tight tracking | Amiri (classical naskh), 400–700 |
| Labels, eyebrows | IBM Plex Sans, 500, UPPERCASE, +0.18em tracking, small | IBM Plex Sans Arabic, 500 (no uppercase; use weight and size instead) |
| Body | IBM Plex Sans, 400 | IBM Plex Sans Arabic, 400 |

**Rules:**
- Display sizes are large (hero up to `clamp(48px, 8vw, 128px)`), with generous leading for Arabic (1.35+ for display, 1.8 for body).
- Numerals in the journey, steps and flywheel use the display serif in antique gold.
- Never fake-bold Arabic. Load real weights.
- Do not justify Arabic text. Use `text-wrap: pretty` for headings.

### Space and grid

- 12-column grid, max content width 1320 px, text measure 60–68 characters.
- Section padding: `clamp(96px, 14vh, 200px)` vertical on desktop, 72 px on mobile.
- Hairline rules: 1 px in `--stone` on light, `rgba(217,184,120,.25)` on dark.

### Craft details (these make it feel expensive)

- **Hairline frames:** thin frames around invitation cards with an inner 6 px offset line, like fine stationery.
- **Section markers:** eyebrow labels such as "I — The Two Shores", with the numeral in the Latin serif and an Arabic ordinal (أولًا، ثانيًا، ثالثًا...) in the Arabic version.
- **Link hover:** a gold hairline underline that draws from the reading-start edge.
- **Buttons:** rectangular with 2 px radius and generous padding. The primary button is palm with ivory text. On hover, a slow (400 ms) gold hairline traces the border.
- **Cursor (desktop, fine pointer only):** a small gold ring that softly enlarges over interactive elements. Disabled under reduced motion or coarse pointers. Never hide the system cursor.
- **Focus ring:** 2 px antique gold with a 3 px offset, always visible for keyboard users.
- **Texture:** optional subtle paper grain on ivory surfaces (a tiny tiling PNG, under 1% opacity effect, no performance cost).
- **Geometric pattern:** an eight-fold lattice drawn as a single SVG `<pattern>`, used at very low contrast. It is the mashrabiya the light passes through.
- **Loading:** no spinners on page load. Show content immediately. Form submits show a thin gold progress thread.
- **404 page:** "This path hasn't been built yet." / "هذا الطريق لم يُعبَّد بعد." with a link home.

## 3. Motion language

| Token | Value |
|---|---|
| `--ease-noble` | `cubic-bezier(0.19, 1, 0.22, 1)` (long, graceful settle) |
| `--ease-standard` | `cubic-bezier(0.22, 1, 0.36, 1)` |
| `--dur-hover` | 400ms |
| `--dur-reveal` | 900ms |
| `--dur-page` | 700ms |
| `--stagger` | 90ms |
| Rise distance | 20px max |

**Principles:**
- Motion is **slow and certain**, like fabric settling or light moving across stone. Nothing bounces, spins or shakes.
- Reveal text line by line (mask reveal) only on display headings, never on body text.
- Scroll is always native. Use CSS `animation-timeline: view()` and `scroll()` where supported, with an IntersectionObserver fallback.
- **Sticky scenes:** at most two on the whole site, each no taller than 200vh, never on screens under 1024 px wide, and always passable with a normal scroll. Research by Nielsen Norman Group found that most participants were at least mildly disoriented by altered scrolling, and that task-focused visitors tolerate it least.
- **Page transitions:** a View Transitions API cross-fade with a slight ivory "veil". The four doors open into their pages with a vertical split reveal.
- **Reduced motion:** everything appears in its final state, with no parallax and no cursor effect.

## 4. The home page scroll story

Each scene has one job. Its copy lives in `messages/*.json` under `home.*`.

### Scene 0 — Pre-dawn (hero)
- **Visual:** obsidian sky with a faint lattice pattern. A thin horizon line in gold. The brand wordmark sits centred.
- **Motion:** over 1.6 s, dawn light (a radial gradient in `--dawn`) rises from the **eastern edge** (the right side in both languages, because the sun rises in the east on a north-up map). It passes through the lattice and casts soft geometric light onto the headline.
- **Copy:** eyebrow "Founded in Madinah · Serving all of Saudi Arabia". Headline "Where graduates and businesses build the future together." One primary CTA, "Find your door", which scrolls smoothly to scene 8 with the native smooth-scroll setting, respecting reduced motion. A quiet secondary text link: "Apply for membership".
- **Scroll cue:** a thin vertical gold line that slowly grows. No bouncing arrow.
- **Enhancement:** optional WebGL volumetric light (see the master prompt conditions). The static version must be beautiful on its own.

### Scene 1 — The two shores
- **Visual:** two halves. The East shore holds graduates, the West shore holds businesses. Each has three short benefit lines.
- **Motion:** as the visitor scrolls, a single gold thread draws across the divide and joins them.
- **Psychology:** each audience sees itself (self-reference effect) and sees that the other side needs it (mutual value).

### Scene 2 — Three pillars
- **Visual:** Cooperation, Innovation and Integration as three tall panels with roman numerals and bilingual titles.
- **Motion:** the panels rise in sequence with a stagger.

### Scene 3 — The flywheel (sticky scene 1 of 2, desktop only)
- **Visual:** a circle with four nodes (more vetted graduates → more businesses join → more jobs, contracts and deals → more sponsorship and reputation), with "trust + data" at the centre.
- **Motion:** the active node follows scroll progress while the light travels around the ring. On mobile and under reduced motion, it becomes a static diagram with all nodes visible.
- **Accessibility:** a visually hidden ordered list describes the cycle.

### Scene 4 — The nine programmes
- **Visual:** a 3×3 grid of ivory cards with hairline frames and programme icons, grouped by the journey stage (Learn, Connect, Build, Earn).
- **Interaction:** hover or focus lifts a card 4 px and reveals its one-line description. On touch devices, descriptions are always visible.

### Scene 5 — The six-week challenge (sticky scene 2 of 2, desktop only)
- **Visual:** four stations along a horizontal path (a business brings a challenge → mixed teams research it → build and test → pitch and adopt), with week markers.
- **Motion:** stations light up as the page scrolls. On mobile, it becomes a vertical timeline.

### Scene 6 — The member journey
- **Visual:** Join, Learn, Connect, Build, Earn, Lead along a gold thread.
- **Motion:** the thread fills as you read. The last node, Lead, glows softly. This uses the goal-gradient effect: people accelerate as a goal feels closer.

### Scene 7 — Across the Kingdom
- **Visual:** a minimal, accurate outline of Saudi Arabia (from an open-licensed source, credited, with no neighbouring labels), Madinah marked as the founding city, and Jeddah and Riyadh as "next chapters". Faint arcs extend beyond the border to the east and west for future alumni chapters.
- **Motion:** Madinah glows once; the lines extend slowly.

### Scene 8 — The four doors
- **Visual:** four invitation cards (Graduates, Universities, Sponsors, Businesses). Each has one line of outcome, one CTA and a hairline double frame.
- **Interaction:** on hover or focus, the card's inner frame opens slightly like a door. Clicking triggers the door-opening page transition.
- **Psychology:** self-selection (visitors choose their own path) and a limited set of choices (Hick's law).

### Scene 9 — The closing
- **Visual:** obsidian with dusk light setting on the **western edge**, closing the sun's path.
- **Copy:** the promise, "Meet the right people. Build real things. Get hired, get clients, or get funded.", a CTA "Join the founding community", the founding line, contact and language switch.
- **Psychology:** a strong last moment (the peak-end rule: people judge an experience largely by its peak and its end).

## 5. Audience pages

Each audience page uses the same noble frame with a different accent moment:

| Page | Hero image concept (illustration or pattern only until real photos exist) | Signature moment |
|---|---|---|
| Graduates | A single lit doorway in the lattice | The journey thread with a "Your first step" marker |
| Universities | Light falling across the rows of a lecture hall, drawn in line art | A four-step partnership timeline |
| Sponsors | A ledger-like layout with gold hairlines | Six sponsorship options as fine stationery cards, plus a sample impact report layout with every figure marked "illustrative" |
| Businesses | A long table drawn in line art with one empty seat highlighted | "Take your seat" with one seat per industry (a live count appears only when the flag and real data exist) |

## 6. Photography and illustration (for later)

- **Photos:** real society moments only, with consent; natural light; modest dress; mixed nationalities; women's circles shown through hands, notebooks and spaces, or with explicit consent. Warm grading toward ivory and dawn.
- **Illustration:** fine line art in ink or gold on ivory, architectural and geometric, never cartoonish.
- **Avoid:** stock handshakes, lightbulbs, globes, graduation caps, and anything that suggests an official, government or royal link.

## 7. Arabic-specific craft

- Mirror the layout, but keep the sun's path geographically true: dawn rises on the right, dusk sets on the left, in both languages.
- Use Arabic ordinals and the Arabic comma (،). Keep Western digits by default (config switch available).
- Give Arabic headings about 10% more line-height and slightly smaller sizes than their English equivalents.
- Arabic eyebrow labels use weight, not letter-spacing. Never letter-space Arabic.
- Test ligatures and kashida handling at every breakpoint.
