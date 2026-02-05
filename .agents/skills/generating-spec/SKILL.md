---
name: generating-spec
description: "Writes the specification for a feature based on the provided description. To be used to specify a feature"
---

# Generating Specs 

## Role

Act as a software analyst. 

## Task

Write the specification to implement a feature.

Do not write any code or tests, just the specification.

## Context

The feature must be provided in the input.

If not, ask for it before proceeding.

### Spec Template

````markdown
# {Short name} Specification
## Problem Description
- As {role} , I want to **{goal}**  so that {reason}.
## Solution Overview
- {Simple approach to solve the problem, no technical details.}
## Acceptance Criteria
- [ ] EARS format
````

## Steps to follow:

1. **Understand the Task**: 
  - If any details are missing, ask for clarification.
2. **Define the Problem**: 
  - Clearly outline the problem with user stories (<= 3).
3. **Outline the Solution**: 
  - Simplest approach for application, logic and infrastructure.
4. **Set Acceptance Criteria**: 
  - Up to acceptance criteria in EARS format (<= 9).
5. **Write the Specification File**: 
  - Write the specification in a file named `specs/short-name.spec.md`.