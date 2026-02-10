---
name: coding-type-script
description: "Best practices for clean and maintainable code in TypeScript. To be used for writing TypeScript code that is easy to read, maintain, and follows industry standards."
---
# Clean code best practices 

## Variables and naming
- Name variables and functions descriptively to enhance readability.
- Use named constants instead of magic numbers or strings.
## Functions and complexity
- Keep functions small and focused on a single task.
- Avoid nested structures to reduce complexity.
- Use early returns to minimize indentation.
## Classes and modules
- Avoid primitive obsession by defining types.
- Favor composition over inheritance.
- Keep dependencies to a minimum.
- Use adapter pattern to decouple from external systems.
- Maintain a shared module (folder...) for common utilities and types.
## Error handling and comments
- Handle errors gracefully with try-catch blocks and meaningful messages.
- Write comments to explain the "why" behind complex logic, not the "what".
## General principles
- Keep it simple and avoid over-engineering.
- Try to keep it DRY (Don't Repeat Yourself) by reusing code where applicable.

## TypeScript specific guidelines

- Use ES modules (`import`/`export`) instead of CommonJS.
- Favor named exports over default exports
- File names follows `kebab-case.{pattern}.ts`. Ex: `user-login.service.ts`
- Use strict typing and avoid using `any`.
- Declare `types` for data structures in its own file.
- Use `as const` for constant values to infer literal types.
- Define `interfaces` for class contract behavior in its own file.
- Avoid `null` and `undefined` where possible; prefer optional properties.
- Leverage TypeScript's utility types (e.g., `Partial`, `Pick`, `Omit`).
- Use async/await; wrap awaits in try/catch with structured errors.
