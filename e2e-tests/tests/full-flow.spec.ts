import { test, expect } from "@playwright/test";

// Define API URL for response tracking
const registrationApiUrl = "http://localhost:5001/api/auth/register";

test("full user flow: register → login → home → logout", async ({ page }) => {
  // 1️⃣ Go to Register page (default)
  await page.goto("http://localhost:5173/register");

  // 2️⃣ Fill registration form
  // Generate a unique email every time to avoid the 409 Duplicate error
  const randomUsername = `testuser_${Date.now().toString().slice(-4)}`;
  const randomEmail = `${randomUsername}@example.com`;
  const password = "testpassword";
  
  await page.fill("#username", randomUsername);
  await page.fill("#email", randomEmail);
  await page.fill("#password", password);

  // 3️⃣ Wait for the API response (201 status) AND click the button
  // We explicitly set the timeout here to 20 seconds (20000ms)
  const [response] = await Promise.all([
    // Wait for the successful registration response
    page.waitForResponse(
      (response) =>
        response.url().includes(registrationApiUrl) && response.status() === 201,
      { timeout: 20000 } // <-- ***THIS IS THE CRITICAL FIX***
    ),
    // Click the button to trigger the form submission
    page.click('button:has-text("Create an account")'),
  ]);

  // Check if the response was successful before continuing
  expect(response.status()).toBe(201); 

  // 4️⃣ Wait for redirect to Login page
  await page.waitForURL("http://localhost:5173/login", { timeout: 20000 });
  await expect(page.locator('h2, h1, [role="heading"]')).toContainText("Login");

  // 5️⃣ Fill login form
  await page.fill("#email", randomEmail);
  await page.fill("#password", password);
  
  // Wait for login response (200 status) AND click the login button
  await Promise.all([
    page.waitForResponse((response) => 
      response.url().includes("/api/auth/login") && response.status() === 200
    ),
    page.click('button:has-text("Login")'),
  ]);

  // 6️⃣ Wait for home page and verify
  await page.waitForURL("http://localhost:5173/home", { timeout: 20000 });
  await expect(page.locator('[data-testid="welcome-message"]')).toContainText(
    `Hello, ${randomUsername}` // Check against the dynamic username
  );

  // 7️⃣ Logout
  await page.click('button:has-text("Logout")');
  await page.waitForURL("http://localhost:5173/login", { timeout: 20000 });
});