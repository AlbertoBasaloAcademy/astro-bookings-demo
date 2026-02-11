---
name: testing-unit-vitest
description: "Writes and maintains unit tests using Vitest. To be used for testing business logic in services and utilities."
---

# Unit Testing Skill

When asked to write or maintain unit tests, follow these guidelines:

## When to Write Unit Tests

- **New services/utilities**: Write tests when creating new business logic
- **Bug fixes**: Add tests to verify bug resolution and prevent regression
- **Complex logic**: Test edge cases, boundary conditions, and error handling
- **Refactoring**: Ensure tests pass before and after code changes

## File Naming and Location

- **Colocate tests**: Place test files next to source files (e.g., `validation.spec.ts` next to `validation.ts`)
- **Naming convention**: Use `{filename}.spec.ts` pattern
- **Separate E2E**: Keep Playwright tests in `tests/` directory for HTTP-layer integration tests

## Test Structure

Use describe/it blocks with arrange-act-assert pattern:

```typescript
import { describe, it, expect, beforeEach, vi } from 'vitest';

describe('MyService', () => {
  beforeEach(() => {
    // Setup for each test
  });

  describe('methodName', () => {
    it('should do something specific', () => {
      // Arrange: Set up test data
      const input = { /* ... */ };
      
      // Act: Execute the code under test
      const result = service.method(input);
      
      // Assert: Verify the outcome
      expect(result).toBe(expected);
    });
  });
});
```

## Mocking Dependencies

Use `vi.fn()` for repository interfaces and external services:

```typescript
import { vi } from 'vitest';

const mockRepo = {
  save: vi.fn(),
  findById: vi.fn(),
  findAll: vi.fn(),
};

// Inject mocked repository
const service = new MyService(mockRepo);

// Set return values
vi.mocked(mockRepo.findById).mockReturnValue(mockData);

// Verify calls
expect(mockRepo.save).toHaveBeenCalledWith(expected);
expect(mockRepo.save).toHaveBeenCalledTimes(1);
```

## Running Tests

- **Watch mode**: `npm run test:dev` - Auto-rerun tests during development
- **One-time**: `npm run test:unit` - Run all unit tests once
- **Coverage**: `npm run test:coverage` - Generate coverage report
- **E2E**: `npm test` - Run Playwright tests independently

## Coverage Expectations

- **Services/utilities**: Aim for >80% coverage
- **Edge cases**: Test boundary conditions (0, 1, max, max+1)
- **Error paths**: Verify error handling and validation
- **Business rules**: Test all conditional logic and state transitions

## Best Practices

- **Test behavior, not implementation**: Focus on inputs/outputs, not internal details
- **One assertion per test**: Keep tests focused (exceptions for related checks)
- **Clear test names**: Use descriptive `it('should...')` statements
- **Isolated tests**: Each test should run independently
- **Fast execution**: Mock I/O operations to keep tests fast

## Common Vitest Matchers

```typescript
expect(value).toBe(expected);              // Strict equality
expect(value).toEqual(expected);           // Deep equality
expect(value).toBeInstanceOf(Class);       // Instance check
expect(value).toBeUndefined();             // Undefined check
expect(array).toHaveLength(3);             // Array length
expect(() => fn()).toThrow(ErrorClass);    // Exception check
expect(mockFn).toHaveBeenCalledWith(arg);  // Mock verification
expect(mockFn).toHaveBeenCalledTimes(1);   // Call count
```

## Reference

For advanced features, see [Vitest documentation](https://vitest.dev/):
- Snapshot testing
- Testing async code
- Custom matchers
- Performance testing
