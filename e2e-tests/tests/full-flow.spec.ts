import { test, expect } from "@playwright/test";

test("full user flow: register → login → home → logout", async ({ page }) => {
  // 1️⃣ Go to Register page (default)
  await page.goto("http://localhost:5173/register");

  // 2️⃣ Fill registration form
  const randomEmail = `testuser_${Date.now()}@example.com`;
  await page.fill("#username", "testuser");
  await page.fill("#email", randomEmail);
  await page.fill("#password", "testpassword");

  await page.click('button:has-text("Create an account")');

  // 3️⃣ Wait for redirect to Login page
  await page.waitForURL("http://localhost:5173/login", { timeout: 20000 });
  await expect(page.locator('h2, h1, [role="heading"]')).toContainText("Login");

  // 4️⃣ Fill login form
  await page.fill("#email", randomEmail);
  await page.fill("#password", "testpassword");
  await page.click('button:has-text("Login")');

  // 5️⃣ Wait for home page and verify
  await page.waitForURL("http://localhost:5173/home", { timeout: 20000 });
  await expect(page.locator('[data-testid="welcome-message"]')).toContainText(
    "Hello, testuser"
  );

  // 6️⃣ Logout
  await page.click('button:has-text("Logout")');
  await page.waitForURL("http://localhost:5173/login", { timeout: 20000 });
});
