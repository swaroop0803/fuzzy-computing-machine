// src/mocks/server.ts

import { setupServer } from 'msw/node';
import { handlers } from './handlers';

// This creates the mock server using the handlers (the script) you wrote.
export const server = setupServer(...handlers);