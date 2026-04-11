import { test, expect } from "@playwright/test";

test.beforeEach(async ({ page }) => {
  await page.goto("http://localhost:8080");
});

test("h1 shows something", async ({ page }) => {
  const readySel = createSelect(page);

  const el = await readySel.select("h1#date");
  const text = await el.textContent();

  expect(isValidDateString(text)).toBe(true);
});

test("if i click at previous it gose to the previous date", async ({ page }) => {
  const readySel = createSelect(page);

  const el = await readySel.select("h1#date");
  const today = new Date(await el.textContent());

  const button = await readySel.select("#prev-btn");
  await button.click();

  const yesterday = new Date(await el.textContent());
  const expected = new Date(today);
  expected.setDate(expected.getDate() - 1);

  expect(yesterday.toDateString()).toBe(expected.toDateString());
});

test("if i click on next it gose to the next date", async ({ page }) => {
  const readySel = createSelect(page);

  const el = await readySel.select("h1#date");
  const today = new Date(await el.textContent());

  const button = await readySel.select("#next-btn");
  await button.click();

  const tomorrow = new Date(await el.textContent());
  const expected = new Date(today);
  expected.setDate(expected.getDate() + 1);

  expect(tomorrow.toDateString()).toBe(expected.toDateString());
});

function isValidDateString(str) {
    // 1. Check format
    const match = /^\d{4}-\d{2}-\d{2}$/.test(str);
    if (!match) return false;

    // 2. Parse
    const date = new Date(str);

    if (isNaN(date)) return false;

    // 3. Re-check components (critical step)
    const [year, month, day] = str.split("-").map(Number);

    return (
    date.getFullYear() === year &&
    date.getMonth() + 1 === month &&
    date.getDate() === day
    );
}

test("adding a todo shows it in the list", async ({ page }) => {
  const readySel = createSelect(page);

  const input = await readySel.select("#todo-input");
  const button = await readySel.select("#add-btn");
  const list = await readySel.select("#todo-list");

  await input.fill("Test todo");
  await button.click();

  await expect(list).toContainText("Test todo");
  await expect(input).toHaveValue("");

  await button.click();
  const listIteams = await readySel.selectAll("#todo-list li");
  await expect(listIteams).toHaveCount(1); 
});

test("If i add an item and i refresh the page the item persists", async ({ page }) => {
  const readySel = createSelect(page);

  const input = await readySel.select("#todo-input");
  const button = await readySel.select("#add-btn");

  await input.fill("Test todo1");
  await button.click();
  await input.fill("Test todo2");
  await button.click();

  await page.reload();

  const listItems = await readySel.selectAll("#todo-list li");
  await expect(listItems).toHaveCount(2);

  for (const item of await listItems.all()) {
    await expect(item.locator("button")).toHaveText("x");
  }
});

test("If i click the delete button, the item is removed", async ({ page }) => {
  const readySel = createSelect(page);

  const input = await readySel.select("#todo-input");
  const button = await readySel.select("#add-btn");
  const list = await readySel.select("#todo-list");

  await input.fill("Test todo");
  await button.click();

  const listItem = await list.locator("li");
  const deleteButton = await listItem.locator("button");
  await deleteButton.click();

  await expect(list).not.toContainText("Test todo");

  await page.reload();

  await expect(list).not.toContainText("Test todo");
});

function createSelect(page) {
  async function select(selector) {
    const el = page.locator(selector);
    await expect(el).toHaveCount(1);
    return el;
  }

  async function selectAll(selector) {
    const el = page.locator(selector);
    return el;
  }

  return { select, selectAll };
}