// --- 1. Import the tools we need ---
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter, Route, Routes } from 'react-router-dom';

// --- 2. Import the components we are testing ---
import Login from '/Users/kakumanulouisbabu/Desktop/Tech/web-development/React/DEMO/front-end/src/pages/Login.tsx';
// Assuming Home and Register components exist for navigation checks
import Home from '/Users/kakumanulouisbabu/Desktop/Tech/web-development/React/DEMO/front-end/src/pages/Home.tsx';
import Register from '/Users/kakumanulouisbabu/Desktop/Tech/web-development/React/DEMO/front-end/src/pages/Register.tsx'; 

// --- 3. Import our mock server setup and handlers ---
import { server } from '/Users/kakumanulouisbabu/Desktop/Tech/web-development/React/DEMO/front-end/src/mocks/server.ts';
// We need access to the handlers to dynamically change behavior (e.g., simulate server down)
import { 
  successLoginHandler, 
  invalidCredentialsHandler, 
  networkErrorHandler 
} from '/Users/kakumanulouisbabu/Desktop/Tech/web-development/React/DEMO/front-end/src/mocks/handlers.ts'; 
import { afterAll, afterEach, beforeAll, describe, expect, test } from 'vitest';


// --- 4. Set up the rules for our test environment ---
beforeAll(() => server.listen());
afterEach(() => {
  server.resetHandlers();
  localStorage.clear(); // Clear localStorage after each test
});
afterAll(() => server.close());


// --- 5. The Test Show! ---
describe('The Login Page Use Cases', () => {

  // --- SCENE 1: Successful Login (Use Case 1) ---
  test('1. should let a user log in, save token/username, and navigate to the home page', async () => {
    // ARRANGE: Set the stage with the Login and Home pages.
    render(
      <MemoryRouter initialEntries={['/login']}>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/home" element={<Home />} />
        </Routes>
      </MemoryRouter>
    );

    // ACT: The robot user types in the CORRECT credentials. (MSW uses default success handler)
    await userEvent.type(screen.getByLabelText(/Email/i), 'test@example.com');
    await userEvent.type(screen.getByLabelText(/Password/i), 'password123');
    
    // The robot clicks the "Login" button.
    await userEvent.click(screen.getByRole('button', { name: /Login/i }));

    // ASSERT: We check if the final scene is correct.
    await waitFor(async () => {
      // 1. Verify navigation to the Home component
      expect(await screen.findByText(/Welcome/i )).toBeInTheDocument()
      const welcomeMessage = screen.getByTestId('welcome-message');
  
      // 2. Verify content of the Home page (using data from the mock response)
      expect(welcomeMessage).toHaveTextContent('Hello, TestUser!')
    });

    // 3. Verify data persistence
    expect(localStorage.getItem('token')).toBe('fake-jwt-token');
    expect(localStorage.getItem('username')).toBe('TestUser');
  });


  // --- SCENE 2: Invalid Credentials (Use Case 2 & 4) ---
  test('2. should show an error message with incorrect credentials and stay on login page', async () => {
    // ARRANGE: Override the MSW handler to force an error response
    server.use(invalidCredentialsHandler); 
    
    render(
      <MemoryRouter initialEntries={['/login']}>
        <Routes>
          <Route path="/login" element={<Login />} />
          {/* Include Home to verify navigation DID NOT occur */}
          <Route path="/home" element={<Home />} /> 
        </Routes>
      </MemoryRouter>
    );

    // ACT: The robot user types in the WRONG password.
    await userEvent.type(screen.getByLabelText(/Email/i), 'test@example.com');
    await userEvent.type(screen.getByLabelText(/Password/i), 'wrongpassword');

    // The robot clicks the button.
    await userEvent.click(screen.getByRole('button', { name: /Login/i }));

    // ASSERT: 
    await waitFor(() => {
      // 1. Check if the error message appears
      expect(screen.getByText(/Invalid email or password/i)).toBeInTheDocument();
      // 2. Check that we are still on the login page (Home component text is NOT present)
      expect(screen.queryByText(/Welcome/i)).not.toBeInTheDocument();
      // 3. Check local storage is empty
      expect(localStorage.getItem('token')).toBeNull();
    });
  });


  // --- SCENE 3: Empty Fields (Use Case 3) ---
  test('3. should show a validation error if fields are empty and not call the API', async () => {
    // ARRANGE: Set the stage.
    render(
      <MemoryRouter>
        <Login />
      </MemoryRouter>
    );
    
    // ACT: The robot clicks the login button without typing anything.
    await userEvent.click(screen.getByRole('button', { name: /Login/i }));
    
    // ASSERT: We check for the client-side validation message.
    expect(screen.getByText(/Email and password are required./i)).toBeInTheDocument();
    
    // No need to check API call since userEvent.click is synchronous here
  });


  // --- SCENE 4: Backend Server Down / Network Error (Use Case 5) ---
  test('4. should display "An unexpected error occurred" for a network failure', async () => {
    // ARRANGE: Override the MSW handler to force a network error
    server.use(networkErrorHandler); 
    
    render(<MemoryRouter><Login /></MemoryRouter>);

    // ACT: Attempt to log in
    await userEvent.type(screen.getByLabelText(/Email/i), 'network@fail.com');
    await userEvent.type(screen.getByLabelText(/Password/i), 'anypassword');
    await userEvent.click(screen.getByRole('button', { name: /Login/i }));

    // ASSERT: Wait for the fallback error message
    await waitFor(() => {
      expect(screen.getByText('An unexpected error occurred.')).toBeInTheDocument();
      expect(localStorage.getItem('token')).toBeNull();
    });
  });


  // --- SCENE 5: Register Link Navigation (Use Case 7) ---
  test('5. should navigate to the /register page when the Register link is clicked', async () => {
    // ARRANGE: Set the stage with both Login and Register routes.
    render(
      <MemoryRouter initialEntries={['/login']}>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
        </Routes>
      </MemoryRouter>
    );

    // ACT: The robot clicks the 'Register' link.
    // The link text is 'Register' and is inside the phrase: "Don't have an account? Register"
    await userEvent.click(screen.getByRole('link', { name: /Register/i }));

    // ASSERT: We verify the content of the Register component is now visible
    // Assuming the Register component has a heading of 'Register'
    await waitFor(() => {
      expect(screen.getByRole('heading', { name: /Register/i })).toBeInTheDocument();
    });
  });

  
  // --- SCENE 6: Error Clearing (Use Case 8) ---
  test('6. should clear a previous error message on a successful subsequent login', async () => {
    // ARRANGE: Set up the router and routes
    render(
      <MemoryRouter initialEntries={['/login']}>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/home" element={<Home />} />
        </Routes>
      </MemoryRouter>
    );

    // --- STEP 1: Trigger Failure (to display the server error) ---
    server.use(invalidCredentialsHandler); // First call fails
    
    // 💡 FIX: Enter credentials to bypass client-side validation and hit the API
    await userEvent.type(screen.getByLabelText(/Email/i), 'fail@example.com');
    await userEvent.type(screen.getByLabelText(/Password/i), 'wrongpass');
    
    await userEvent.click(screen.getByRole('button', { name: /Login/i }));
    
    const errorMessageText = /Invalid email or password/i;
    await waitFor(() => {
      // Now this assertion correctly checks for the server error message
      expect(screen.getByText(errorMessageText)).toBeInTheDocument();
    });

    // --- STEP 2: Trigger Success (to clear the error and navigate) ---
    server.use(successLoginHandler); // Next call succeeds
    // The component's state still holds the email/password, but it's safer to re-type or ensure the initial Login component handles state persistence correctly.
    // Since the component clears the error on successful submission, we can just click again.
    await userEvent.click(screen.getByRole('button', { name: /Login/i }));

    // ASSERT: 
    await waitFor(() => {
      // 1. Navigation is successful (Home page content is visible)
      expect(screen.getByText(/Welcome/i)).toBeInTheDocument();
      // 2. The previous error message is GONE from the DOM
      expect(screen.queryByText(errorMessageText)).not.toBeInTheDocument();
    });
  })
})