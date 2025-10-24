import { test, expect } from "@playwright/test";

test("full user flow: register → login → home → logout", async ({ page }) => {
  // 1️⃣ Go to Register page
  await page.goto("http://localhost:5173/");
  await expect(page.locator('h2, h1, [role="heading"]')).toContainText("Register");

  // 2️⃣ Fill registration form
  const randomEmail = `testuser_${Date.now()}@example.com`;
  await page.fill("#username", "testuser");
  await page.fill("#email", randomEmail);
  await page.fill("#password", "testpassword");

  await page.click('button:has-text("Create an account")');

  // 3️⃣ Should redirect to Login page
  await page.waitForURL("http://localhost:5173/login");
  await expect(page.locator('h2, h1, [role="heading"]')).toContainText("Login");

  // 4️⃣ Fill login form
  await page.fill("#email", randomEmail);
  await page.fill("#password", "testpassword");
  await page.click('button:has-text("Login")');

  // 5️⃣ Verify Home page
  await page.waitForURL("http://localhost:5173/home");
  await expect(page.locator('[data-testid="welcome-message"]')).toContainText(
    "Hello, testuser"
  );

  // 6️⃣ Logout
  await page.click('button:has-text("Logout")');
  await page.waitForURL("http://localhost:5173/login");
});
