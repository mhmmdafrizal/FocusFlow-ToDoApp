const { test, expect } = require("@playwright/test");
const { ref, row, createTodo, deleteTodo } = require("./helpers");

test.describe("todo CRUD", () => {
  const created = [];

  test.afterEach(async ({ page }) => {
    for (const title of created) {
      await deleteTodo(page, title).catch(() => {});
    }
    created.length = 0;
  });

  test("creates a todo with title and description", async ({ page }) => {
    const title = ref("create");
    const desc = "do the thing, then the other thing";

    await page.goto("/");
    await createTodo(page, title, desc);

    await expect(row(page, title)).toContainText(desc);
    created.push(title);
  });

  test("toggles completion and persists after reload", async ({ page }) => {
    const title = ref("toggle");

    await page.goto("/");
    await createTodo(page, title);

    const r = row(page, title);
    await r.getByRole("button", { name: "Toggle complete" }).click();

    // Completed state: visible under "completed", gone from "active".
    await page.getByRole("button", { name: /^completed/ }).click();
    await expect(r).toHaveCount(1);
    await page.getByRole("button", { name: /^active/ }).click();
    await expect(r).toHaveCount(0);

    // Persisted server-side: still completed after a full reload.
    await page.reload();
    await page.getByRole("button", { name: /^completed/ }).click();
    await expect(row(page, title)).toHaveCount(1);

    created.push(title);
  });

  test("filters all / active / completed", async ({ page }) => {
    const a = ref("a");
    const b = ref("b");

    await page.goto("/");
    await createTodo(page, a);
    await createTodo(page, b);

    await row(page, b).getByRole("button", { name: "Toggle complete" }).click();

    // "all" shows both.
    await expect(row(page, a)).toHaveCount(1);
    await expect(row(page, b)).toHaveCount(1);

    // "active" shows only the incomplete one.
    await page.getByRole("button", { name: /^active/ }).click();
    await expect(row(page, a)).toHaveCount(1);
    await expect(row(page, b)).toHaveCount(0);

    // "completed" shows only the toggled one.
    await page.getByRole("button", { name: /^completed/ }).click();
    await expect(row(page, a)).toHaveCount(0);
    await expect(row(page, b)).toHaveCount(1);

    created.push(a, b);
  });

  test("deletes a todo", async ({ page }) => {
    const title = ref("delete");

    await page.goto("/");
    await createTodo(page, title);

    const r = row(page, title);
    await r.hover();
    await r.getByRole("button", { name: "Delete task" }).click();
    await expect(r).toHaveCount(0);
  });
});