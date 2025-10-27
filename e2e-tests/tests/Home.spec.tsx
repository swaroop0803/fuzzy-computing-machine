// tests/logout.spec.ts
import { test, expect } from "@playwright/test";

const frontendUrl = "http://localhost:5173";

// NOTE: Ideally, you would use a Global Setup file to pre-log in 
// and save the state. For this example, we will re-use the login logic.

// Create a unique user for this flow (or use the API setup pattern)
const uniqueUsername = `logouttest_${Date.now().toString().slice(-4)}`;
const uniqueEmail = `${uniqueUsername}@example.com`;
const password = "testpassword123"; 

// We'll perform a quick API setup right before the test for stability
test.beforeAll(async ({ request }) => {
    // Register the user via API first
    await request.post('http://localhost:5001/api/auth/register', {
        data: { username: uniqueUsername, email: uniqueEmail, password: password },
    });
});


test("should allow a logged-in user to log out and redirect to login page", async ({ page }) => {
  // 1️⃣ Log In (Necessary precondition for a logout test)
  await page.goto(`${frontendUrl}/login`);
  await page.fill("#email", uniqueEmail);
  await page.fill("#password", password);
  
  await Promise.all([
    page.waitForResponse((response) => response.url().includes("/api/auth/login")),
    page.click('button:has-text("Login")'),
  ]);
  
  // Verify landing on the Home page
  await page.waitForURL(`${frontendUrl}/home`);

  // 2️⃣ Logout Action
  await page.click('button:has-text("Logout")');
  
  // 3️⃣ Verification
  await page.waitForURL(`${frontendUrl}/login`, { timeout: 20000 });
  await expect(page.locator('h2, h1, [role="heading"]')).toContainText("Login");
});