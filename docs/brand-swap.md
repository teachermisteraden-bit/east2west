# Swapping in the brand

`brand/` does not exist yet. Everything visual is a token, so applying the real
brand is a small, contained change rather than a rebuild.

## What to do when `brand/` arrives

1. **Colours, type, motion.** Replace the values in `src/styles/tokens.css`.
   Nothing else names a colour or a font — if a component does, that is a bug.
   Keep the token *names*; only the values change.

   Two tokens exist for accessibility rather than aesthetics and must be
   re-derived, not copied: `--gold-deep` (focus rings and informational
   hairlines on light surfaces, needs ≥3:1) and `--gold-text` (gold text on
   light surfaces, needs ≥4.5:1). The designed accent measured 2.92:1 on ivory,
   below both. Check the new palette the same way before shipping it.

2. **The wordmark.** Delete `src/components/brand/Wordmark.tsx` and
   `wordmark.css` and put the real logo in their place. Every use is through
   that one component, so the header, footer, press page and Open Graph cards
   follow. The retired arch mark must not reappear.

3. **Fonts.** Replace the files in `public/fonts/` and the `@font-face` rules in
   `src/styles/fonts.css`, then update `displayFontFor` and `bodyFontFor` in
   `src/styles/fonts.ts` so the right face is preloaded per script.

   Keep the `unicode-range` on each face and keep `font-display: optional` on the
   display faces — both are load-bearing. See the note at the top of `fonts.css`.

4. **Icons.** Replace `src/app/icon.svg`, then regenerate the raster sizes:

   ```bash
   node scripts/build-icons.mjs
   ```

5. **Open Graph cards.** `src/lib/og.tsx` draws them from the same tokens. If the
   brand supplies artwork instead, swap the renderer for the image — but keep the
   per-locale titles, and keep the Arabic going through `toWords()`: Satori does
   not implement the bidi algorithm, and `tests/og.test.mjs` guards that.

6. **Run the checks.** `npm run check`, `npm run test:e2e`, then
   `npx lhci autorun`. The accessibility suite will catch a palette that does not
   meet contrast, which is the most likely thing to go wrong.

## What must not change

- The lattice is a pattern, never a building, and never religious or royal
  imagery.
- The compass layer (`.compass-fixed`) keeps the sun's path geographically true:
  dawn east, dusk west, in both languages.
- Gold stays rare. The proportion in `01` — roughly 70% ivory or obsidian, 20%
  text, 8% palm, 2% gold — is what makes it read as precious.
