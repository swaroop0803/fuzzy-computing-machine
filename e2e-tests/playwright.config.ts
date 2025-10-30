import { defineConfig, devices } from "@playwright/test";

export default defineConfig({
  testDir: "./tests", // folder for your E2E test files
  timeout: 30 * 1000,
  expect: { timeout: 5000 },

  // ✅ Reporters
  reporter: [
    ["list"], 
    ["html", { open: "never" }]
  ],

  // ✅ Global settings for all tests
  use: {
    baseURL: "http://127.0.0.1:5173", // Frontend URL (Vite dev server)
    headless: true,
    viewport: { width: 1280, height: 720 },
    actionTimeout: 5000,
    screenshot: "only-on-failure",
    video: "retain-on-failure",
    trace: "on-first-retry",
  },

  // ✅ Browser projects
  projects: [
    {
      name: "chromium",
      use: { ...devices["Desktop Chrome"] },
    },
    {
      name: "firefox",
      use: { ...devices["Desktop Firefox"] },
    },
  ],

  // ✅ Where to store artifacts
  outputDir: "test-results",

  // ✅ Optional: Run frontend server automatically (local dev only)
  // Uncomment this if you want Playwright to start and stop your Vite dev server automatically
  // webServer: {
  //   command: "npm run dev -- --host",
  //   port: 5173,
  //   reuseExistingServer: !process.env.CI, // Reuse local dev server if running
  // },
});
