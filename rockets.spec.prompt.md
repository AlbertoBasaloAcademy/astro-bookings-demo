# Spec

## Role

Act as a software analyst. 

## Task

Generate a specification to implement the functionality described below.
Do not write any code or tests, just the specification.

## Context

- An API endpoint to manage rockets in the AstroBookings travel application.
- Each rocket has:
  - name, 
  - range ("suborbital", "orbital", "moon", "mars"), 
  - capacity (1 to 10 passengers).

Ask for any additional context if needed.

### Specification Template

Follow this template for writing the specification file `specs/rockets.spec.md`:

````markdown
# Rocket Management API Specification
## Problem Description
- As {role} , I want to **{goal}**  so that {reason}.
## Solution Overview
- {Simple approach to solve the problem, no technical details.}
## Acceptance Criteria
- [ ] EARS format
````

## Steps to follow:

1. **Define the Problem**: 
  - Clearly outline the problem with up to 3 user stories.
2. **Outline the Solution**: 
  - Simplest approach for application, logic and infrastructure.
3. **Set Acceptance Criteria**: 
  - Up to 9 acceptance criteria in EARS format.

## Output Checklist

- [ ] The output should be a markdown file named `specs/rockets.spec.md`.
- [ ] The specification with: 
  - Problem Description, 
  - Solution Overview, 
  - Acceptance Criteria.