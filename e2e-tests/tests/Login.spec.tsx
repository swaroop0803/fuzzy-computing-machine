// tests/login.spec.ts
import { test, expect, request } from "@playwright/test";

const frontendUrl = "http://localhost:5173";
const registrationApiUrl = "http://localhost:5001/api/auth/register";

// Global variable to store the credentials of the user created via API
let preRegisteredUser: { email: string; password: string; username: string };

// --- Setup: Register a user via API before the test runs ---
test.beforeAll(async () => {
  const apiContext = await request.newContext();
  const username = `logintest_${Date.now().toString().slice(-4)}`;
  
  preRegisteredUser = { 
    username: username,
    email: `${username}@example.com`,
    password: "testpassword123"
  };

  // ➡️ Direct API call to create the user, bypassing the UI
  const response = await apiContext.post(registrationApiUrl, {
    data: preRegisteredUser,
  });
  
  // CRITICAL: Ensure the setup step itself was successful
  expect(response.status()).toBe(201); 
});


test("should allow pre-registered user to log in and land on home page", async ({ page }) => {
  await page.goto(`${frontendUrl}/login`);
  
  // 1️⃣ Fill login form with the API-created user's credentials
  await page.fill("#email", preRegisteredUser.email);
  await page.fill("#password", preRegisteredUser.password);
  
  // 2️⃣ Wait for login API response (200) AND click the login button
  await Promise.all([
    page.waitForResponse((response) => 
      response.url().includes("/api/auth/login") && response.status() === 200
    ),
    page.click('button:has-text("Login")'),
  ]);

  // 3️⃣ Verify redirect to Home page
  await page.waitForURL(`${frontendUrl}/home`, { timeout: 20000 });
  
  // 4️⃣ Verify successful login with the correct username
  await expect(page.locator('[data-testid="welcome-message"]')).toContainText(
    `Hello, ${preRegisteredUser.username}`
  );
});