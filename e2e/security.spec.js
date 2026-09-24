const { test, expect } = require("@playwright/test");
const { ref, row, createTodo, deleteTodo, typeInto } = require("./helpers");

test.describe("security edge-cases", () => {
  const created = [];

  test.afterEach(async ({ page }) => {
    for (const title of created) {
      await deleteTodo(page, title).catch(() => {});
    }
    created.length = 0;
  });

  test("injected script stays inert (no dialog, no execution)", async ({ page }) => {
    const title = `${ref("xss")}<script>alert('xss')</script>`;
    const desc = "<img src=x onerror=alert(1)>";
    let dialogFired = false;
    page.on("dialog", (d) => {
      dialogFired = true;
      d.dismiss();
    });

    await page.goto("/");
    await createTodo(page, title, desc);

    expect(dialogFired).toBe(false);
    // Rendered as literal text, not an executed node.
    const r = row(page, ref("xss"));
    await expect(r).toContainText("alert('xss')");
    await expect(r).toContainText("onerror");

    // Still inert after a server round-trip (stored in DB, re-rendered).
    await page.reload();
    await expect(row(page, ref("xss"))).toContainText("alert('xss')");
    expect(dialogFired).toBe(false);

    created.push(title);
  });

  test("SQL injection attempt is stored as literal text", async ({ page }) => {
    const title = `${ref("sqli")}'; DROP TABLE todos; --`;
    const legit = ref("ok");

    await page.goto("/");
    await createTodo(page, title);
    await createTodo(page, legit);

    // Both rows stored literally; app stayed healthy (nothing dropped/leaked).
    await expect(row(page, ref("sqli"))).toHaveCount(1);
    await expect(row(page, legit)).toHaveCount(1);

    created.push(title, legit);
  });

  test("empty title is blocked client-side", async ({ page }) => {
    await page.goto("/");
    const addBtn = page.getByRole("button", { name: "Add Task" });

    await expect(addBtn).toBeDisabled();
    await typeInto(page.getByPlaceholder("What's on your mind?"), "   ");
    await expect(addBtn).toBeDisabled();
  });

  test("over-long description is rejected by the server (no partial create)", async ({ page }) => {
    const title = ref("toolong");
    const tooLong = "x".repeat(201);

    await page.goto("/");
    const titleInput = page.getByPlaceholder("What's on your mind?");
    await typeInto(titleInput, title);
    await typeInto(page.getByPlaceholder("Break it down"), tooLong);
    await page.getByRole("button", { name: "Add Task" }).click();

    // Mutation threw: onSuccess never ran, so the form keeps its values.
    await expect(titleInput).toHaveValue(title);
    // Nothing persisted: after reload the task is absent.
    await page.reload();
    await expect(row(page, title)).toHaveCount(0);
  });
});