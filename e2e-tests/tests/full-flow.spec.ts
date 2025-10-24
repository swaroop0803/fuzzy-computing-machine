// import { test, expect } from "@playwright/test";

// test("full user flow: register → login → home → logout", async ({ page }) => {
//   // 1️⃣ Go to login page
//   await page.goto("http://localhost:5173/login");
//   await expect(page.locator('h2, h1, [role="heading"]')).toContainText("Login");

//   // 2️⃣ Click "Register" link
//   await page.click("text=Register");
//   await expect(page).toHaveURL("http://localhost:5173/register");

//   // 3️⃣ Fill registration form
//   const randomEmail = `testuser_${Date.now()}@example.com`;
//   await page.fill("#username", "testuser");
//   await page.fill("#email", randomEmail);
//   await page.fill("#password", "testpassword");

//   await page.click('button:has-text("Create an account")');

//   // 4️⃣ Should redirect to login page
//   await expect(page).toHaveURL("http://localhost:5173/login");

//   // 5️⃣ Fill login form
//   await page.fill("#email", randomEmail);
//   await page.fill("#password", "testpassword");
//   await page.click('button:has-text("Login")');

//   // 6️⃣ Wait for home page and verify
//   await expect(page).toHaveURL("http://localhost:5173/home");
//   await expect(page.locator('[data-testid="welcome-message"]')).toContainText(
//     "Hello, testuser"
//   );

//   // 7️⃣ Logout
//   await page.click('button:has-text("Logout")');
//   await expect(page).toHaveURL("http://localhost:5173/login");
// });


import { test, expect } from "@playwright/test";

test.describe("Full user flow: register → login → home → logout", () => {

  // Make sure all tests run headless in CI
  test.use({ headless: true });

  test("should register, login, view home, and logout", async ({ page }) => {

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

    // Submit registration
    await Promise.all([
      page.waitForNavigation({ url: "http://localhost:5173/login", timeout: 5000 }),
      page.click('button:has-text("Create an account")'),
    ]);

    // 4️⃣ Fill login form
    await page.fill("#email", randomEmail);
    await page.fill("#password", "testpassword");

    // Submit login
    await Promise.all([
      page.waitForNavigation({ url: "http://localhost:5173/home", timeout: 5000 }),
      page.click('button:has-text("Login")'),
    ]);

    // 5️⃣ Verify home page and username
    await expect(page.locator('[data-testid="welcome-message"]')).toContainText(
      "Hello, testuser",
      { timeout: 5000 }
    );

    // 6️⃣ Logout
    await Promise.all([
      page.waitForNavigation({ url: "http://localhost:5173/login", timeout: 5000 }),
      page.click('button:has-text("Logout")'),
    ]);

  });
});
