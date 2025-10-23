// src/mocks/handlers.ts

import { http, HttpResponse } from 'msw';

const API_URL = 'http://localhost:5001/api/auth';
const LOGIN_URL = `${API_URL}/login`;

// 1. Success Login Handler (Used for Use Case 1 and 6)
export const successLoginHandler = http.post(LOGIN_URL, () => {
  return HttpResponse.json({
    token: 'fake-jwt-token',
    username: 'TestUser',
  }, { status: 200 });
});

// 2. Failure Login Handler (Used for Use Case 2 & 4)
export const invalidCredentialsHandler = http.post(LOGIN_URL, () => {
  return HttpResponse.json(
    { message: 'Invalid email or password' },
    { status: 401 }
  );
});

// 3. Network Error Handler (Used for Use Case 5)
// This handler is not explicitly defined in your current file, but needed for a complete test suite.
export const networkErrorHandler = http.post(LOGIN_URL, () => {
  // Returning a plain error tells MSW to simulate a network issue (server down)
  return HttpResponse.error();
});

// 4. Default Handlers (for the initial server.listen() setup)
export const handlers = [
  // Your original register handler
  http.post(`${API_URL}/register`, async ({ request }) => {
    // ... (Your existing register logic remains here) ...
    const newUser = await request.json() as { email: string };

    if (!newUser) {
      return HttpResponse.json({ message: 'Request body is missing' }, { status: 400 });
    }

    if (newUser.email === 'duplicate@example.com') {
      return HttpResponse.json(
        { message: 'Error: Email is already registered.' },
        { status: 400 }
      );
    }

    return HttpResponse.json(
      { message: 'User registered successfully!' },
      { status: 201 }
    );
  }),

  // Use the success handler as the default login handler
  successLoginHandler,
];