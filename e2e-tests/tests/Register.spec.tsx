// tests/register.spec.ts
import { test, expect } from "@playwright/test";

const registrationApiUrl = "http://localhost:5001/api/auth/register";
const frontendUrl = "http://localhost:5173";

test("should successfully register a unique user and redirect to login", async ({ page }) => {
  // Generate unique credentials for this test
  const randomUsername = `regtest_${Date.now().toString().slice(-4)}`;
  const randomEmail = `${randomUsername}@example.com`;
  const password = "testpassword123";

  await page.goto(`${frontendUrl}/register`);
  
  // Fill registration form
  await page.fill("#username", randomUsername);
  await page.fill("#email", randomEmail);
  await page.fill("#password", password);

  // Wait for the successful API response AND click the button
  const [response] = await Promise.all([
    // Expect a 201 Created status from the registration API
    page.waitForResponse(
      (response) =>
        response.url().includes(registrationApiUrl) && response.status() === 201,
      { timeout: 20000 }
    ),
    // Trigger the form submission
    page.click('button:has-text("Create an account")'),
  ]);

  // Verification
  expect(response.status()).toBe(201); 
  
  // Verify the redirect to the Login page
  await page.waitForURL(`${frontendUrl}/login`);
  await expect(page.locator('h2, h1, [role="heading"]')).toContainText("Login");
});