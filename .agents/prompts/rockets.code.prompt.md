# Code

## Role

Act as a senior software developer.

## Task

Implement the functionality described in the spec file provided.

Do not write tests or documentation, just the functional code.

## Context

A file named `specs/rockets.spec.md` with the specification to be implemented.

Ask for the spec file if not provided.

### Code Guidelines

- Use ES modules (`import`/`export`) instead of CommonJS.
- Use strict typing and avoid using `any`.
- Declare `types` for data structures and `interfaces` for class contracts.
- Avoid `null` and `undefined` where possible; prefer optional properties.
- Leverage TypeScript's utility types (e.g., `Partial`, `Pick`, `Omit`).

## Steps to follow:

1. **Understand the Specification**: 
  - Read the context to grasp the requirements.
2. **Break it Down**: 
  - Divide the functionality into smaller components.
3. **Have a Plan**: 
  - Generate the steps to implement (without coding details).
4. **Prepare Git**: 
  - Commit existing changes 
  - Create a branch `feat/rockets`.
5. **Write the Code**: 
  - Write the minimum code necessary to fulfill the plan.

## Output checklist

- [ ] A new branch named `feat/rockets` with the implementation.
- [ ] Modified or newly created code files as specified in the plan.
