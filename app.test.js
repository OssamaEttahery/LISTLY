import { test, expect } from "@playwright/test";

test("h1 shows something", async ({ page }) => {
  await page.goto("http://localhost:8080");

  const text = await page.textContent("h1#date");

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