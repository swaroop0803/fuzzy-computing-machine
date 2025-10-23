import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import userEvent from '@testing-library/user-event';
// Update the import path if the Home component is in a different location or has a different filename (e.g., Home.tsx or Home/index.tsx)
import Home from '/Users/kakumanulouisbabu/Desktop/Tech/web-development/React/DEMO/front-end/src/pages/Home.tsx'; // Change this path if needed, e.g., '../components/Home'
import { expect, test , describe } from 'vitest';
import Login from '../src/pages/Login';

describe('Home Page', () => {
test('renders the home page correctly',async () => {
  // Set mock data in localStorage before rendering
  localStorage.setItem('token', 'fake-token');
  localStorage.setItem('username', 'TestUser');

  render(
    <MemoryRouter>
      <Home />
    </MemoryRouter>
  );

  const welcomeMessage = screen.getByTestId('welcome-message');
  
  // ...then check its content. This handles nested tags perfectly.
  expect(welcomeMessage).toHaveTextContent('Hello, TestUser!')
});

test('should ', async () => {
  const user=userEvent.setup()
  render( <MemoryRouter>
      <Home />
    </MemoryRouter>)

    const button = screen.getByRole("button",{ name:/Logout/i} )

    await user.click(button)

    render(<MemoryRouter><Login/></MemoryRouter>)

    expect(screen.getByRole('heading')).toHaveTextContent(/Login/i)
    expect(screen.getByLabelText("Email")).toBeInTheDocument()
    expect(screen.getByLabelText("Password")).toBeInTheDocument()
    expect(screen.getByRole('button', {name:/login/i})).toBeInTheDocument()

})
})