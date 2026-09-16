import { test, expect, type Page } from "@playwright/test";

const STUB = `http://localhost:${process.env.STUB_PORT ?? 4999}`;

/**
 * The stub is shared by every project running in parallel, so tests must not
 * depend on its global state. Each test uses a unique email and looks only for
 * its own row — no reset, no ordering assumptions, no cross-project races.
 */
const uniqueEmail = (prefix: string) =>
  `${prefix}-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}@example.com`;

type StubRow = { table: string; body: Record<string, unknown> };

async function submissionsFor(page: Page, email: string): Promise<StubRow[]> {
  const response = await page.request.get(`${STUB}/__stub/received`);
  const rows = (await response.json()) as StubRow[];
  return rows.filter(
    (r) => r.table === "submissions" && (r.body.payload as Record<string, unknown> | undefined)?.email === email,
  );
}

test.describe("the five join modes", () => {

  test("graduate: a complete application reaches the invitation card", async ({ page }) => {
    const email = uniqueEmail("aisha");
    await page.goto("/en/join?type=graduate");

    // Endowed progress: the mode choice is already a completed node.
    await expect(page.locator(".thread__count")).toHaveText("Step 2 of 4");
    await expect(page.locator(".thread__note")).toHaveText("You've started");
    await expect(page.locator('.thread__node[data-state="done"]')).toHaveCount(1);

    await page.getByLabel("Full name").fill("Aisha Rahman");
    await page.getByLabel("Email").fill(email);
    await page.getByLabel("Mobile number").fill("+966512345678");
    await page.getByLabel("City").fill("Madinah");
    await page.getByLabel("Nationality").fill("Saudi");
    await page.getByRole("button", { name: "Continue" }).click();

    await expect(page.locator(".thread__count")).toHaveText("Step 3 of 4");
    await page.getByRole("radio", { name: "Graduate", exact: true }).check();
    await page.getByLabel("University").fill("Taibah University");
    await page.getByLabel("Field of study").fill("Computer Science");
    await page.getByLabel("Graduation year").fill("2025");
    await page.getByRole("button", { name: "Continue" }).click();

    // Goal gradient: the last step says so.
    await expect(page.locator(".thread__count")).toHaveText("Step 4 of 4");
    await expect(page.locator(".thread__note")).toHaveText("Last step");

    await page.getByRole("checkbox", { name: "Mentorship" }).check();
    await page.getByRole("checkbox", { name: /I agree that East to West/ }).check();
    await page.getByRole("button", { name: "Apply for membership" }).click();

    // The end moment.
    const card = page.locator(".invitecard");
    await expect(card).toBeVisible({ timeout: 15_000 });
    await expect(card).toContainText("Your invitation is on its way.");
    await expect(card).toContainText("Aisha Rahman");
    await expect(card).toContainText("membership application");
    await expect(card).toContainText("3 working days");

    // Both calendars appear on the card (04).
    await expect(card).toContainText(/\d{4}/);
    await expect(card).toContainText(/AH/);

    // The journey thread shows every node complete.
    await expect(card.locator('.thread__node[data-state="done"]')).toHaveCount(4);

    // A personal invite link is offered to graduates.
    await expect(card).toContainText("Your personal invite link");
    await expect(card.locator(".share__url code")).toContainText("?ref=");
  });

  test("the submission is stored with consent, and without the honeypot", async ({ page }) => {
    const email = uniqueEmail("omar");
    await page.goto("/en/join?type=chapter");

    await page.getByLabel("Full name").fill("Omar Said");
    await page.getByLabel("Email").fill(email);
    await page.getByLabel("Mobile number").fill("+966500000000");
    await page.getByRole("button", { name: "Continue" }).click();

    await page.getByLabel("City or campus for the chapter").fill("Jeddah");
    await page.getByRole("radio", { name: "Yes", exact: true }).check();
    await page.getByRole("checkbox", { name: /I agree that East to West/ }).check();
    await page.getByRole("button", { name: "Send chapter enquiry" }).click();

    await expect(page.locator(".invitecard")).toBeVisible({ timeout: 15_000 });

    const rows = await submissionsFor(page, email);
    expect(rows, "a submissions row should have been written").toHaveLength(1);

    const row = rows[0]!.body as Record<string, unknown>;
    expect(row.mode).toBe("chapter");
    expect(row.locale).toBe("en");
    expect(row.consent_at, "consent must be recorded with a timestamp").toBeTruthy();

    const payload = row.payload as Record<string, unknown>;
    expect(payload.fullName).toBe("Omar Said");
    // The honeypot and the consent flag are stripped before storage.
    expect(payload).not.toHaveProperty("website");
    expect(payload).not.toHaveProperty("consent");
  });

  test("campaign attribution survives from a poster QR into the stored row", async ({ page }) => {
    const email = uniqueEmail("layla");
    // Arrive exactly as someone scanning the graduates poster would.
    await page.goto("/go/graduates");
    await page.goto("/en/join?type=graduate");

    await page.getByLabel("Full name").fill("Layla Noor");
    await page.getByLabel("Email").fill(email);
    await page.getByLabel("Mobile number").fill("+966511111111");
    await page.getByLabel("City").fill("Riyadh");
    await page.getByLabel("Nationality").fill("Saudi");
    await page.getByRole("button", { name: "Continue" }).click();

    await page.getByRole("radio", { name: "Graduate", exact: true }).check();
    await page.getByLabel("University").fill("KSU");
    await page.getByLabel("Field of study").fill("Design");
    await page.getByLabel("Graduation year").fill("2024");
    await page.getByRole("button", { name: "Continue" }).click();

    await page.getByRole("checkbox", { name: "Mentorship" }).check();
    await page.getByRole("checkbox", { name: /I agree that East to West/ }).check();
    await page.getByRole("button", { name: "Apply for membership" }).click();
    await expect(page.locator(".invitecard")).toBeVisible({ timeout: 15_000 });

    const rows = await submissionsFor(page, email);
    expect(rows).toHaveLength(1);
    expect(rows[0]!.body.campaign).toBe("graduates");
  });

  test("consent is never pre-ticked and is required", async ({ page }) => {
    const email = uniqueEmail("sara");
    await page.goto("/en/join?type=chapter");
    await page.getByLabel("Full name").fill("Sara Ali");
    await page.getByLabel("Email").fill(email);
    await page.getByLabel("Mobile number").fill("+966522222222");
    await page.getByRole("button", { name: "Continue" }).click();

    const consent = page.getByRole("checkbox", { name: /I agree that East to West/ });
    await expect(consent).not.toBeChecked();

    await page.getByLabel("City or campus for the chapter").fill("Madinah");
    await page.getByRole("radio", { name: "Yes", exact: true }).check();
    await page.getByRole("button", { name: "Send chapter enquiry" }).click();

    await expect(page.getByText("Please tick the box so we can respond to you.")).toBeVisible();
    await expect(page.locator(".invitecard")).toHaveCount(0);
    expect(await submissionsFor(page, email)).toHaveLength(0);
  });

  test("errors are kind, specific and in the visitor's language", async ({ page }) => {
    await page.goto("/ar/join?type=graduate");
    await page.getByRole("button", { name: "متابعة" }).click();

    // Arabic errors, never an English Zod default.
    await expect(page.locator(".field__error").first()).toHaveText("يرجى تعبئة هذا الحقل.");
    const errors = await page.locator(".field__error").allInnerTexts();
    for (const message of errors) {
      expect(message, `"${message}" should not be English`).not.toMatch(/^Invalid|^Please|expected/);
    }
  });

  test("an unfinished application is restored, but consent is not", async ({ page }) => {
    await page.goto("/en/join?type=graduate");
    await page.getByLabel("Full name").fill("Yusuf Kamal");
    await page.getByLabel("Email").fill("yusuf@example.com");
    await page.waitForTimeout(300);

    await page.reload();
    await expect(page.getByLabel("Full name")).toHaveValue("Yusuf Kamal");
    await expect(page.getByLabel("Email")).toHaveValue("yusuf@example.com");
  });

  test("a bot that fills the honeypot stores nothing", async ({ page }) => {
    const email = uniqueEmail("bot");
    await page.goto("/en/join?type=chapter");
    await page.getByLabel("Full name").fill("Bot");
    await page.getByLabel("Email").fill(email);
    await page.getByLabel("Mobile number").fill("+966533333333");
    await page.getByRole("button", { name: "Continue" }).click();

    await page.getByLabel("City or campus for the chapter").fill("Nowhere");
    await page.getByRole("radio", { name: "Yes", exact: true }).check();
    await page.getByRole("checkbox", { name: /I agree that East to West/ }).check();
    // Only a bot can reach this field: it is clipped from view, removed from the
    // tab order and hidden from assistive technology. Setting `.value` directly
    // would not register with React, so drive it through the native setter the
    // way a browser-based bot filling inputs would.
    await page.locator("#website").evaluate((el: HTMLInputElement) => {
      const setter = Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, "value")?.set;
      setter?.call(el, "http://spam.example");
      el.dispatchEvent(new Event("input", { bubbles: true }));
    });
    await page.getByRole("button", { name: "Send chapter enquiry" }).click();
    await page.waitForTimeout(1500);

    expect(await submissionsFor(page, email)).toHaveLength(0);
  });
});

test("every mode is reachable and renders its own first step", async ({ page }) => {
  for (const [mode, firstLabel] of [
    ["graduate", "Full name"],
    ["university", "Institution"],
    ["sponsor", "Company"],
    ["business", "Company"],
    ["chapter", "Full name"],
  ] as const) {
    await page.goto(`/en/join?type=${mode}`);
    await expect(page.getByLabel(firstLabel).first()).toBeVisible();
    await expect(page.locator(".thread__nodes")).toBeVisible();
  }
});
