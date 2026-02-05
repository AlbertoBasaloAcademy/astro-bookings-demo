---
name: generating-add
description: "Generates an Architecture Design Document (ADD) and an AGENTS.md for software projects. To be used when designing a product architecture and agents instructions."
--- 
# Generating an ADD

To generate an Architecture Design Document (ADD), follow these steps:

## Context

Use the provided context [PRD](.agents/PRD.md), or current documentation files. 

### ADD and AGENTS output templates

Read and follow specific templates like [ADD](ADD.md) and [Agents](AGENTS.md).

Read and respect the current [AGENTS.md](AGENTS.md) file if it exists.

## Steps to follow:

### Step 1: Clarifying Questions

-[ ] Ask only critical questions where the initial prompt is ambiguous. Focus on:

  - System Requirements: What are the key technical requirements?
  - Constraints: Are there any technology or architecture constraints?
  - Non-Functional Requirements: Are there any security, or scalability needs?

### Step 2: Drafting the ADD

- [ ] Draft the ADD following the [ADD template](ADD.md)
  - Ensure each section is filled out with relevant information.
  - Keep the document concise, aiming for clarity and brevity.
  - Put a TOC at the start of the document.

### Step 3: Drafting the AGENTS.md

- [ ] Review existing `AGENTS.md` file if it exists.
- [ ] Update or create the file with
  - Respect any previous agent instructions.
  - Add any architectural rules, guidelines, or agent relevant behaviors
  - Follow the [Agents template](AGENTS.md) provided in the context.
  - The file must be less than 100 sentences, than 100 characters each.
  
### Step 4: Review and Finalize

- [ ] Review the documents for completeness and accuracy.
- [ ] Write the final Architecture Design Document (ADD) at `.agents/ADD.md`.
- [ ] Update or create the `/AGENTS.md` file in the root folder. Keep it concise.
- [ ] AGENTS.md must be a succinct summary (<100 sentences, <100 characters each).  

## Output Checklist 

- [ ] A comprehensive A.D.D. at `.agents/ADD.md`
- [ ] An updated `/AGENTS.md` to help implement the architecture