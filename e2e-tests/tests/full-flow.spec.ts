import { test, expect } from "@playwright/test";

test("full user flow: register → login → home → logout → forward navigation blocked", async ({ page }) => {
  // 1️⃣ Open app (register page appears first)
  await page.goto("http://localhost:5173");
  await expect(page.locator('h2, h1, [role="heading"]')).toContainText("Register");

  // 2️⃣ Fill registration form
  const randomEmail = `testuser_${Date.now()}@example.com`;
  await page.fill("#username", "testuser");
  await page.fill("#email", randomEmail);
  await page.fill("#password", "testpassword");
  await page.click('button:has-text("Create an account")');

  // 3️⃣ Wait for redirect to Login page
  await page.waitForURL("http://localhost:5173/login", { timeout: 10000 });
  await expect(page.locator('h2, h1, [role="heading"]')).toContainText("Login");

  // 4️⃣ Fill login form
  await page.fill("#email", randomEmail);
  await page.fill("#password", "testpassword");
  await page.click('button:has-text("Login")');

  // 5️⃣ Verify Home page
  await page.waitForURL("http://localhost:5173/home", { timeout: 10000 });
  await expect(page.locator('[data-testid="welcome-message"]')).toContainText("Hello, testuser");

  // 6️⃣ Logout
  await page.click('button:has-text("Logout")');
  await expect(page).toHaveURL("http://localhost:5173/login");

  // 7️⃣ Try forward navigation (simulate user clicking forward button)
  await page.goForward();
  await expect(page).toHaveURL("http://localhost:5173/login"); // Should remain at login
});
