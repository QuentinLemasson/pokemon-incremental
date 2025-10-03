# Kaptain's React Template

A modern React + TypeScript + Vite template built with a **feature-first directory architecture**.

## 📚 Documentation

| Document               | Description                                                                    | Link                                      |
| ---------------------- | ------------------------------------------------------------------------------ | ----------------------------------------- |
| **Architecture Guide** | Complete guide to the feature-first architecture, patterns, and best practices | [📖 Architecture](./docs/architecture.md) |
| **Development Guide**  | Setup, workflow, coding standards, and development best practices              | [🛠️ Development](./docs/development.md)   |
| **Testing Guide**      | Comprehensive testing setup with Vitest, React Testing Library, and MSW        | [🧪 Testing](./docs/testing.md)           |
| **Environment Guide**  | Environment configuration, variables, and deployment settings                  | [🌍 Environment](./docs/environment.md)   |
| **Contributing Guide** | How to contribute, code standards, and pull request process                    | [🤝 Contributing](./docs/contributing.md) |
| **Deployment Guide**   | Container setup, Docker/Podman configuration, and deployment strategies        | [🚀 Deployment](./docs/deployment.md)     |

## 🏗️ Architecture Overview

This project uses a modern feature-first directory structure that organizes code by business features rather than technical concerns.

### Directory Structure

```
src/
├── app/                    # Application layer
│   ├── components/        # App-level components
│   ├── hooks/            # App-level hooks
│   ├── services/         # App-level services
│   └── store/            # Global state management
│
├── common/               # Shared layer (reusable across features)
│   ├── components/       # Generic custom components
│   ├── ui/              # Shadcn UI components
│   ├── hooks/           # Generic hooks
│   ├── utils/           # Utility functions
│   ├── services/        # Shared services
│   └── types/           # Shared type definitions
│
├── features/            # Feature modules
│   └── welcome/         # Welcome feature
│       ├── components/  # Feature-specific components
│       ├── hooks/       # Feature-specific hooks
│       ├── services/   # Feature-specific services
│       └── types/      # Feature-specific types
│
└── assets/             # Static assets
```

### Key Principles

1. **Feature Isolation**: Each feature is self-contained with its own components, logic, and dependencies
2. **Barrel Exports**: Each layer exports its public API through `index.ts` files
3. **Clear Boundaries**: No direct dependencies between features
4. **Reusability**: Common layer contains truly reusable code

### Layer Responsibilities

- **`app/`**: Application orchestration, routing, global state, app configuration
- **`common/`**: Generic, reusable components and utilities (no business logic)
  - **`common/ui/`**: Shadcn UI components and design system components
  - **`common/components/`**: Custom generic components
- **`features/`**: Business features with domain-specific logic and components

## 🚀 Quick Start

### Prerequisites

- Node.js 18+
- npm or yarn
- Docker or Podman (optional)

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

### Development Scripts

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

# Container Development
npm run docker:dev      # Development with Docker
npm run podman:dev      # Development with Podman
```

## 🎯 Architecture Benefits

- **Scalability**: Easy to add new features without affecting existing ones
- **Team Collaboration**: Teams can work on different features independently
- **Code Discovery**: Related code is co-located
- **Maintainability**: Clear boundaries and responsibilities
- **Testing**: Feature-level testing is straightforward
- **Code Splitting**: Natural boundaries for lazy loading

## 📝 Import Guidelines

```typescript
// ✅ Use barrel exports
import { Button } from '@/common';
import { WelcomeMessage } from '@/features/welcome';

// ❌ Avoid direct imports
import { Button } from '@/common/components/Button';
```

## 🛠️ Technical Stack

- **React 19** - UI library
- **TypeScript** - Type safety
- **Vite** - Build tool and dev server
- **Tailwind CSS** - Styling
- **Shadcn/ui** - Component library
- **Vitest** - Testing framework
- **MSW** - API mocking
- **Docker/Podman** - Containerization

## 📋 Features

- ✅ **Feature-first architecture** for scalable development
- ✅ **TypeScript** for type safety and better DX
- ✅ **Testing setup** with Vitest and React Testing Library
- ✅ **API mocking** with MSW for development and testing
- ✅ **Environment configuration** with type-safe settings
- ✅ **Container support** for Docker and Podman
- ✅ **Code quality** with ESLint and Prettier
- ✅ **Comprehensive documentation** for all aspects
- ✅ **Shadcn/ui components** for modern UI development
- ✅ **Tailwind CSS** for utility-first styling

## 🤝 Contributing

We welcome contributions! Please see our [Contributing Guide](./docs/contributing.md) for details on how to get started.

### Development Workflow

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests for new features
5. Run the test suite
6. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🔗 Links

- [Architecture Guide](./docs/architecture.md) - Complete architecture documentation
- [Development Guide](./docs/development.md) - Development setup and workflow
- [Testing Guide](./docs/testing.md) - Testing setup and best practices
- [Environment Guide](./docs/environment.md) - Environment configuration
- [Contributing Guide](./docs/contributing.md) - How to contribute
- [Deployment Guide](./docs/deployment.md) - Container setup and deployment

---

**Built with ❤️ using feature-first architecture - Ready to use React template**
