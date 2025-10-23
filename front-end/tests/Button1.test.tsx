import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import React from 'react';

// Dummy Button Component
function Button({ onClick, children }: { onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      onClick={onClick}
      className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
    >
      {children}
    </button>
  );
}

describe('Button Component', () => {
  it('renders with correct text', () => {
    render(<Button onClick={() => {}}>Click Me</Button>);
    expect(screen.getByText('Click Me')).toBeInTheDocument();
  });

  it('calls onClick handler when clicked', () => {
    const mockClick = vi.fn();
    render(<Button onClick={mockClick}>Press</Button>);
    fireEvent.click(screen.getByText('Press'));
    expect(mockClick).toHaveBeenCalledTimes(1);
  });
});