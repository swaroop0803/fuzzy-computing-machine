import { test, expect } from "@playwright/test";

test("full user flow: register → login → home → logout", async ({ page }) => {

  // 1️⃣ Go to login page
  await page.goto("http://localhost:5173/login");
  await expect(page.locator('h2, h1, [role="heading"]')).toContainText("Login", { timeout: 5000 });

  // 2️⃣ Click "Register" link
  await page.click("text=Register");
  await expect(page).toHaveURL("http://localhost:5173/register", { timeout: 5000 });

  // 3️⃣ Fill registration form
  const randomEmail = `testuser_${Date.now()}@example.com`;
  await page.fill("#username", "testuser");
  await page.fill("#email", randomEmail);
  await page.fill("#password", "testpassword");

  // Submit registration and wait for login page
  await Promise.all([
    page.waitForNavigation({ url: "http://localhost:5173/login", timeout: 5000 }),
    page.click('button:has-text("Create an account")'),
  ]);

  // 4️⃣ Fill login form
  await page.fill("#email", randomEmail);
  await page.fill("#password", "testpassword");

  // Submit login and wait for home page
  await Promise.all([
    page.waitForNavigation({ url: "http://localhost:5173/home", timeout: 5000 }),
    page.click('button:has-text("Login")'),
  ]);

  // 5️⃣ Verify home page and username
  await expect(page.locator('[data-testid="welcome-message"]')).toContainText("Hello, testuser", { timeout: 5000 });

  // 6️⃣ Logout and wait for login page
  await Promise.all([
    page.waitForNavigation({ url: "http://localhost:5173/login", timeout: 5000 }),
    page.click('button:has-text("Logout")'),
  ]);
});
