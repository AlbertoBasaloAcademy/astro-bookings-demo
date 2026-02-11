---
name : testing-e2e-playwright
description : "Writes end-to-end tests with Playwright. To be used for verifying acceptance criteria through automated tests."
---
# Playwright Testing Skill

When writing end-to-end tests with Playwright, follow these guidelines to ensure consistency and best practices:

## Test Structure

Organize your tests in a clear and maintainable structure. A common structure includes:

### Test Files
- Place test files in a `tests/`  directory.
- Name test files with a `.spec.ts` or `.test.ts` suffix.

### Test Suites
- Use `describe` blocks to group related tests into suites.
- Each suite should focus on a specific feature or user flow.

### Test Cases
- Use `test` blocks to define individual test cases.
- Each test case should be independent and test a single aspect of the feature.

### Patterns

- Follow Arrange-Act-Assert (AAA) pattern for clarity:
  - **Arrange**: Set up the initial state and context.
  - **Act**: Perform the actions to be tested.
  - **Assert**: Verify the expected outcomes.

## Steps to follow when writing tests

### 1. Before Testing:
- Commit any pending changes from the implementation phase
- Verify the implementation builds without errors: `npm run build`
- Ensure the development server can start: `npm run dev`
- Read the specification file to understand acceptance criteria

### 2. During Testing:
- Read the implementation plan 
- Follow the plan for testing tasks at the issue body step by step
- Start the development server: `npm run dev` (separate terminal)
- Create test files in `tests/` directory following naming pattern: `*.spec.ts`
- Test each acceptance criterion from the specification

### 3. After Testing:
- Ensure all tests pass successfully
- If tests fail, investigate and try to fix it if possible, otherwise:
  - report the issues
- Stop the development server to free resources
- Commit the test files with a message summarizing completed test coverage


## Running Tests

- Use the Playwright Test Runner to execute tests.
- Run tests with the command: `npx playwright test`.
- Ensure server is running if tests depend on a backend service.
- Stop the server after tests complete to free up resources.

### When to stop the test 

- After all tests have been executed and passed successfully.
- If tests keep failing after multiple attempts and need debugging.
  
## Output Checklist

- [ ] All test changes made on the same git branch created for implementation
- [ ] Modified or newly created test code files in `tests/` directory
- [ ] All testing tasks in the plan are completed or reported if not possible
- [ ] A commit with a message summarizing the completed test coverage and any issues found
