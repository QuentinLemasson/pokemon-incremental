# Development Guide

## Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn
- Git

### Installation

```bash
# Clone the repository
git clone <repository-url>
cd kaptain-react-template

# Install dependencies
npm install

# Start development server
npm run dev
```

The application will be available at `http://localhost:5173`

## Development Scripts

### Core Commands

```bash
# Development
npm run dev              # Start development server
npm run build           # Build for production
npm run preview         # Preview production build

# Code Quality
npm run lint            # Run ESLint
npm run format          # Format code with Prettier
npm run format:check    # Check code formatting

# Testing
npm run test            # Run tests
npm run test:ui         # Run tests with UI
npm run test:coverage   # Run tests with coverage
npm run test:run        # Run tests once (CI mode)

# Type Checking
npm run type-check      # TypeScript type checking
```

### Container Commands

```bash
# Docker
npm run docker:build    # Build Docker image
npm run docker:run      # Run Docker container
npm run docker:dev      # Development with Docker

# Podman
npm run podman:build    # Build Podman image
npm run podman:run      # Run Podman container
npm run podman:dev      # Development with Podman
npm run podman:compose  # Use podman-compose
```

## Development Workflow

### 1. Feature Development

```bash
# Create a new feature
mkdir src/features/new-feature
mkdir src/features/new-feature/{components,hooks,services,types}

# Add barrel exports
touch src/features/new-feature/index.ts
```

### 2. Component Development

```bash
# Create a new component
touch src/features/new-feature/components/NewComponent.tsx
touch src/features/new-feature/components/__tests__/NewComponent.test.tsx
```

### 3. Testing

```bash
# Run tests for specific feature
npm run test src/features/welcome

# Run tests in watch mode
npm run test -- --watch

# Run tests with coverage
npm run test:coverage
```

## Code Standards

### File Naming

- Components: `PascalCase.tsx` (e.g., `WelcomeMessage.tsx`)
- Hooks: `camelCase.ts` (e.g., `useWelcome.ts`)
- Utilities: `camelCase.ts` (e.g., `formatDate.ts`)
- Types: `camelCase.types.ts` (e.g., `user.types.ts`)

### Import Order

```typescript
// 1. React imports
import React from 'react';
import { useState, useEffect } from 'react';

// 2. Third-party imports
import { Button } from '@radix-ui/react-button';
import axios from 'axios';

// 3. Internal imports (app layer)
import { useAuth } from '@/app/hooks/useAuth';

// 4. Common layer imports
import { Button } from '@/common';

// 5. Feature imports
import { WelcomeMessage } from '@/features/welcome';

// 6. Relative imports
import { useLocalState } from './hooks/useLocalState';
```

### Component Structure

```typescript
// Component with proper structure
import React from 'react';
import { Button } from '@/common';

interface WelcomeMessageProps {
  title: string;
  onAction?: () => void;
}

export const WelcomeMessage: React.FC<WelcomeMessageProps> = ({
  title,
  onAction,
}) => {
  return (
    <div>
      <h1>{title}</h1>
      {onAction && <Button onClick={onAction}>Action</Button>}
    </div>
  );
};
```

## Testing Guidelines

### Test Structure

```
src/features/welcome/
├── components/
│   ├── WelcomeMessage.tsx
│   └── __tests__/
│       └── WelcomeMessage.test.tsx
├── hooks/
│   ├── useWelcome.ts
│   └── __tests__/
│       └── useWelcome.test.ts
└── services/
    ├── welcomeApi.ts
    └── __tests__/
        └── welcomeApi.test.ts
```

### Test Examples

```typescript
// Component test
import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { WelcomeMessage } from '../WelcomeMessage';

describe('WelcomeMessage', () => {
  it('renders welcome message', () => {
    render(<WelcomeMessage title="Welcome" />);
    expect(screen.getByText('Welcome')).toBeInTheDocument();
  });
});

// Hook test
import { renderHook } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { useWelcome } from '../useWelcome';

describe('useWelcome', () => {
  it('returns welcome data', () => {
    const { result } = renderHook(() => useWelcome());
    expect(result.current.message).toBeDefined();
  });
});
```

## Environment Configuration

### Environment Variables

Create `.env.local` for local development:

```bash
# API Configuration
VITE_API_URL=http://localhost:3001
VITE_API_TIMEOUT=10000

# App Configuration
VITE_APP_NAME=Kaptain's React Template
VITE_APP_VERSION=1.0.0

# Features
VITE_ENABLE_ANALYTICS=false
VITE_ENABLE_MOCKING=true
```

### Configuration Usage

```typescript
import { config } from '@/app/config/env';

// Use configuration
const apiUrl = config.apiUrl;
const isDevelopment = config.isDevelopment;
```

## Debugging

### VS Code Configuration

Create `.vscode/settings.json`:

```json
{
  "typescript.preferences.importModuleSpecifier": "relative",
  "editor.formatOnSave": true,
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": true
  }
}
```

### Debugging Setup

```json
// .vscode/launch.json
{
  "version": "0.2.0",
  "configurations": [
    {
      "name": "Launch Chrome",
      "type": "chrome",
      "request": "launch",
      "url": "http://localhost:5173",
      "webRoot": "${workspaceFolder}/src"
    }
  ]
}
```

## Performance Optimization

### Code Splitting

```typescript
// Lazy load features
const Dashboard = lazy(() => import('@/features/dashboard'));
const Auth = lazy(() => import('@/features/authentication'));
```

### Bundle Analysis

```bash
# Analyze bundle size
npm run build
npx vite-bundle-analyzer dist
```

## Troubleshooting

### Common Issues

1. **Import errors**: Check path aliases in `tsconfig.json`
2. **Type errors**: Run `npm run type-check`
3. **Linting errors**: Run `npm run lint`
4. **Formatting issues**: Run `npm run format`

### Hot Reload Issues

If hot reload isn't working:

1. Check if file is in the correct location
2. Restart development server
3. Clear browser cache

### Container Issues

See [Deployment Guide](./deployment.md) for container-specific troubleshooting.

## Best Practices

### Code Organization

- Keep components small and focused
- Use custom hooks for logic
- Extract utilities to common layer
- Maintain consistent naming

### Performance

- Use React.memo for expensive components
- Implement proper key props for lists
- Avoid unnecessary re-renders
- Use lazy loading for large features

### Security

- Validate all inputs
- Use environment variables for secrets
- Implement proper error boundaries
- Follow OWASP guidelines

This guide should help you develop efficiently while maintaining code quality and following best practices.
