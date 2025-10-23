import { describe, it, expect } from 'vitest';

// Dummy function to test
function add(a: number, b: number) {
  return a + b;
}

function multiply(a: number, b: number) {
  return a * b;
}

describe('Math utilities', () => {
  it('should add two numbers correctly', () => {
    expect(add(2, 3)).toBe(5);
  });

  it('should multiply two numbers correctly', () => {
    expect(multiply(3, 4)).toBe(12);
  });

  it('should handle negative numbers', () => {
    expect(add(-2, 3)).toBe(1);
  });
});