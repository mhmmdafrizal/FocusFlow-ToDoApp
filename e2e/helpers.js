const { expect } = require("@playwright/test");

// Unique per run so parallel tests never collide on the shared DB.
const runId = Math.random().toString(36).slice(2, 8);

function ref(label) {
  return `E2E-${runId}-${label}`;
}

// Todo rows are <div class="group ..."> with an inner <p> title.
const row = (page, title) => page.locator("div.group").filter({ hasText: title });

// fill() doesn't dispatch React events under mobile (isMobile) emulation;
// real typing does. Use it everywhere so both projects behave identically.
async function typeInto(locator, text) {
  await locator.click();
  await locator.pressSequentially(text);
}

async function createTodo(page, title, description) {
  await typeInto(page.getByPlaceholder("What's on your mind?"), title);
  if (description) {
    await typeInto(page.getByPlaceholder("Break it down"), description);
  }
  await page.getByRole("button", { name: "Add Task" }).click();
  await expect(row(page, title)).toHaveCount(1);
}

async function deleteTodo(page, title) {
  const r = row(page, title);
  await r.hover();
  await r.getByRole("button", { name: "Delete task" }).click();
  await expect(r).toHaveCount(0);
}

module.exports = { ref, row, typeInto, createTodo, deleteTodo };