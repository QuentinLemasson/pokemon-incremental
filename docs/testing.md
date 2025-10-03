# Testing Guide

## Overview

This project uses a comprehensive testing setup with Vitest, React Testing Library, and MSW for API mocking.

## Testing Stack

- **Vitest**: Fast unit test runner
- **React Testing Library**: Component testing utilities
- **MSW (Mock Service Worker)**: API mocking
- **jsdom**: DOM environment for tests

## Setup

### Installation

```bash
npm install --save-dev vitest @testing-library/react @testing-library/jest-dom @testing-library/user-event jsdom msw
```

### Configuration Files

**vitest.config.ts**

```typescript
import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['./src/test/setup.ts'],
    css: true,
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
});
```

**src/test/setup.ts**

```typescript
import '@testing-library/jest-dom';
import { beforeAll, afterEach, afterAll } from 'vitest';
import { server } from './mocks/server';

// Start server before all tests
beforeAll(() => server.listen());

// Reset handlers after each test
afterEach(() => server.resetHandlers());

// Clean up after all tests
afterAll(() => server.close());
```

## Test Structure

### Directory Organization

```
src/
├── test/
│   ├── setup.ts
│   └── mocks/
│       ├── server.ts
│       ├── browser.ts
│       └── handlers.ts
├── features/
│   └── welcome/
│       ├── components/
│       │   ├── WelcomeMessage.tsx
│       │   └── __tests__/
│       │       └── WelcomeMessage.test.tsx
│       ├── hooks/
│       │   ├── useWelcome.ts
│       │   └── __tests__/
│       │       └── useWelcome.test.ts
│       └── services/
│           ├── welcomeApi.ts
│           └── __tests__/
│               └── welcomeApi.test.ts
```

## Testing Patterns

### Component Testing

```typescript
// src/features/welcome/components/__tests__/WelcomeMessage.test.tsx
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi } from 'vitest';
import { WelcomeMessage } from '../WelcomeMessage';

describe('WelcomeMessage', () => {
  it('renders welcome message with app name', () => {
    render(<WelcomeMessage />);

    expect(screen.getByRole('heading', { level: 1 })).toBeInTheDocument();
    expect(screen.getByText(/Test Button/)).toBeInTheDocument();
  });

  it('displays version information', () => {
    render(<WelcomeMessage />);

    expect(screen.getByText(/v\d+\.\d+\.\d+/)).toBeInTheDocument();
  });

  it('handles button click', async () => {
    const user = userEvent.setup();
    const mockClick = vi.fn();

    render(<WelcomeMessage onButtonClick={mockClick} />);

    await user.click(screen.getByRole('button'));
    expect(mockClick).toHaveBeenCalledOnce();
  });
});
```

### Hook Testing

```typescript
// src/features/welcome/hooks/__tests__/useWelcome.test.ts
import { renderHook } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { useWelcome } from '../useWelcome';

describe('useWelcome', () => {
  it('returns welcome data', () => {
    const { result } = renderHook(() => useWelcome());

    expect(result.current.message).toBeDefined();
    expect(result.current.version).toBeDefined();
    expect(result.current.contributors).toBeInstanceOf(Array);
  });

  it('handles loading state', () => {
    const { result } = renderHook(() => useWelcome());

    expect(result.current.isLoading).toBe(false);
  });
});
```

### Service Testing

```typescript
// src/features/welcome/services/__tests__/welcomeApi.test.ts
import { describe, it, expect, vi } from 'vitest';
import { welcomeApi } from '../welcomeApi';

// Mock the API
vi.mock('@/common/services/apiClient', () => ({
  apiClient: {
    get: vi.fn(),
  },
}));

describe('welcomeApi', () => {
  it('fetches welcome data', async () => {
    const mockData = { message: 'Welcome', version: '1.0.0' };
    const { apiClient } = await import('@/common/services/apiClient');

    vi.mocked(apiClient.get).mockResolvedValue({ data: mockData });

    const result = await welcomeApi.getWelcomeData();

    expect(result).toEqual(mockData);
    expect(apiClient.get).toHaveBeenCalledWith('/api/welcome');
  });
});
```

## MSW Setup

### API Mocking

```typescript
// src/test/mocks/handlers.ts
import { http, HttpResponse } from 'msw';

export const handlers = [
  // Health check
  http.get('/api/health', () => {
    return HttpResponse.json({ status: 'ok' });
  }),

  // User API
  http.get('/api/user', () => {
    return HttpResponse.json({
      id: 1,
      name: 'Test User',
      email: 'test@example.com',
    });
  }),

  // Welcome API
  http.get('/api/welcome', () => {
    return HttpResponse.json({
      message: 'Welcome to Kaptain\'s React Template',
      version: '1.0.0',
      contributors: ['Developer 1', 'Developer 2'],
    });
  }),
];
```

### Browser Setup

```typescript
// src/test/mocks/browser.ts
import { setupWorker } from 'msw/browser';
import { handlers } from './handlers';

export const worker = setupWorker(...handlers);
```

### Development Integration

```typescript
// src/main.tsx
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './app/components/App';

// MSW setup for development
if (import.meta.env.DEV && import.meta.env.VITE_ENABLE_MOCKING === 'true') {
  const { worker } = await import('./test/mocks/browser');
  await worker.start();
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>
);
```

## Test Commands

### Running Tests

```bash
# Run all tests
npm run test

# Run tests in watch mode
npm run test -- --watch

# Run tests with UI
npm run test:ui

# Run tests with coverage
npm run test:coverage

# Run tests once (CI mode)
npm run test:run
```

### Test Filtering

```bash
# Run tests for specific feature
npm run test src/features/welcome

# Run tests matching pattern
npm run test -- --grep "WelcomeMessage"

# Run tests in specific file
npm run test src/features/welcome/components/__tests__/WelcomeMessage.test.tsx
```

## Testing Best Practices

### 1. Test Structure

- Use `describe` blocks to group related tests
- Use descriptive test names
- Follow AAA pattern: Arrange, Act, Assert

### 2. Component Testing

- Test user interactions, not implementation details
- Use semantic queries (getByRole, getByLabelText)
- Test accessibility features
- Mock external dependencies

### 3. Hook Testing

- Use `renderHook` for custom hooks
- Test all hook states and transitions
- Mock dependencies appropriately

### 4. Service Testing

- Mock external API calls
- Test error handling
- Test loading states
- Use MSW for consistent mocking

### 5. Integration Testing

- Test feature workflows
- Test component interactions
- Test API integration
- Use real data when possible

## Coverage Goals

### Target Coverage

- **Statements**: 80%+
- **Branches**: 70%+
- **Functions**: 80%+
- **Lines**: 80%+

### Coverage Reports

```bash
# Generate coverage report
npm run test:coverage

# View coverage in browser
open coverage/index.html
```

## Debugging Tests

### VS Code Integration

```json
// .vscode/launch.json
{
  "version": "0.2.0",
  "configurations": [
    {
      "name": "Debug Tests",
      "type": "node",
      "request": "launch",
      "program": "${workspaceFolder}/node_modules/vitest/vitest.mjs",
      "args": ["run", "--reporter=verbose"],
      "console": "integratedTerminal"
    }
  ]
}
```

### Debugging Tips

- Use `screen.debug()` to see DOM structure
- Use `console.log` for debugging
- Check test environment setup
- Verify mocks are working correctly

## Common Issues

### 1. Import Errors

- Check path aliases in `vitest.config.ts`
- Ensure test files are in correct locations
- Verify import paths

### 2. Mock Issues

- Check MSW handlers are properly configured
- Verify mock data structure
- Ensure handlers are reset between tests

### 3. DOM Issues

- Check jsdom environment is set
- Verify testing library setup
- Check for missing DOM elements

This testing setup provides comprehensive coverage while maintaining good developer experience and performance.
