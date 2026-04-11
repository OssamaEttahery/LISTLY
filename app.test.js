import { test, expect } from "@playwright/test";

test.beforeEach(async ({ page }) => {
  await page.goto("http://localhost:8080");
});

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

test("h1 shows something", async ({ page }) => {
  const readySel = createSelect(page);

  const el = await readySel.select("h1#date");
  const text = await el.textContent();

  expect(isValidDateString(text)).toBe(true);
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

test("If i add an item and i refresh the page the item persists", async ({ page }) => {
  const readySel = createSelect(page);

  const input = await readySel.select("#todo-input");
  const button = await readySel.select("#add-btn");
  const list = await readySel.select("#todo-list");

  await input.fill("Test todo1");
  await button.click();
  await input.fill("Test todo2");
  await button.click();

  await page.reload();

  const listIteams = await readySel.selectAll("#todo-list li");
  await expect(listIteams).toHaveCount(2); 
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