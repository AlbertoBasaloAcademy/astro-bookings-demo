# Plan: Add Vitest Unit Testing with Colocated Tests

Adding Vitest for fast, ESM-native unit testing of service layer and utilities. Tests will be colocated with source files (e.g., `validation.spec.ts` next to `validation.ts`), while E2E tests remain in `tests/`. This enables rapid TDD feedback loops and isolates business logic testing from HTTP-layer integration tests. Choice based on TypeScript 5.6 + ES modules + Node 22 stack requiring zero-config ESM support.

**Steps**

1. **Install Vitest dependencies**
   - Run `npm install -D vitest @vitest/coverage-v8` to add testing framework and coverage tooling
   - Verify installation in `package.json`

2. **Create Vitest configuration** at `vitest.config.ts`
   - Configure test file patterns: `**/*.spec.ts` (unit tests) vs `tests/**/*.ts` (E2E)
   - Exclude E2E tests from unit test runs via `exclude: ['tests/**']`
   - Enable coverage reporting for `src/` directory only
   - Set up ESM-compatible environment (default)

3. **Add test scripts** to `package.json`
   - `test:dev`: Run Vitest in watch mode for development (`vitest watch`)
   - `test:unit`: Run all unit tests once (`vitest run`)
   - `test:coverage`: Generate coverage report (`vitest run --coverage`)
   - Keep existing `test` script for Playwright E2E tests

4. **Write sample unit test for validation utility** at `src/utils/validation.spec.ts`
   - Test `validateRocketInput()` with valid/invalid inputs
   - Cover edge cases: boundary capacity (0, 1, 10, 11), missing name, empty name after trim
   - Test range validation (valid: 'suborbital'/'orbital'/'moon'/'mars', invalid: 'invalid')
   - Verify `ValidationError` instances thrown with correct messages
   - Demonstrate Vitest matchers: `expect().toThrow()`, `expect().toEqual()`, `describe()`/`it()` structure

5. **Write sample unit test for RocketService** at `src/services/rocket.service.spec.ts`
   - Mock `RocketRepository` interface using `vi.fn()` for repository methods
   - Test `create()`: validates input, generates timestamps, delegates to repository
   - Test `getAll()`: pagination logic (`findAllPaginated`), filtering (`minCapacity`, `range`)
   - Inject mocked repository via constructor (follows existing DI pattern in `RocketService`)
   - Verify mock call counts and arguments with `expect(mockFn).toHaveBeenCalledWith()`

6. **Update root AGENTS.md** at `AGENTS.md`
   - Add to "Development workflow" section:
     * `npm run test:dev` for unit tests in watch mode
     * `npm run test:unit` for one-time unit test runs
     * `npm run test:coverage` for coverage reports
   - Add to "Testing" subsection of Technical Implementation:
     * "Unit Testing: Vitest 1.x (colocated `*.spec.ts` files)"
     * "E2E Testing: Playwright 1.58 (`tests/` directory)"
   - Keep changes under 3 sentences per section (concise requirement)

7. **Update architectural documentation** at `.agents/ADD.md`
   - Add "Vitest" to "Development Tools" section with version
   - Create new **ADR 5: Vitest for unit testing** covering:
     * Decision: Use Vitest for service/utility layer unit tests
     * Context: ES modules + TypeScript require zero-config ESM support; Playground covers E2E
     * Consequences: Fast TDD cycles, colocated tests improve discoverability, mocking for pure business logic validation
   - Update "Testing" line in "Stack and tooling" to mention both Playwright (E2E) and Vitest (unit)
   - Add testing layer to mermaid diagram showing unit tests at service/util layer

8. **Update product requirements** at `.agents/PRD.md`
   - Update **TR5** title to "Automated Testing with Playwright and Vitest"
   - Add one sentence: "Unit tests validate business logic in services and utilities using Vitest with mocked dependencies for isolated testing."
   - Change status to "Implemented" (assuming implementation follows plan)
   - Keep other TR5 content unchanged (minimal update requirement)

9. **Create unit-testing skill** at `.agents/skills/unit-testing/SKILL.md`
   - Follow skill file format with YAML frontmatter (`name`, `description`)
   - Include sections:
     * When to write unit tests (new services/utils, bug fixes, complex logic)
     * File naming and location (colocate as `*.spec.ts`)
     * Test structure (describe/it blocks, arrange-act-assert pattern)
     * Mocking dependencies (repository interfaces, external services)
     * Running tests (`npm run test:dev` during development)
     * Coverage expectations (aim for >80% on services/utils)
   - Provide minimal code examples (5-10 lines) for mock setup and assertion patterns
   - Reference Vitest docs for advanced features

**Verification**

- Run `npm run test:dev` and verify Vitest starts in watch mode
- Modify `src/utils/validation.ts` and see tests re-run automatically  
- Check both sample tests pass with `npm run test:unit`
- Generate coverage with `npm run test:coverage` and verify report shows coverage for tested files
- Run `npm test` to confirm Playwright E2E tests still work independently
- Verify documentation builds (no broken links) after updates

**Decisions**

- **Vitest over Jest**: Native ESM support eliminates configuration complexity for ES modules codebase
- **Vitest over Node native**: Better DX with mature ecosystem, mocking utilities, and coverage tooling
- **Colocated tests**: Improves discoverability and follows modern convention (versus separate `tests/unit/` hierarchy)
- **Separate E2E**: Keep Playwright tests in `tests/` to maintain clear boundary between integration and unit testing
- **Sample tests for validation + RocketService**: Low coupling (validation is pure function, RocketService has clean DI) makes them ideal teaching examples

---

**Ready to implement?** This plan provides complete infrastructure setup, documentation updates, and working examples for unit testing the codebase.