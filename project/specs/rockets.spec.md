# Rocket Management API Specification
- **Type**: feat
- **Status**: Released

## Problem Description

- As a **travel agent**, I want to **view and manage available rockets** so that I can **offer appropriate spacecraft options to customers based on their journey requirements**.

- As an **AstroBookings administrator**, I want to **create, update, and delete rocket entries** so that I can **maintain accurate inventory of available spacecraft**.

- As a **booking system**, I want to **retrieve rocket details by range and capacity constraints** so that I can **automatically match rockets to customer booking requests**.

## Solution Overview

The solution implements a RESTful Rocket Management API with CRUD operations allowing administrators to manage rocket inventory. The API will:

- **Application Logic**: Validate rocket properties (name uniqueness, range from predefined options, capacity within 1-10 range) and enforce business rules.
- **Data Storage**: Persist rocket records with their attributes in a structured data model.
- **API Interface**: Provide endpoints for creating, retrieving, updating, and deleting rockets with filtering capabilities by range and capacity.
- **Infrastructure**: Deploy as a stateless service with standard HTTP methods, returning JSON responses with appropriate status codes.

## Acceptance Criteria

- [x] **GIVEN** a user wants to create a rocket **WHEN** they submit valid rocket data (name, range, capacity) **THEN** the rocket is created with a unique ID and returned with 201 status.

- [x] **GIVEN** a rocket record exists in the system **WHEN** a user requests the rocket by ID **THEN** the full rocket details are returned with 200 status.

- [x] **GIVEN** no rocket exists with the requested ID **WHEN** a user queries by ID **THEN** a 404 error is returned with an appropriate error message.

- [x] **GIVEN** an existing rocket record **WHEN** a user updates its name, range, or capacity with valid data **THEN** the rocket is updated and the updated record is returned with 200 status.

- [x] **GIVEN** a user submits invalid data (e.g., capacity > 10 or undefined range) **WHEN** attempting to create or update a rocket **THEN** a 400 error is returned with field-level validation errors.

- [x] **GIVEN** a rocket exists in the system **WHEN** a user deletes it by ID **THEN** the rocket is removed and a 204 status is returned.

- [x] **GIVEN** multiple rockets exist **WHEN** a user requests all rockets **THEN** a list of all rockets is returned with pagination metadata.

- [x] **GIVEN** multiple rockets exist **WHEN** a user filters by range (e.g., "orbital") **THEN** only rockets with matching range are returned.

- [x] **GIVEN** multiple rockets exist **WHEN** a user filters by capacity (e.g., capacity >= 5) **THEN** only rockets meeting the capacity requirement are returned.
