import { test, expect } from "@playwright/test";

test("full user flow: register → login → home → logout", async ({ page }) => {
  // 1️⃣ Go to login page
  await page.goto("http://localhost:5173/login");
  await expect(page.locator('h2, h1, [role="heading"]')).toContainText("Login");

  // 2️⃣ Click "Register" link
  await page.click("text=Register");
  await expect(page).toHaveURL("http://localhost:5173/register");

  // 3️⃣ Fill registration form
  const randomEmail = `testuser_${Date.now()}@example.com`;
  await page.fill("#username", "testuser");
  await page.fill("#email", randomEmail);
  await page.fill("#password", "testpassword");

  await page.click('button:has-text("Create an account")');

  // 4️⃣ Should redirect to login page
  await expect(page).toHaveURL("http://localhost:5173/login");

  // 5️⃣ Fill login form
  await page.fill("#email", randomEmail);
  await page.fill("#password", "testpassword");
  await page.click('button:has-text("Login")');

  // 6️⃣ Wait for home page and verify
  await expect(page).toHaveURL("http://localhost:5173/home");
  await expect(page.locator('[data-testid="welcome-message"]')).toContainText(
    "Hello, testuser"
  );

  // 7️⃣ Logout
  await page.click('button:has-text("Logout")');
  await expect(page).toHaveURL("http://localhost:5173/login");
});
