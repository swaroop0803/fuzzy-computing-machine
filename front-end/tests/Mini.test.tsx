import { describe, expect, test, beforeAll } from 'vitest';
// Note: 'screen' and matchers like toBeInTheDocument require
// the testing library setup in your Vitest config.
import '@testing-library/jest-dom/vitest'; 
// screen is generally available globally when using the 'jsdom' environment.
import { screen } from '@testing-library/dom'; 

describe('Minimal UI Checks for CI', () => {

    // Set up a basic DOM structure before running tests
    beforeAll(() => {
        document.body.innerHTML = `
            <h1 data-testid="app-title">Hello World App</h1>
            <p id="status-message">Load Successful</p>
        `;
    });

    test('should find the title element and be in the document', () => {
        // Find by data-testid
        const titleElement = screen.getByTestId('app-title');
        
        // Assertion 1: Check existence
        expect(titleElement).toBeInTheDocument();
        
        // Assertion 2: Check content
        expect(titleElement).toHaveTextContent('Hello World App');
    });

    test('should find the status message element', () => {
        // Find by ID and check existence
        const statusElement = document.getElementById('status-message');
        
        // Assertion 1: Check existence (using the testing library matcher)
        expect(statusElement).toBeInTheDocument();
    });
});
