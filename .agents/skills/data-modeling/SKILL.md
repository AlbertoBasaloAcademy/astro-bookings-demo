---
name: data-modeling
description: "Defines the Entity-Relationship (ER) model for the system based on the feature specifications. To be used for designing the data structures and relationships needed to implement the features."
---

# Data Modeling Skill

Write the Entity-Relationship (ER) model for the system based on the feature specifications.

The model will be a set of entities (with attributes) and relationships (with cardinalities).

RESPECT the current ER model if it exists, and only add or modify entities and relationships as needed to accommodate the new specifications.

## Context

- [The Specification file](.agents/specs/?short-name.spec.md)
- [Architectural Design Document](.agents/ADD.md)
- [Current ER Model](.agents/ERM.md) (if exists)

## Steps to follow:

### Step 1: Analyze the specifications and ADD.
 - [ ] Identify the key entities involved in the system based on the specifications.
 - [ ] Consider the architectural design and constraints from the ADD to inform the data model.
### Step 2: Define entities and attributes.
 - [ ] For each identified entity, list its attributes and their data types.
### Step 3: Define relationships and cardinalities.
 - [ ] Identify the relationships between entities and specify their cardinalities (e.g., one-to-many, many-to-many).
### Step 4: Write the ER model.
 - [ ] Follow the format in the [ER Model template](./ERM.md).
### Step 5: Review and finalize the ER model.
 - [ ] Ensure the ER model is comprehensive and accurately reflects the specifications and ADD.

## Output Checklist

- [ ] An Entity-Relationship (ER) model at `.agents/ERM.md`.
- [ ] The ER model should include all relevant entities, attributes, and relationships based on the specifications and ADD.