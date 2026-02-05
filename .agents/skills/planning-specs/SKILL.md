---
name: planning-specs
description: "Creates a detailed implementation plan for a given feature specification. To be used for planning the implementation of feature specifications."
---

# Generate Plan Skill

Write a detailed implementation plan for a given feature specification.

The plan will be a set of ordered steps, each with specific tasks to complete.

## Context

- [The Specification file](.agents/specs/?short-name.spec.md)
- [Architectural Design Document](.agents/ADD.md)

## Steps to follow:

### Step 1: Think about the overall implementation.
 - [ ] Understand the specification requirements.
 - [ ] Consider the architecture and design constraints from the ADD.
 - [ ] Choose the simplest viable approach to implement the spec.
### Step 2: Decompose the implementation in steps.
 - [ ] Break down the implementation into 3 to 9 steps 
 - [ ] Ensure each step is an ordered logical unit of work.
### Step 3: Define tasks for each step.
 - [ ] For each step, list specific tasks (<= 5) needed to complete it.
 - [ ] Ensure tasks are clear and actionable.
### Step 4: Write the implementation plan.
 - [ ] Follow the format in the [Implementation Plan template](./PLAN.md).
 - [ ] Write the plan to a markdown file at `.agents/short-name.plan.md`.
### Step 5: Review and finalize the plan.
 - [ ] Ensure the plan is comprehensive and feasible.
 - [ ] Mark the specification status as "Planned" at the top of the spec file.

## Output Checklist

- [ ] A detailed implementation plan at `.agents/short-name.plan.md`.
- [ ] The specification status updated to "Planned" in the spec file.