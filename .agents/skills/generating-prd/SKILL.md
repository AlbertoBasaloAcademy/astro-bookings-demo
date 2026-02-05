---
name: generating-prd
description: "Generates a Product Requirements Document (PRD) for software projects. To be used when analyzing a project to create a PRD."
--- 
# Generating a PRD

Understand the project idea, stakeholders, target users, and business objectives.

## Context

You can be working on either a greenfield or brownfield project.

### Greenfield scenario

Starting a new project from scratch.

Use the provided project idea, briefing document or README.md file.

### Brownfield scenario

Working on a legacy or existing project.

Use the current project files to analyze the existing product.
Pay special attention to:
  - README.md
  - CHANGELOG.md
  - docs folder
  - Existing specs or documentation files
  - Previous agents documents AGENTS.md, PRD.md, ADD.md, etc.
  - Any documentation in the codebase

### PRD output template

Read and follow any specific [PRD template](PRD.md) to generate the document.

## Steps to follow:

### Step 1: Clarifying Questions

- [ ] Ask only critical questions where the context is ambiguous. 
  - Focus on:
    - Goal: What problem does this solve?
    - Target: Who will use this product?
    - Scope: What won't it do?
    - Core: What are the key features?
    - Solution: What is expected?

### Step 2: Drafting the PRD

- [ ] Draft the PRD following the [PRD template](PRD.md)
  - Do not write more than necessary, keep it concise and to the point.
  - Specifically cover:
    - Between 3 and 9 Functional Requirements (less is better)
    - Between 1 and 5 Technical Requirements (less is better)

### Step 3: Review and Finalize

- [ ] Review the PRD for completeness and clarity.
- [ ] Ensure all sections of the PRD template are filled out appropriately.
- [ ] On brownfield projects, update PRD feature status.
  - Mark existing features as Implemented.
  - New features should be marked as NotStarted. 
- [ ] Write the final PRD at `.agents/PRD.md`.

## Output Checklist

- [ ] A comprehensive P.R.D. at `.agents/PRD.md`.