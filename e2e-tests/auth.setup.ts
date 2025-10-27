// // auth.setup.ts
// import { test as setup, expect } from '@playwright/test';

// // Define the API endpoints
// const REGISTER_URL = 'http://localhost:5001/api/auth/register';
// const LOGIN_URL = 'http://localhost:5001/api/auth/login';
// const STORAGE_STATE_FILE = 'playwright-auth-storage.json';

// // Define a placeholder user
// const USERNAME = `auth_test_user_${Date.now().toString().slice(-4)}`;
// const EMAIL = `${USERNAME}@example.com`;
// const PASSWORD = 'TestPassword123';

// setup('authenticate user via API and save state', async ({ page }) => {
//   // 1. Ensure the user exists by registering them (or just log in if you know they exist)
//   console.log(`Setting up user: ${EMAIL}`);
//   const registrationResponse = await page.request.post(REGISTER_URL, {
//     data: {
//       username: USERNAME,
//       email: EMAIL,
//       password: PASSWORD,
//     },
//   });
  
//   // Note: We ignore 409 (Conflict) in case the user was already created.
//   if (registrationResponse.status() !== 201 && registrationResponse.status() !== 409) {
//       throw new Error(`Registration failed with status: ${registrationResponse.status()}`);
//   }

//   // 2. Log in the user via API (Playwright will handle session cookies/tokens)
//   await page.goto('http://localhost:5173/login'); // Navigate to a page to ensure session context is available
  
//   const loginResponse = await page.request.post(LOGIN_URL, {
//     data: {
//       email: EMAIL,
//       password: PASSWORD,
//     },
//   });
//   expect(loginResponse.ok()).toBeTruthy();

//   // 3. Navigate to Home page to ensure the UI has set any necessary local storage/session state
//   await page.goto('http://localhost:5173/home');
  
//   // 4. Save the storage state (cookies, local storage, session storage)
//   // This file will be loaded by all authenticated tests.
//   await page.context().storageState({ path: STORAGE_STATE_FILE });
  
//   console.log(`Authentication state saved to ${STORAGE_STATE_FILE}`);
// });