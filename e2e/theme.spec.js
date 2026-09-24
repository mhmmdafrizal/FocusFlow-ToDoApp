const { test, expect } = require("@playwright/test");

test.describe("theme toggle", () => {
  test("toggles dark mode and persists on reload", async ({ page }) => {
    await page.goto("/");
    const html = page.locator("html");
    const toggle = page.getByRole("button", { name: "Toggle theme" });

    const before = await html.getAttribute("class");
    await toggle.click();
    const after = await html.getAttribute("class");
    expect(after).not.toBe(before);

    // Persisted to localStorage by next-themes.
    await page.reload();
    await expect.poll(() => html.getAttribute("class")).toBe(after);

    // And toggling back works.
    await toggle.click();
    await expect.poll(() => html.getAttribute("class")).toBe(before);
  });
});