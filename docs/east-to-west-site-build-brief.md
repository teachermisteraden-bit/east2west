> Text twin of east-to-west-site-build-brief.pdf. Use this file as the source for exact English and Arabic copy.

EAST TO WEST

DEVELOPMENT SOCIETY

جمعية الشرق إلى الغرب للتنمية

# Website build brief

An immersive, bilingual (English and Arabic) website. Written for Claude
Code.

|         |                                   |
|---------|-----------------------------------|
| Owner   | Muhsin Aden, founding coordinator |
| Version | 1.0, September 2026               |
| Status  | Ready to build                    |

Founded in Madinah, serving all of Saudi Arabia

تأسست في المدينة المنورة،
وتخدم جميع أنحاء المملكة

## 0. How to use this brief

This document is the single source of truth for the build. It defines
the experience, pages, brand, copy, forms, stack and acceptance
criteria. Read it end to end before starting.

**Hard rules for the builder**

- Use only the copy in section 6. Do not invent statistics, partner
  names, testimonials, licences, prices or contact details.
- The society is in its founding stage. Never describe it as registered,
  licensed or government-endorsed.
- Every page exists in English and Arabic, with full right-to-left
  layout for Arabic.
- Every animation has a reduced-motion fallback that shows the final
  state.
- Build in the phases in section 11 and stop for review at the end of
  each phase.

A ready-to-paste starter prompt is in section 13.

## 1. Project summary

**East to West Development Society** is a professional community founded
in Madinah and serving all of Saudi Arabia. It connects Saudi graduates
and international Muslim graduates with each other and with businesses,
so that networking turns into skills, jobs, contracts and startups. It
is two-sided: graduates on one side, businesses (B2B) on the other, with
universities as hosts and partners.

**Site purpose:** make the vision feel real and ambitious, and convert
four audiences into applications and enquiries.

| Audience                                  | Primary goal on the site                   | Conversion                              |
|-------------------------------------------|--------------------------------------------|-----------------------------------------|
| Graduates (Saudi and international)       | Understand benefits, see the journey, join | Membership application                  |
| Universities and colleges                 | See what a campus chapter brings, host one | Partnership enquiry                     |
| Business sponsors                         | See options and impact reporting           | Sponsorship enquiry                     |
| Businesses (networking, speaking, hiring) | Take a seat, speak, hire                   | Collaboration enquiry                   |
| Everyone                                  | Follow the founding journey                | Newsletter / WhatsApp community sign-up |

## 2. Experience concept: "The Bridge"

The whole site is a crossing. The brand mark is a bridge arch built from
13 blocks: green blocks for the East, gold blocks for the West, meeting
at a pale keystone. The home page is a scroll story in which that bridge
is built, crossed and then opened to four audiences. Motion should feel
calm, weighty and precise, like stone being set, never bouncy or
playful.

### Design principles

- **Built, not decorated.** Motion always means something: blocks
  assembling, paths connecting, cycles turning.
- **Two shores, one bridge.** Visual pairs (graduates and businesses,
  East and West, English and Arabic) recur throughout.
- **Quiet confidence.** Generous space, few colours, strong type. No
  stock-photo clichés.
- **Content first on small screens.** Most visitors will be on phones,
  many via WhatsApp links.

## 3. Home page scroll story

| Scene                   | What the visitor sees                                                                                                                                 | Interaction and motion                                                                                                                                          | Reduced motion                     |
|-------------------------|-------------------------------------------------------------------------------------------------------------------------------------------------------|-----------------------------------------------------------------------------------------------------------------------------------------------------------------|------------------------------------|
| 1\. The keystone (hero) | Dark basalt screen. Arch assembles, title and tagline appear. Scroll cue.                                                                             | Blocks rise one by one alternating from both ends inward (0,12,1,11 ...); keystone drops last with a soft settle. Total ≤ 1.8 s. Title fades up after keystone. | Arch and title shown complete.     |
| 2\. Two shores          | Split screen: Graduates (left, green) and Businesses (right, gold). Short benefit lines on each side.                                                 | On scroll, a thin gold line draws across the centre joining the two sides.                                                                                      | Line shown complete.               |
| 3\. Three pillars       | Cooperation, Innovation, Integration with bilingual titles.                                                                                           | Pillars rise in sequence as the section enters.                                                                                                                 | Static.                            |
| 4\. The flywheel        | Cycle: More vetted graduates → More businesses join → More jobs, contracts, deals → More sponsorship, reputation. Centre: East to West, trust + data. | Scroll-linked rotation of an arrow ring; active node highlights in turn. Nodes are readable text, not images.                                                   | Static diagram, all nodes visible. |
| 5\. What we offer       | Nine programme tiles.                                                                                                                                 | Tiles reveal in a stagger; tap/hover shows the one-line description.                                                                                            | All descriptions visible.          |
| 6\. Six-week challenge  | Four steps of the challenge cycle.                                                                                                                    | Section pins on desktop (≥1024 px) and scrolls horizontally through the four steps; on mobile, a vertical stepper.                                              | Vertical stepper.                  |
| 7\. Member journey      | Join, Learn, Connect, Build, Earn, Lead.                                                                                                              | A path fills as the visitor scrolls, lighting each step.                                                                                                        | Path shown full.                   |
| 8\. Across the Kingdom  | Simplified map of Saudi Arabia. Madinah marked as founding city; Jeddah and Riyadh shown as 'next chapters'.                                          | Madinah pulses once; lines extend to next chapters; subtle arcs extend east and west beyond the border to suggest alumni abroad.                                | Static map.                        |
| 9\. Four doors          | Four large cards: Graduates, Universities, Sponsors, Businesses, each with its CTA.                                                                   | Cards lift slightly on hover/focus.                                                                                                                             | No lift.                           |
| 10\. Footer             | Name in both languages, 'Founded in Madinah, serving all of Saudi Arabia', links, contact, language switch.                                           | None.                                                                                                                                                           | None.                              |

Map: use a simplified, accurate outline of Saudi Arabia from an
open-licensed source (for example Natural Earth) and credit it. Do not
draw disputed borders or neighbouring country labels. City dots only; no
pins with invented data.

## 4. Sitemap and page specifications

Routes exist under `/en` and `/ar`. The root `/` redirects by browser
language (Arabic → `/ar`, otherwise `/en`). The language switch keeps
the visitor on the equivalent page.

| Route         | Page             | Key sections                                                                                                                                          |
|---------------|------------------|-------------------------------------------------------------------------------------------------------------------------------------------------------|
| /             | Home             | The scroll story in section 3                                                                                                                         |
| /about        | About            | Vision, mission, promise, values, how the two-sided model works, founding stage note, founder note (placeholder)                                      |
| /programmes   | Programmes       | Nine programmes with descriptions, grouped: Learn, Connect, Build, Earn. Six-week challenge explained                                                 |
| /graduates    | For graduates    | Hero, member benefits, member journey, who can join, good to know, apply CTA                                                                          |
| /universities | For universities | Hero, what we bring, what we ask, what the university gains, partnership steps, enquiry CTA                                                           |
| /sponsors     | For sponsors     | Hero, why sponsor, six options, what every sponsor receives, impact reporting, enquiry CTA                                                            |
| /businesses   | For businesses   | Hero, three ways (networking, keynote speaking, hiring), bring us a challenge, who should join, what you gain, steps, enquiry CTA                     |
| /events       | Events           | Upcoming list (weekly gatherings, keynotes, hiring events, summit). Must handle an empty state gracefully: 'First events announced soon' plus sign-up |
| /chapters     | Chapters         | Madinah (founding), next chapters, campus chapters, how a chapter launches                                                                            |
| /join         | Join and enquire | Tabbed or step form: Graduate, University, Sponsor, Business. Deep-linkable: /join?type=university                                                    |
| /contact      | Contact          | Contact details (placeholders), general form                                                                                                          |
| /privacy      | Privacy          | What data forms collect, why, how long, how to request deletion                                                                                       |
| /404          | Not found        | On-brand, links home                                                                                                                                  |

## 5. Brand system

### Colour tokens

**basalt-900**\#23292A

**palm-700**\#2E6B52

**palm-500**\#3C8264

**frond-300**\#8DB39A

**date-700**\#B97F34

**date-500**\#D09A4C

**sage-100**\#EEF1EC

**ink-900**\#1C2320

The palette comes from Madinah itself: palm groves, dates and the dark
basalt lava fields around the city. Gold is an accent only; never set
long text in gold on light backgrounds (fails contrast).

    /* src/styles/tokens.css */
    :root {
      --basalt-900: #23292A;   /* hero / dark bands (Madinah's volcanic basalt) */
      --palm-700:   #2E6B52;   /* primary brand green */
      --palm-500:   #3C8264;
      --frond-300:  #8DB39A;   /* muted green text on dark */
      --date-700:   #B97F34;   /* accent gold */
      --date-500:   #D09A4C;
      --sage-100:   #EEF1EC;   /* page background, keystone */
      --paper:      #F7F9F6;
      --ink-900:    #1C2320;   /* body text */
      --ink-600:    #56625C;   /* secondary text */
      --line:       #C9D3CC;
    }
    :root[data-theme="dark"] {
      --paper: #171C1C; --sage-100: #1F2626; --ink-900: #E4EAE5; --ink-600: #A3B0A8;
      --line: #34403B; --palm-700: #6FAE8C; --date-700: #D8A55C; --basalt-900: #101414;
    }
    @media (prefers-color-scheme: dark) { :root:not([data-theme="light"]) { /* same as dark */ } }

### Typography

| Role                                              | Font                                                 | Notes                                                                          |
|---------------------------------------------------|------------------------------------------------------|--------------------------------------------------------------------------------|
| Display (English and Arabic headings, brand name) | Reem Kufi (Google Fonts), weights 500–700            | Geometric Kufi; carries both scripts                                           |
| Body (English and Arabic)                         | IBM Plex Sans Arabic (Google Fonts), 400/500/600/700 | Includes Latin glyphs, so one family serves both languages                     |
| Arabic long headings                              | IBM Plex Sans Arabic 700                             | Reem Kufi at small sizes loses legibility; use it for short Arabic titles only |

Arabic body line-height 1.7 or more; English 1.55. Minimum body size 16
px. Self-host fonts with `next/font` and `display: swap`.

### The arch

The arch is the logo and the hero. Build it as inline SVG from the
geometry below so it can be animated block by block. The name sits
inside the arch: "EAST TO WEST" (Reem Kufi, gold, tracked), "DEVELOPMENT
SOCIETY" (small caps, frond green, wide tracking), and the Arabic name
beneath.

    // src/components/brand/archGeometry.ts
    // Generates the East to West bridge arch: 13 voussoir blocks.
    // Blocks 0-5 = palm greens (East), block 6 = keystone (sage), blocks 7-12 = date golds (West).
    export type Block = { d: string; fill: string; index: number };
    export function archBlocks({ cx = 500, cy = 390, r1 = 300, r2 = 370, n = 13, gap = 0.012 } = {}): Block[] {
      const p = (r: number, a: number) => [cx + r * Math.cos(a), cy - r * Math.sin(a)];
      const out: Block[] = [];
      for (let i = 0; i < n; i++) {
        const a0 = Math.PI - (i * Math.PI) / n + gap;
        const a1 = Math.PI - ((i + 1) * Math.PI) / n - gap;
        const [x1, y1] = p(r1, a0), [x2, y2] = p(r2, a0), [x3, y3] = p(r2, a1), [x4, y4] = p(r1, a1);
        const mid = Math.floor(n / 2);
        const fill = i < mid ? (i % 2 ? "var(--palm-700)" : "var(--palm-500)")
                   : i > mid ? (i % 2 ? "var(--date-700)" : "var(--date-500)")
                   : "var(--sage-100)";
        out.push({ index: i, fill,
          d: `M${x1},${y1} L${x2},${y2} A${r2},${r2} 0 0 1 ${x3},${y3} L${x4},${y4} A${r1},${r1} 0 0 0 ${x1},${y1}Z` });
      }
      return out;
    }
    // Render inside <svg viewBox="0 0 1000 400">. Do NOT mirror the arch in RTL:
    // green is always on the left (East) and gold on the right (West).

### Other visual rules

- A thin gold horizontal line (the "road") sits under the arch.
- Section headings are paired: English on the start side, Arabic on the
  end side, on bilingual cards and bands.
- Numbered circles (green, last one gold) for sequences; dashed
  connector lines between them.
- Imagery: none required at launch. If photos are added later, use real
  society events with consent. Avoid clichéd stock handshakes and avoid
  images of the Prophet's Mosque as decoration.
- Favicon and app icon: the arch alone, simplified to 7 blocks at small
  sizes.

### Voice

Warm, confident, practical. Short sentences. Benefits before features.
Never hype, never religious sermonising; values are expressed through
the four words: cooperation, trust, excellence, benefit.

## 6. Approved copy

Use this copy verbatim. Arabic is provided for every string; do not
machine-translate.

### Global

| English                                                                                                                              | Arabic                                                                                            |
|--------------------------------------------------------------------------------------------------------------------------------------|---------------------------------------------------------------------------------------------------|
| East to West Development Society                                                                                                     | جمعية الشرق إلى الغرب للتنمية                                                                     |
| Founded in Madinah, serving all of Saudi Arabia                                                                                      | تأسست في المدينة المنورة، وتخدم جميع أنحاء المملكة                                                |
| Where graduates and businesses build the future together.                                                                            | حيث يبني الخريجون والمنشآت المستقبل معًا.                                                          |
| A professional community connecting Saudi and international Muslim graduates with each other and with businesses across the Kingdom. | مجتمع مهني يربط الخريجين السعوديين والخريجين المسلمين الدوليين ببعضهم وبالمنشآت في أنحاء المملكة. |
| Join the founding community                                                                                                          | انضموا إلى المجتمع المؤسِّس                                                                         |
| Contact: Muhsin Aden, founding coordinator                                                                                           | للتواصل: محسن آدن، المنسّق المؤسِّس                                                                  |

### Vision, mission, promise

| English                                                                                                                                                                             | Arabic                                                                                                                        |
|-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|-------------------------------------------------------------------------------------------------------------------------------|
| Vision: Every graduate in the Kingdom, Saudi or international, turns what they know into livelihoods, ventures and shared benefit.                                                  | الرؤية: أن يتحوّل علم كل خريج في المملكة، سعوديًا كان أو دوليًا، إلى رزقٍ ومشاريع ونفعٍ مشترك.                                     |
| Mission: Connect graduates with each other and with businesses through weekly gatherings, practical training and real work, so that trust turns into jobs, contracts and companies. | الرسالة: نربط الخريجين ببعضهم وبالمنشآت من خلال لقاءات أسبوعية وتدريب عملي وعمل حقيقي، ليتحوّل التعارف إلى وظائف وعقود وشركات. |
| Meet the right people. Build real things. Get hired, get clients, or get funded.                                                                                                    | تعرّف على الأشخاص المناسبين. ابنِ مشاريع حقيقية. احصل على وظيفة أو عملاء أو تمويل.                                              |

### Values

| English                                                                | Arabic                                                   |
|------------------------------------------------------------------------|----------------------------------------------------------|
| Cooperation: Members give first; business follows.                     | التعاون: يبادر الأعضاء بالعطاء، ثم تأتي الأعمال.         |
| Trust: Members are vetted, commitments are kept, referrals are honest. | الأمانة: أعضاء موثوقون، والتزامات محفوظة، وإحالات صادقة. |
| Excellence: Fewer things, done well.                                   | الإتقان: أعمال أقل، مُتقنة أكثر.                          |
| Benefit: Every activity creates a skill, a contact, a job or a deal.   | النفع: كل نشاط يثمر مهارة أو علاقة أو وظيفة أو صفقة.     |

### Three pillars

| English                                                                             | Arabic                                                                 |
|-------------------------------------------------------------------------------------|------------------------------------------------------------------------|
| Cooperation: Mixed teams of Saudi and international graduates working side by side. | التعاون: فرق مشتركة من الخريجين السعوديين والدوليين تعمل جنبًا إلى جنب. |
| Innovation: Real business challenges turned into tested solutions and new ventures. | الابتكار: تحويل تحديات الأعمال الحقيقية إلى حلول مجرَّبة ومشاريع ناشئة.  |
| Integration: One professional community connecting talent with the Saudi market.    | التكامل: مجتمع مهني واحد يربط المواهب بسوق العمل السعودي.              |

### Nine programmes

| English                        | Description                                           | Arabic                         | الوصف                                                 |
|--------------------------------|-------------------------------------------------------|--------------------------------|-------------------------------------------------------|
| Business English training      | Meetings, emails, presentations and negotiation       | التدريب على الإنجليزية للأعمال | الاجتماعات والمراسلات والعروض والتفاوض                |
| Workplace Arabic               | For international graduates entering Saudi workplaces | العربية لبيئة العمل            | للخريجين الدوليين في بيئة العمل السعودية              |
| Financial literacy workshops   | Budgeting, saving and Islamic finance basics          | ورش الثقافة المالية            | الميزانية والادخار وأساسيات التمويل الإسلامي          |
| Weekly networking and keynotes | Guest speakers from business and government           | لقاءات تواصل أسبوعية ومحاضرات  | متحدثون من قطاعي الأعمال والحكومة                     |
| Mentorship                     | Graduates paired with experienced professionals       | الإرشاد المهني                 | ربط الخريجين بمهنيين ذوي خبرة                         |
| Career readiness               | CV reviews, interview practice and LinkedIn profiles  | الجاهزية المهنية               | مراجعة السيرة الذاتية والتدرّب على المقابلات           |
| Startup clinic                 | Idea validation, pitch coaching and funding routes    | عيادة الشركات الناشئة          | اختبار الفكرة والتدريب على العرض ومصادر التمويل       |
| Talent directory               | Vetted graduates that businesses can hire or contract | دليل المواهب                   | خريجون موثوقون يمكن للمنشآت توظيفهم أو التعاقد معهم   |
| Hiring events                  | Employers meet and interview graduates on the spot    | فعاليات التوظيف                | لقاءات تجمع المنشآت بالخريجين لإجراء المقابلات مباشرة |

### Six-week challenge cycle

| English                                       | Arabic                                  |
|-----------------------------------------------|-----------------------------------------|
| A business brings a real challenge            | تطرح منشأة تحديًا حقيقيًا                 |
| Mixed teams form and research it              | تتشكّل فرق مشتركة وتدرسه                 |
| Teams build and test a solution               | تبني الفرق حلًا وتختبره                  |
| Teams pitch, and the business adopts the best | تعرض الفرق حلولها وتتبنّى المنشأة الأفضل |

### Member journey

| English                               | Arabic                            |
|---------------------------------------|-----------------------------------|
| Join: Apply and build your profile    | انضم: قدّم وأنشئ ملفك              |
| Learn: Take the training you need     | تعلّم: احصل على التدريب المناسب    |
| Connect: Attend events, meet a mentor | تواصل: احضر الفعاليات والتقِ مرشدك |
| Build: Join a challenge team          | ابنِ: انضم إلى فريق تحدٍّ            |
| Earn: Get hired or win clients        | اكسب: احصل على وظيفة أو عملاء     |
| Lead: Mentor others, run a circle     | قُد: أرشد غيرك وقُد حلقة            |

### Graduates page

| English                                                                                                                     | Arabic                                                                                                     |
|-----------------------------------------------------------------------------------------------------------------------------|------------------------------------------------------------------------------------------------------------|
| Your degree is the start. Your network is the next step.                                                                    | شهادتك هي البداية، وشبكة علاقاتك هي الخطوة التالية.                                                        |
| Join a community of Saudi and international graduates who learn, build and grow together.                                   | انضم إلى مجتمع من الخريجين السعوديين والدوليين يتعلّمون ويبنون وينمون معًا.                                  |
| Weekly networking: Meet graduates and professionals from across the Kingdom.                                                | تواصل أسبوعي: تعرّف على خريجين ومهنيين من أنحاء المملكة.                                                    |
| Practical training: Business English, Workplace Arabic and financial literacy.                                              | تدريب عملي: الإنجليزية للأعمال والعربية لبيئة العمل والثقافة المالية.                                      |
| A personal mentor: Guidance from an experienced professional.                                                               | مرشد مهني: توجيه من مهني صاحب خبرة.                                                                        |
| Real projects: Solve business challenges and build your portfolio.                                                          | مشاريع حقيقية: حل تحديات الأعمال وبناء ملف إنجازاتك.                                                       |
| Jobs and clients: Hiring events and a place in our talent directory.                                                        | وظائف وعملاء: فعاليات توظيف ومكان في دليل المواهب.                                                         |
| Startup support: Test your idea, practise your pitch, find funding routes.                                                  | دعم الشركات الناشئة: اختبر فكرتك وتدرّب على العرض وتعرّف على مصادر التمويل.                                  |
| Who can join: Saudi graduates; international Muslim graduates in the Kingdom; final-year university students.               | من يمكنه الانضمام: الخريجون السعوديون؛ الخريجون المسلمون الدوليون في المملكة؛ طلاب السنة الجامعية الأخيرة. |
| Good to know: Free places for students and job seekers; women's circles led by women; levels that reward your contribution. | معلومات مهمة: مقاعد مجانية للطلاب والباحثين عن عمل؛ حلقات نسائية بقيادة نسائية؛ مستويات تقدّر إسهامك.       |
| Apply to become a founding member                                                                                           | قدّم طلب العضوية التأسيسية                                                                                  |

### Universities page

| English                                                                                                                                         | Arabic                                                                                                                                 |
|-------------------------------------------------------------------------------------------------------------------------------------------------|----------------------------------------------------------------------------------------------------------------------------------------|
| Give your students a direct path from campus to career.                                                                                         | امنحوا طلابكم طريقًا مباشرًا من الجامعة إلى سوق العمل.                                                                                   |
| Host an East to West chapter and connect your students with training, mentors and employers, at no cost to your university.                     | استضيفوا فرعًا لجمعية الشرق إلى الغرب، واربطوا طلابكم بالتدريب والمرشدين وجهات التوظيف دون أي تكلفة على الجامعة.                        |
| What we bring: student-led chapter; skills training; career readiness; real business challenges; mentors and speakers; hiring events on campus. | ما نقدّمه: فرع جامعي بقيادة الطلاب؛ تدريب على المهارات؛ الجاهزية المهنية؛ تحديات أعمال حقيقية؛ مرشدون ومتحدثون؛ فعاليات توظيف في الحرم. |
| What we ask: a regular meeting space; a career-centre or faculty liaison; promotion to your students; co-branding on campus events.             | ما نطلبه: قاعة للقاءات الدورية؛ منسّق من مركز التوجيه أو الكلية؛ التعريف بالجمعية لدى الطلاب؛ مشاركة الشعار في الفعاليات الجامعية.      |
| Your university gains: stronger graduate employment; new industry partnerships; engaged students across nationalities; outcomes you can report. | مكاسب الجامعة: فرص توظيف أفضل للخريجين؛ شراكات جديدة مع القطاع الخاص؛ طلاب متفاعلون من جنسيات متعددة؛ نتائج قابلة للقياس والتقرير.     |
| Steps: Meet, Agree, Launch, Report.                                                                                                             | الخطوات: لقاء، اتفاق، إطلاق، تقرير.                                                                                                    |
| Host a campus chapter                                                                                                                           | استضيفوا فرعًا جامعيًا                                                                                                                   |

### Sponsors page

| English                                                                                                                                | Arabic                                                                                                                       |
|----------------------------------------------------------------------------------------------------------------------------------------|------------------------------------------------------------------------------------------------------------------------------|
| Invest in the Kingdom's next generation of talent.                                                                                     | استثمروا في الجيل القادم من الكفاءات في المملكة.                                                                             |
| Sponsor programmes that turn graduates into employees, entrepreneurs and partners, and see the results.                                | ارعوا برامج تحوّل الخريجين إلى موظفين وروّاد أعمال وشركاء، وتابعوا نتائجها.                                                    |
| Why sponsor: first access to talent; brand visibility; national impact (youth and women's employment); measured results.               | لماذا ترعون الجمعية: الوصول المبكر للكفاءات؛ حضور للعلامة التجارية؛ أثر وطني (توظيف الشباب والمرأة)؛ نتائج قابلة للقياس.     |
| Options: programme sponsor; hiring event sponsor; chapter patron; scholarship sponsor; keynote series sponsor; summit partner.         | فرص الرعاية: راعي برنامج؛ راعي فعالية توظيف؛ راعي فرع؛ راعي المنح؛ راعي سلسلة المحاضرات؛ شريك الملتقى.                       |
| Every sponsor receives: logo on events and materials; a speaking opportunity; access to the talent directory; a written impact report. | يحصل كل راعٍ على: الشعار في الفعاليات والمواد؛ فرصة للتحدث؛ الوصول إلى دليل المواهب؛ تقرير أثر مكتوب.                         |
| What we report back: graduates trained, jobs and contracts created, challenges solved and event reach, every quarter.                  | ما نرفعه لكم من نتائج: عدد الخريجين المدرَّبين، والوظائف والعقود المحققة، والتحديات المحلولة، ومدى وصول الفعاليات، كل ربع سنة. |
| Become a founding sponsor                                                                                                              | كونوا من الرعاة المؤسسين                                                                                                     |

### Businesses page

| English                                                                                                                                                 | Arabic                                                                                                                                     |
|---------------------------------------------------------------------------------------------------------------------------------------------------------|--------------------------------------------------------------------------------------------------------------------------------------------|
| Meet talent. Share your expertise. Grow your business.                                                                                                  | تعرّفوا على الكفاءات، وشاركوا خبرتكم، وطوّروا أعمالكم.                                                                                       |
| Networking: weekly Business Circle meetings; one seat per industry; referrals from member businesses.                                                   | التواصل: لقاءات أسبوعية لدائرة الأعمال؛ مقعد واحد لكل قطاع؛ إحالات من المنشآت الأعضاء.                                                     |
| Keynote speaking: share your expertise on stage; inspire graduates and peers; position your brand as a leader.                                          | المحاضرات الرئيسية: شارك خبرتك على المنصة؛ ألهم الخريجين والزملاء؛ عزّز مكانة علامتك التجارية.                                              |
| Hiring: hiring events and on-the-spot interviews; access to the talent directory; challenge cycles as extended interviews.                              | التوظيف: فعاليات توظيف ومقابلات مباشرة؛ الوصول إلى دليل المواهب؛ دورات التحدي كمقابلات عملية ممتدة.                                        |
| Bring us a real challenge: Mixed graduate teams work on your problem for six weeks and present tested solutions. You meet future hires while they work. | اطرحوا علينا تحديًا حقيقيًا: تعمل فرق مشتركة من الخريجين على مشكلتكم لستة أسابيع وتعرض حلولًا مجرّبة، وتتعرفون خلالها على موظفيكم المستقبليين. |
| Take your seat at the table. Seats in each industry are limited.                                                                                        | احجزوا مقعدكم. المقاعد في كل قطاع محدودة.                                                                                                  |

## 7. Forms

One form component with four modes. All labels, hints and errors exist
in both languages. Required fields are marked. Include a hidden honeypot
field and rate limiting. On success, show a bilingual confirmation and
send an acknowledgement email (template in both languages).

| Mode                   | Fields                                                                                                                                                                                                                                                                                                                                                                                                |
|------------------------|-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| Graduate membership    | Full name\*; email\*; mobile (Saudi format +966 validated, international allowed)\*; city\*; nationality\*; status\* (graduate / final-year student); university\*; field of study\*; graduation year\*; languages; interests (multi-select from the nine programmes)\*; preference for women's circle (optional, shown to all, never required); LinkedIn URL; 'How can you contribute?' (short text) |
| University partnership | Institution\*; contact name\*; role\*; email\*; phone\*; city\*; interest\* (campus chapter / training / hiring event / challenge cycle); preferred semester; message                                                                                                                                                                                                                                 |
| Sponsorship            | Company\*; contact name\*; role\*; email\*; phone\*; sector\*; options of interest\* (multi-select from six options); budget range (optional, 'prefer to discuss' default); message                                                                                                                                                                                                                   |
| Business collaboration | Company\*; contact name\*; role\*; email\*; phone\*; sector\*; roles\* (networking / keynote speaking / hiring / bring a challenge); hiring needs (if hiring); message                                                                                                                                                                                                                                |

**Consent (all modes):** a required checkbox: "I agree that East to West
Development Society may store and use these details to respond to my
enquiry, as described in the Privacy page." / أوافق على أن تحفظ جمعية
الشرق إلى الغرب للتنمية هذه البيانات وتستخدمها للرد على طلبي، وفق ما هو
موضح في صفحة الخصوصية. Collect only these fields. Comply with Saudi
Arabia's Personal Data Protection Law; the owner will confirm the
privacy wording with an adviser.

**Storage:** write submissions to a database table per mode (Supabase or
equivalent) and email a notification to the owner address from an
environment variable. Provide a CSV export script. No third-party
trackers on form pages.

## 8. Technical stack and architecture

| Concern              | Choice                                                                                                                                                                   |
|----------------------|--------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| Framework            | Next.js (App Router), TypeScript, React Server Components by default                                                                                                     |
| Styling              | Tailwind CSS with CSS variables from section 5; use logical properties (ms-, me-, ps-, pe-, start, end) so RTL mirrors automatically                                     |
| Internationalisation | next-intl; locales en and ar; `dir` and `lang` set on `<html>`; all strings in `/messages/en.json` and `/messages/ar.json`                                               |
| Motion               | Framer Motion (Motion) for component reveals; GSAP + ScrollTrigger only for pinned and scroll-linked scenes (scenes 4, 6, 7, 8). Load GSAP lazily on those sections only |
| Smooth scrolling     | Optional Lenis on desktop only; disabled for reduced motion and touch devices                                                                                            |
| Forms                | React Hook Form + Zod; server actions; Supabase (or equivalent) for storage; Resend (or equivalent) for email                                                            |
| Content              | Typed content files in `/content` (programmes, events, chapters) so a CMS can be added later without refactoring                                                         |
| Fonts                | next/font with Reem Kufi and IBM Plex Sans Arabic                                                                                                                        |
| Analytics            | Privacy-friendly, cookieless (for example Plausible), enabled via environment variable                                                                                   |
| Hosting              | Vercel; preview deployments per branch                                                                                                                                   |
| Quality              | ESLint, Prettier, Playwright end-to-end tests for both locales, Lighthouse CI                                                                                            |

### Suggested structure

    app/
      [locale]/
        layout.tsx            # sets lang/dir, fonts, header, footer
        page.tsx              # home scroll story
        about/ programmes/ graduates/ universities/ sponsors/ businesses/
        events/ chapters/ join/ contact/ privacy/
      api/ (if needed)
    components/
      brand/Arch.tsx, archGeometry.ts, Wordmark.tsx
      scenes/Hero.tsx, TwoShores.tsx, Pillars.tsx, Flywheel.tsx,
             Programmes.tsx, ChallengeCycle.tsx, Journey.tsx, KingdomMap.tsx, FourDoors.tsx
      ui/ BilingualHeading.tsx, Stepper.tsx, Card.tsx, Button.tsx, LanguageSwitch.tsx
      forms/ JoinForm.tsx (modes), schemas.ts
    content/ programmes.ts, events.ts, chapters.ts
    messages/ en.json, ar.json
    public/ og/ (poster images), favicon/
    styles/ tokens.css

### Brand tokens

Map the CSS variables into `tailwind.config` under `colors` (basalt,
palm, frond, date, sage, ink, line) so classes such as `bg-palm-700`
work.

## 9. Quality bar

| Area           | Requirement                                                                                                                                        |
|----------------|----------------------------------------------------------------------------------------------------------------------------------------------------|
| Performance    | Mobile Lighthouse ≥ 90 performance; LCP ≤ 2.5 s on 4G; initial JS ≤ 200 KB gzipped; arch SVG inline, no hero image                                 |
| Accessibility  | WCAG 2.2 AA; full keyboard use; visible focus rings (gold); animated diagrams have text equivalents; forms announce errors                         |
| Reduced motion | Every scene shows its final state; no pinning or horizontal scroll                                                                                 |
| RTL            | Arabic layout mirrored except the arch and the map; numbers in steps may use Western digits in both languages for consistency (owner to confirm)   |
| Responsive     | Designed at 360, 768, 1024, 1440 px; no horizontal page scroll; tables scroll inside their own container                                           |
| Dark mode      | Supported via tokens; respects system setting with a manual toggle                                                                                 |
| SEO            | Per-page bilingual titles and descriptions; hreflang alternates; sitemap.xml; robots.txt; Organization structured data without unverifiable claims |
| Sharing        | Open Graph images per page from the poster set in /public/og                                                                                       |
| Security       | Server-side validation, honeypot, rate limit, secrets only in environment variables                                                                |

## 10. Motion specification

| Token      | Value                          | Use                           |
|------------|--------------------------------|-------------------------------|
| ease-stone | cubic-bezier(0.22, 1, 0.36, 1) | Blocks settling, cards rising |
| dur-short  | 180 ms                         | Hover, focus                  |
| dur-base   | 420 ms                         | Reveals                       |
| dur-scene  | 1.8 s max                      | Hero assembly total           |
| stagger    | 70 ms                          | Block and tile sequences      |
| distance   | 16–24 px                       | Rise-in offset; never more    |

No parallax on text. No auto-playing sound or video. Scroll-linked
scenes must never trap the visitor: the page always moves with the
scroll wheel or swipe.

## 11. Build phases and acceptance criteria

| Phase                 | Scope                                                                                                                                      | Done when                                                                                  |
|-----------------------|--------------------------------------------------------------------------------------------------------------------------------------------|--------------------------------------------------------------------------------------------|
| 1\. Foundation        | Scaffold, tokens, fonts, i18n with RTL, header/footer, language switch, Arch component (static), all routes with placeholder sections      | Both locales render every route; `dir` correct; lint and type checks pass                  |
| 2\. Content pages     | About, Programmes, Graduates, Universities, Sponsors, Businesses, Chapters, Events (empty state), Contact, Privacy, 404 with approved copy | All copy from section 6 present in both languages; responsive at four breakpoints          |
| 3\. Forms             | JoinForm with four modes, validation, consent, storage, emails, deep links                                                                 | Playwright tests submit each mode in both languages; data stored; emails sent in test mode |
| 4\. Immersion         | Home scroll story scenes 1–10 with motion spec and reduced-motion fallbacks                                                                | Visual check at four breakpoints; reduced-motion check; no layout shift from animations    |
| 5\. Polish and launch | SEO, OG images, analytics, dark mode, Lighthouse CI, accessibility audit                                                                   | Quality bar in section 9 met; deployment to production domain                              |

## 12. Placeholders and open items

Use these exact placeholders and list them in the README so the owner
can replace them.

| Item                  | Placeholder                                                                                         |
|-----------------------|-----------------------------------------------------------------------------------------------------|
| Contact email         | `CONTACT_EMAIL` (environment variable)                                                              |
| Phone / WhatsApp      | `CONTACT_PHONE`                                                                                     |
| Domain                | `SITE_URL`                                                                                          |
| Social links          | `SOCIAL_LINKEDIN`, `SOCIAL_INSTAGRAM`, `SOCIAL_X`, `WHATSAPP_COMMUNITY_URL` (hide icons when empty) |
| Founder note          | 'Founder note coming soon' block on About                                                           |
| Events                | Empty state until the owner adds entries in `content/events.ts`                                     |
| Partners and sponsors | No logos until confirmed; show 'Founding partners announced soon'                                   |
| Privacy wording       | Draft provided; owner confirms with an adviser before launch                                        |

## 13. Starter prompt for Claude Code

Save this PDF and its Markdown twin (`east-to-west-site-build-brief.md`)
in the project folder, then paste this prompt into Claude Code.

    You are building the website for East to West Development Society (جمعية الشرق إلى الغرب للتنمية).
    Read the attached brief "east-to-west-site-build-brief.pdf" completely before writing any code.
    The Markdown twin "east-to-west-site-build-brief.md" has identical content; copy all
    Arabic strings from the Markdown file, because PDF text extraction can distort Arabic.

    1. Summarise the brief back to me in 10 bullet points and list any questions.
    2. Propose the file structure, then scaffold the project exactly as specified in section 8.
    3. Build in the phases in section 11. Stop at the end of each phase, run the checks listed
       for that phase, and tell me what to review before continuing.
    4. Use only the copy in section 6. Never invent statistics, partners, testimonials,
       licences or contact details. Where content is missing, use the placeholders in section 12.
    5. English and Arabic must both be complete. Arabic pages are right-to-left.
    6. Respect prefers-reduced-motion everywhere.
