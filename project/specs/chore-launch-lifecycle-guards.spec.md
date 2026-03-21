# Launch Lifecycle Guards Specification
- **Type**: chore
- **Status**: Draft

## Problem Description

Launches already carry a lifecycle status, but the system currently accepts direct status updates without enforcing a formal transition graph. This leaves room for invalid state changes, inconsistent operational behavior, and confusion about when a launch is eligible for booking. The backlog needs a hardening item that defines allowed transitions and rejects invalid ones as a business rule.

### User Stories

- As an **administrator**, I want to **change launch status only through valid lifecycle steps** so that **launch operations stay consistent**.
- As a **booking system**, I want to **rely on launch status transitions being enforced** so that **booking availability reflects a valid operational state**.
- As a **product owner**, I want to **document lifecycle guards as explicit rules** so that **current behavior and planned hardening are clearly separated**.

## Solution Overview

### User/App interface

- Keep launch management interfaces consistent with the current API surface.
- Return a validation error when a requested launch status change does not match an allowed lifecycle transition.
- Preserve the existing rule that booking is only available when a launch is in the active state.

### Model and logic

- Define the supported launch lifecycle states as scheduled, active, completed, and cancelled.
- Define an explicit transition graph for valid status changes.
- Treat completed and cancelled as terminal states.
- Validate requested status changes against the lifecycle rules before the status is accepted.

### Persistence

- Persist only launch states that pass lifecycle validation.
- Keep stored launch status values aligned with the approved lifecycle states and transitions.
- Avoid introducing separate persistence behavior beyond the existing launch storage responsibility.

## Acceptance Criteria

- [ ] WHEN a launch is created THE SYSTEM SHALL assign the initial status as scheduled.
- [ ] WHEN an update requests the transition from scheduled to active THE SYSTEM SHALL accept the status change.
- [ ] WHEN an update requests the transition from scheduled to cancelled THE SYSTEM SHALL accept the status change.
- [ ] WHEN an update requests the transition from active to completed THE SYSTEM SHALL accept the status change.
- [ ] WHEN an update requests the transition from active to cancelled THE SYSTEM SHALL accept the status change.
- [ ] IF a requested status change is outside the defined lifecycle transition graph THEN THE SYSTEM SHALL reject the update with a validation error.
- [ ] WHILE a launch is in completed THE SYSTEM SHALL reject any further status change.
- [ ] WHILE a launch is in cancelled THE SYSTEM SHALL reject any further status change.
- [ ] IF a launch is not active THEN THE SYSTEM SHALL reject booking attempts for that launch.

## PRD Note

FR6 wording in [project/PRD.md](project/PRD.md) should reflect that formal lifecycle transition guards are backlog hardening work and are not fully implemented current behavior yet.