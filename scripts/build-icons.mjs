/**
 * Rasterises src/app/icon.svg into the PNG sizes that cannot be SVG.
 *
 * Apple touch icons must be PNG, and some feed readers still refuse SVG
 * favicons. Rendered once with the Chromium this project already uses for
 * tests, so there is no image library to install.
 *
 *   node scripts/build-icons.mjs
 */
import { readFileSync, writeFileSync, existsSync, readdirSync } from "node:fs";
import { join } from "node:path";
import { chromium } from "@playwright/test";

function findChromium() {
  if (process.env.CHROMIUM_PATH) return process.env.CHROMIUM_PATH;
  const root = process.env.PLAYWRIGHT_BROWSERS_PATH;
  if (!root || !existsSync(root)) return undefined;
  for (const dir of readdirSync(root)) {
    if (!dir.startsWith("chromium-")) continue;
    const candidate = join(root, dir, "chrome-linux", "chrome");
    if (existsSync(candidate)) return candidate;
  }
  return undefined;
}

const svg = readFileSync("src/app/icon.svg", "utf8");
const targets = [
  { file: "src/app/apple-icon.png", size: 180 },
  { file: "public/icon-512.png", size: 512 },
];

const browser = await chromium.launch({ executablePath: findChromium() });
for (const { file, size } of targets) {
  const page = await browser.newPage({ viewport: { width: size, height: size } });
  await page.setContent(
    `<style>html,body{margin:0;padding:0}svg{display:block;width:${size}px;height:${size}px}</style>${svg}`,
  );
  const buffer = await page.screenshot({ omitBackground: false });
  writeFileSync(file, buffer);
  console.log(`wrote ${file} (${size}x${size}, ${(buffer.length / 1024).toFixed(1)} KB)`);
  await page.close();
}
await browser.close();
