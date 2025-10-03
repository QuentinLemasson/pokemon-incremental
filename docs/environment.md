# Environment Configuration

## Overview

This guide explains how to configure environment variables and application settings for different deployment environments.

## Environment Files

### File Hierarchy

```
.env                    # Default values (committed)
.env.local             # Local overrides (ignored by git)
.env.development       # Development environment
.env.production        # Production environment
.env.example           # Template file (committed)
```

### File Priority

1. `.env.local` (highest priority)
2. `.env.development` / `.env.production`
3. `.env` (lowest priority)

## Configuration Setup

### Environment Variables Template

Create `.env.example`:

```bash
# API Configuration
VITE_API_URL=http://localhost:3001
VITE_API_TIMEOUT=10000

# Features
VITE_ENABLE_MOCKING=true
VITE_ENABLE_DEBUG=false
```

### Type-Safe Configuration

Create `src/app/config/env.ts`:

```typescript
import pkg from '../../../package.json' with { type: 'json' };

export const config = {
  // API Configuration
  apiUrl: import.meta.env.VITE_API_URL || 'http://localhost:3001',
  apiTimeout: Number(import.meta.env.VITE_API_TIMEOUT) || 10000,

  // App Configuration (from package.json)
  appName: pkg.displayName || pkg.name || 'Kaptain\'s React Template',
  appVersion: pkg.version || '1.0.0',
  appDescription: pkg.description || 'Modern React Template',

  // Environment
  environment: import.meta.env.MODE,
  isDevelopment: import.meta.env.DEV,
  isProduction: import.meta.env.PROD,

  // Features
  enableMocking: import.meta.env.VITE_ENABLE_MOCKING === 'true',
  enableDebug: import.meta.env.VITE_ENABLE_DEBUG === 'true',
} as const;

export type Config = typeof config;

// Validation
export const validateConfig = () => {
  const required = ['apiUrl'] as const;

  for (const key of required) {
    if (!config[key]) {
      throw new Error(`Missing required environment variable: ${key}`);
    }
  }

  return true;
};
```

## Environment-Specific Configurations

### Development Environment

Create `.env.development`:

```bash
# Development-specific settings
VITE_API_URL=http://localhost:3001
VITE_ENABLE_MOCKING=true
VITE_ENABLE_DEBUG=true
```

### Production Environment

Create `.env.production`:

```bash
# Production-specific settings
VITE_API_URL=https://api.example.com
VITE_ENABLE_MOCKING=false
VITE_ENABLE_DEBUG=false
```

### Local Overrides

Create `.env.local` (not committed):

```bash
# Local development overrides
VITE_API_URL=http://localhost:3001
VITE_ENABLE_MOCKING=true
```

## Usage Examples

### In Components

```typescript
import { config } from '@/app/config/env';

export const ApiClient = () => {
  const apiUrl = config.apiUrl;
  const timeout = config.apiTimeout;

  // Use configuration
  return fetch(`${apiUrl}/data`, { timeout });
};
```

### In Services

```typescript
import { config } from '@/app/config/env';

export class AuthService {
  private baseUrl = config.apiUrl;
  private clientId = config.authClientId;

  async login(credentials: LoginCredentials) {
    // Use configuration
    return fetch(`${this.baseUrl}/auth/login`, {
      method: 'POST',
      body: JSON.stringify(credentials),
    });
  }
}
```

### Feature Flags

```typescript
import { config } from '@/app/config/env';

export const FeatureFlags = {
  isAnalyticsEnabled: () => config.enableAnalytics,
  isMockingEnabled: () => config.enableMocking,
  isDebugEnabled: () => config.enableDebug,
};
```

## Docker Environment

### Dockerfile Environment

```dockerfile
# Set environment variables in Dockerfile
ENV VITE_API_URL=https://api.example.com
ENV VITE_ENABLE_ANALYTICS=true
ENV VITE_ENABLE_MOCKING=false
```

### Docker Compose

```yaml
# docker-compose.yml
version: '3.8'
services:
  kaptain-react-template:
    build: .
    environment:
      - VITE_API_URL=https://api.example.com
      - VITE_ENABLE_ANALYTICS=true
    env_file:
      - .env.production
```

## Security Considerations

### Sensitive Data

- Never commit sensitive data to version control
- Use `.env.local` for local secrets
- Use secure secret management in production
- Validate all environment variables

### Public Variables

- Only variables prefixed with `VITE_` are exposed to the client
- Never put secrets in `VITE_` variables
- Use server-side configuration for sensitive data

## Validation and Error Handling

### Runtime Validation

```typescript
// src/app/config/validation.ts
export const validateEnvironment = () => {
  const errors: string[] = [];

  // Required variables
  if (!import.meta.env.VITE_API_URL) {
    errors.push('VITE_API_URL is required');
  }

  // Type validation
  const timeout = Number(import.meta.env.VITE_API_TIMEOUT);
  if (isNaN(timeout) || timeout <= 0) {
    errors.push('VITE_API_TIMEOUT must be a positive number');
  }

  if (errors.length > 0) {
    throw new Error(`Environment validation failed:\n${errors.join('\n')}`);
  }

  return true;
};
```

### Development Warnings

```typescript
// src/app/config/warnings.ts
export const checkDevelopmentWarnings = () => {
  if (import.meta.env.DEV) {
    if (import.meta.env.VITE_ENABLE_MOCKING === 'false') {
      console.warn('Mocking is disabled in development');
    }

    if (import.meta.env.VITE_ENABLE_DEBUG === 'false') {
      console.warn('Debug mode is disabled in development');
    }
  }
};
```

## Best Practices

### 1. Naming Conventions

- Use `VITE_` prefix for client-side variables
- Use descriptive names: `VITE_API_URL` not `VITE_URL`
- Use UPPER_CASE for environment variables

### 2. Default Values

- Always provide sensible defaults
- Use fallbacks for optional variables
- Document required vs optional variables

### 3. Type Safety

- Create typed configuration objects
- Validate types at runtime
- Use TypeScript for better IDE support

### 4. Documentation

- Document all environment variables
- Provide examples in `.env.example`
- Explain the purpose of each variable

### 5. Testing

- Test configuration loading
- Mock environment variables in tests
- Validate configuration in CI/CD

## Troubleshooting

### Common Issues

1. **Variables not loading**: Check file naming and location
2. **Type errors**: Ensure proper type conversion
3. **Missing variables**: Check `.env.example` for required variables
4. **Build issues**: Ensure variables are available at build time

### Debug Configuration

```typescript
// Debug configuration loading
if (import.meta.env.DEV) {
  console.log('Environment configuration:', {
    apiUrl: config.apiUrl,
    environment: config.environment,
    features: {
      analytics: config.enableAnalytics,
      mocking: config.enableMocking,
      debug: config.enableDebug,
    },
  });
}
```

This configuration system provides type-safe, environment-aware settings that work across development, testing, and production environments.
