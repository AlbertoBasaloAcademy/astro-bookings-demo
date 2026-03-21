---
name: generating-add
description: "Generates an Architecture Design Document (ADD)  for software projects. To be used when designing a product architecture"
--- 
# Generating an ADD

To generate an Architecture Design Document (ADD), follow these steps:

## Context

Use the provided context [PRD]({Project_Folder}/PRD.md), or current documentation files. 

### ADD output templates

Read and follow specific templates like [ADD template](ADD.template.md) 

Read and respect the current [AGENTS]({Agents_file}) file if it exists.

## Steps to follow:

### Step 1: Clarifying Questions

-[ ] Ask only critical questions where the initial prompt is ambiguous. Focus on:

  - System Requirements: What are the key technical requirements?
  - Constraints: Are there any technology or architecture constraints?
  - Non-Functional Requirements: Are there any security, or scalability needs?

### Step 2: Drafting the ADD

- [ ] Draft the ADD following the [ADD template](ADD.template.md)
  - Ensure each section is filled out with relevant information.
  - Keep the document concise, aiming for clarity and brevity.
  - Put a TOC at the start of the document.

### Step 4: Review and Finalize

- [ ] Review the documents for completeness and accuracy.
- [ ] Write the final Architecture Design Document (ADD) at `{Project_Folder}/ADD.md`. 

## Output Checklist 

- [ ] A comprehensive A.D.D. at `{Project_Folder}/ADD.md`
- [ ] An updated `{Agents_file}` to help implement the architecture