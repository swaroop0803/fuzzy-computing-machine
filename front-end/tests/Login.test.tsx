// --- 1. Import the tools we need ---
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
// import "@testing-library/jest-dom/vitest"

// --- 2. Import the components we are testing ---
import Login from '/Users/kakumanulouisbabu/Desktop/Tech/web-development/React/DEMO/front-end/src/pages/Login.tsx';
import Home from '/Users/kakumanulouisbabu/Desktop/Tech/web-development/React/DEMO/front-end/src/pages/Home.tsx'; // We need this to verify navigation to the home page

// --- 3. Import our mock server setup ---
import { server } from '/Users/kakumanulouisbabu/Desktop/Tech/web-development/React/DEMO/front-end/src/mocks/server.ts';
import { afterAll, afterEach, beforeAll, describe, expect, test } from 'vitest';


// --- 4. Set up the rules for our test environment ---
beforeAll(() => server.listen());
afterEach(() => {
  server.resetHandlers();
  localStorage.clear(); // Clear localStorage after each test
});
afterAll(() => server.close());


// --- 5. The Test Show! ---
describe('The Login Page Show', () => {

  // --- SCENE 1: A user successfully logs in ---
  test('should let a user log in and then show the home page', async () => {
    // ARRANGE: Set the stage with the Login and Home pages.
    render(
      <MemoryRouter initialEntries={['/login']}>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/home" element={<Home />} />
        </Routes>
      </MemoryRouter>
    );

    // ACT: The robot user types in the CORRECT credentials.
    await userEvent.type(screen.getByLabelText(/Email/i), 'test@example.com');
    await userEvent.type(screen.getByLabelText(/Password/i), 'password123');
    
    // The robot clicks the "Login" button.
    await userEvent.click(screen.getByRole('button', { name: /Login/i }));

    // ASSERT: We check if the final scene is correct.
    // We wait and expect to see the welcome message on the Home page.
    await waitFor(async () => {
      expect(await screen.findByText(/Welcome/i )).toBeInTheDocument()
      const welcomeMessage = screen.getByTestId('welcome-message');
  
  // ...then check its content. This handles nested tags perfectly.
  expect(welcomeMessage).toHaveTextContent('Hello, TestUser!')
    });

    // We also check if the "VIP pass" (token) was stored correctly.
    expect(localStorage.getItem('token')).toBe('fake-jwt-token');
    expect(localStorage.getItem('username')).toBe('TestUser');
  });


  // --- SCENE 2: A user tries to log in with the wrong password ---
  test('should show an error message with incorrect credentials', async () => {
    // ARRANGE: Set the stage with just the Login page.
    render(
      <MemoryRouter>
        <Login />
      </MemoryRouter>
    );

    // ACT: The robot user types in the WRONG password.
    await userEvent.type(screen.getByLabelText(/Email/i), 'test@example.com');
    await userEvent.type(screen.getByLabelText(/Password/i), 'wrongpassword');

    // The robot clicks the button.
    await userEvent.click(screen.getByRole('button', { name: /Login/i }));

    // ASSERT: We check if the correct error message appears.
    // We wait and expect to see the error from our mock server.
    await waitFor(() => {
      expect(screen.getByText(/Invalid email or password/i)).toBeInTheDocument();
    });
  });


  // --- SCENE 3: A user tries to submit an empty form ---
  test('should show a validation error if fields are empty', async () => {
    // ARRANGE: Set the stage.
    render(
      <MemoryRouter>
        <Login />
      </MemoryRouter>
    );
    
    // ACT: The robot clicks the login button without typing anything.
    await userEvent.click(screen.getByRole('button', { name: /Login/i }));
    
    // ASSERT: We check for the client-side validation message.
    // This is synchronous, so we don't need to wait.
    expect(screen.getByText(/Email and password are required./i)).toBeInTheDocument();
  });
});