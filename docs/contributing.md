# Contributing Guide

## Getting Started

### Prerequisites

- Node.js 18+
- Git
- Docker or Podman (for containerized development)

### Development Setup

```bash
# Fork and clone the repository
git clone https://github.com/your-username/kaptain-react-template.git
cd kaptain-react-template

# Install dependencies
npm install

# Start development server
npm run dev
```

## Development Workflow

### 1. Feature Development

```bash
# Create a new feature branch
git checkout -b feature/new-feature

# Make your changes
# ... implement feature ...

# Run tests
npm run test

# Check code quality
npm run lint
npm run format:check

# Commit changes
git add .
git commit -m "feat: add new feature"
```

### 2. Code Standards

#### File Naming

- Components: `PascalCase.tsx`
- Hooks: `camelCase.ts`
- Utilities: `camelCase.ts`
- Types: `camelCase.types.ts`

#### Import Order

```typescript
// 1. React imports
import React from 'react';
import { useState } from 'react';

// 2. Third-party imports
import { Button } from '@radix-ui/react-button';

// 3. Internal imports (app layer)
import { useAuth } from '@/app/hooks/useAuth';

// 4. Common layer imports
import { Button } from '@/common';

// 5. Feature imports
import { WelcomeMessage } from '@/features/welcome';

// 6. Relative imports
import { useLocalState } from './hooks/useLocalState';
```

#### Component Structure

```typescript
// Component with proper structure
import React from 'react';
import { Button } from '@/common';

interface ComponentProps {
  title: string;
  onAction?: () => void;
}

export const Component: React.FC<ComponentProps> = ({ title, onAction }) => {
  return (
    <div>
      <h1>{title}</h1>
      {onAction && <Button onClick={onAction}>Action</Button>}
    </div>
  );
};
```

## Testing Requirements

### Test Coverage

- **Components**: Test user interactions and accessibility
- **Hooks**: Test all states and transitions
- **Services**: Test API calls and error handling
- **Features**: Test complete workflows

### Test Examples

```typescript
// Component test
import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { Component } from '../Component';

describe('Component', () => {
  it('renders with title', () => {
    render(<Component title="Test" />);
    expect(screen.getByText('Test')).toBeInTheDocument();
  });
});

// Hook test
import { renderHook } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { useCustomHook } from '../useCustomHook';

describe('useCustomHook', () => {
  it('returns expected data', () => {
    const { result } = renderHook(() => useCustomHook());
    expect(result.current.data).toBeDefined();
  });
});
```

## Pull Request Process

### 1. Before Submitting

- [ ] Run tests: `npm run test`
- [ ] Check linting: `npm run lint`
- [ ] Check formatting: `npm run format:check`
- [ ] Update documentation if needed
- [ ] Add tests for new features

### 2. Pull Request Template

```markdown
## Description

Brief description of changes

## Type of Change

- [ ] Bug fix
- [ ] New feature
- [ ] Breaking change
- [ ] Documentation update

## Testing

- [ ] Tests pass
- [ ] New tests added
- [ ] Manual testing completed

## Checklist

- [ ] Code follows style guidelines
- [ ] Self-review completed
- [ ] Documentation updated
- [ ] No breaking changes
```

### 3. Review Process

- Code review by maintainers
- Automated checks must pass
- Manual testing if needed
- Documentation review

## Code Review Guidelines

### For Reviewers

- Check code quality and style
- Verify tests are adequate
- Ensure documentation is updated
- Look for potential issues
- Provide constructive feedback

### For Authors

- Respond to feedback promptly
- Make requested changes
- Ask questions if unclear
- Update documentation as needed

## Commit Message Convention

### Format

```
type(scope): description

[optional body]

[optional footer]
```

### Types

- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation changes
- `style`: Code style changes
- `refactor`: Code refactoring
- `test`: Test additions/changes
- `chore`: Build process or auxiliary tool changes

### Examples

```
feat(auth): add login functionality
fix(api): resolve timeout issue
docs(readme): update installation instructions
test(components): add unit tests for Button
```

## Feature Development

### 1. Planning

- Define requirements clearly
- Consider user experience
- Plan testing strategy
- Identify dependencies

### 2. Implementation

- Follow architecture patterns
- Write tests as you go
- Keep commits small and focused
- Document complex logic

### 3. Testing

- Unit tests for components
- Integration tests for features
- E2E tests for workflows
- Performance testing if needed

## Bug Reports

### Template

```markdown
## Bug Description

Clear description of the bug

## Steps to Reproduce

1. Go to '...'
2. Click on '....'
3. Scroll down to '....'
4. See error

## Expected Behavior

What you expected to happen

## Actual Behavior

What actually happened

## Environment

- OS: [e.g. Windows 10]
- Browser: [e.g. Chrome 91]
- Version: [e.g. 1.0.0]

## Additional Context

Any other context about the problem
```

## Feature Requests

### Template

```markdown
## Feature Description

Clear description of the feature

## Use Case

Why is this feature needed?

## Proposed Solution

How should this feature work?

## Alternatives

Other solutions considered

## Additional Context

Any other context about the feature request
```

## Release Process

### Version Numbering

- **Major**: Breaking changes
- **Minor**: New features (backward compatible)
- **Patch**: Bug fixes (backward compatible)

### Release Checklist

- [ ] All tests pass
- [ ] Documentation updated
- [ ] Changelog updated
- [ ] Version bumped
- [ ] Release notes prepared

## Community Guidelines

### Code of Conduct

- Be respectful and inclusive
- Provide constructive feedback
- Help others learn and grow
- Follow the golden rule

### Communication

- Use clear, descriptive language
- Be patient with questions
- Provide context for issues
- Ask for help when needed

## Getting Help

### Resources

- [Architecture Guide](./architecture.md)
- [Development Guide](./development.md)
- [Testing Guide](./testing.md)
- [Deployment Guide](./deployment.md)

### Support Channels

- GitHub Issues for bugs and features
- GitHub Discussions for questions
- Code review for feedback
- Documentation for learning

## Recognition

### Contributors

- All contributors are recognized
- Significant contributions get special mention
- Maintainers are listed in README
- Community feedback is valued

Thank you for contributing to Kaptain's React Template! Your contributions help make this template better for everyone.
