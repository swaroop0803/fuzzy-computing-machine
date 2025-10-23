// --- 1. Import the tools we need ---
// Tools for rendering and interacting with our component
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
// Tools to simulate browser navigation
import { MemoryRouter, Route, Routes } from 'react-router-dom';

// --- 2. Import the components we are testing ---
import Register from '../src/pages/Register.tsx';
import Login from '../src/pages/Login.tsx'; // We need this to check if navigation works

// --- 3. Import our "stunt double" for the backend ---
import { server } from '../src/mocks/server.ts';
import { afterAll, afterEach, beforeAll, describe, expect, test } from 'vitest';


// --- 4. Set up the rules for our test environment ---
beforeAll(() => server.listen()); // Start the stunt double before all tests
afterEach(() => server.resetHandlers()); // Reset the stunt double's script after each test
afterAll(() => server.close()); // Stop the stunt double after all tests are done


// --- 5. The Test Show! ---
describe('The Register Page', () => {

  // --- SCENE 1: A user successfully registers ---
  test('should let a user register and then show the login page', async () => {
    // ARRANGE: Set the stage. We need the Register and Login pages.
    render(
      <MemoryRouter initialEntries={['/register']}>
        <Routes>
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
        </Routes>
      </MemoryRouter>
    );
    // ACT: The user (our robot) performs actions.
    // The robot types into the form fields.
    await userEvent.type(screen.getByLabelText(/Username/i), 'testuser');
    await userEvent.type(screen.getByLabelText(/Email/i), 'test@example.com');
    await userEvent.type(screen.getByLabelText(/Password/i), 'password123');
    
    // The robot clicks the "Create an account" button.
    await userEvent.click(screen.getByRole('button', { name: /Create an account/i }));

    // ASSERT: We check if the final scene is correct.
    // We wait and expect to see the "Login" heading on the screen.
    await waitFor(() => {
      expect(screen.getByRole('heading', { name: /Login/i })).toBeInTheDocument();
    });
  });


  // --- SCENE 2: A user tries to register with an email that's already taken ---
  test('should show an error if the email is already registered', async () => {
    // ARRANGE: Set the stage with just the Register page.
    render(
      <MemoryRouter>
        <Register />
      </MemoryRouter>
    );

    // ACT: The user types in an email that our stunt double knows is a duplicate.
    await userEvent.type(screen.getByLabelText(/Username/i), 'anotheruser');
    await userEvent.type(screen.getByLabelText(/Email/i), 'duplicate@example.com');
    await userEvent.type(screen.getByLabelText(/Password/i), 'password123');

    // The robot clicks the button.
    await userEvent.click(screen.getByRole('button', { name: /Create an account/i }));

    // ASSERT: We check if the correct error message appears.
    // We wait and expect to see the error message from our stunt double.
    await waitFor(() => {
      expect(screen.getByText(/Error: Email is already registered./i)).toBeInTheDocument();
    });
  });
});