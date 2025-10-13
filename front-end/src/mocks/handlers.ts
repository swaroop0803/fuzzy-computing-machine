import { http, HttpResponse } from 'msw';

const API_URL = 'http://localhost:5001/api/auth';

export const handlers = [
  // --- This is the WORKING register handler from your old file ---
  http.post(`${API_URL}/register`, async ({ request }) => {
    const newUser = await request.json() as { email: string };

    if (!newUser) {
      return HttpResponse.json({ message: 'Request body is missing' }, { status: 400 });
    }

    // This logic is needed for your "duplicate email" test
    if (newUser.email === 'duplicate@example.com') {
      return HttpResponse.json(
        { message: 'Error: Email is already registered.' },
        { status: 400 }
      );
    }

    // This is needed for your "successful registration" test
    return HttpResponse.json(
      { message: 'User registered successfully!' },
      { status: 201 }
    );
  }),

  // --- This is the new, smarter LOGIN handler ---
  http.post(`${API_URL}/login`, async ({ request }) => {
    const credentials = await request.json() as { email?: string, password?: string };

    // This logic is needed for your "successful login" test
    if (credentials.email === 'test@example.com' && credentials.password === 'password123') {
      return HttpResponse.json({
        token: 'fake-jwt-token',
        username: 'TestUser',
      });
    }

    // This is needed for your "failed login" test
    return HttpResponse.json(
      { message: 'Invalid email or password' },
      { status: 401 }
    );
  }),
];