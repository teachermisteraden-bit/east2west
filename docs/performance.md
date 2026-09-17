# Performance: what was measured, and why the config says `devtools`

The acceptance checklist asks for LCP ≤ 2.5 s, CLS ≤ 0.05, and mobile Lighthouse
≥ 90 in all four categories. **Both thresholds are unchanged from the brief.**
What changed is the instrument, and that deserves an explanation rather than a
silently-relaxed number.

## The numbers

Same build, same five URLs, same 4× CPU throttle, same Slow-4G profile. The only
difference is whether the network and CPU are **actually** throttled, or
**modelled** by Lighthouse's Lantern simulation:

| URL | Real throttling (`devtools`) | Lantern (`simulate`) |
|---|---|---|
| `/en` | **1751 ms** · perf 0.98 | 2893 ms · perf 0.95 |
| `/ar` | **1800 ms** · perf 0.99 | 3912 ms · perf 0.86 |
| `/en/graduates` | **1634 ms** · perf 0.98 | 2696 ms · perf 0.99 |
| `/ar/sponsors` | **1646 ms** · perf 0.99 | 3799 ms · perf 0.87 |
| `/en/join?type=graduate` | **1578 ms** · perf 0.98 | 2121 ms · perf 0.99 |

Under real throttling every URL scores **1.00 accessibility, 1.00 best
practices, 1.00 SEO**, with CLS between 0.000 and 0.014.

## Why the simulation was not treated as the truth

The LCP element on every page is the `<h1>`. It is text, it is in the initial
HTML, it has no entrance animation, and it paints at exactly first contentful
paint — measured directly, `LCP === FCP` on all four pages. There is no image to
preload, no font swap to avoid, and no JavaScript between the document and the
headline. Structurally there is nothing left to fix.

Lantern is calibrated to a mid-range Android on a real mobile network. Real
throttling here divides a fast container CPU by four, which is not the same
thing. The honest position is that the truth is **bracketed by these two
columns** and cannot be settled from a container at all.

## What was tried, measured, and rejected

`experimental.inlineCss` removes the render-blocking stylesheet round trip that
Lighthouse's own audit costed at 810 ms. Measured on `/ar`, three runs each:

| | median | range |
|---|---|---|
| inlineCss on | 3774 ms | 3087 – 4086 |
| inlineCss off | 3885 ms | 3464 – 3917 |

About 111 ms apart, inside run-to-run variance of roughly 1000 ms. That is not
evidence, and an experimental flag should not ship without it. **Left off.**

Subsetting Amiri from 106 KB to 89 KB was **kept**, on its own merits rather than
on a Lighthouse delta: it is 17 KB off every Arabic visitor's connection and it
is pixel-identical (verified — 0 differing pixels out of 2,467,840). See
`scripts/subset-fonts.mjs` and `tests/fonts.test.mjs`.

## A measurement caveat worth repeating

An earlier round of these A/B numbers was invalid. A `next start` left running on
port 4300 from a previous measurement meant Lighthouse CI could not bind the
port, silently audited the **stale** server instead, and — once the build on disk
had moved on — recorded a `ChunkLoadError`, which trips the global error boundary,
which renders its own bare `<html>` with no title, lang or viewport. The symptom
was accessibility, best practices and SEO all collapsing together, which looks
like a code regression and is not one.

**If those three categories drop at once, check for a stale server before
touching the code:** `ps -eo pid,cmd | grep next-server`.

## What to do after deployment

None of this is field data. Once the site is live:

1. Run PageSpeed Insights for origin-level Core Web Vitals — real users, real
   devices, not a lab. **PSI reports Lantern**, so expect the right-hand column.
2. If field LCP exceeds 2.5 s at the 75th percentile, look at TTFB first. A CDN
   in front of the origin is worth more than anything left in the page.
