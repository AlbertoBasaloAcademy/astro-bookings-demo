# Launches Endpoint Specification

## Problem Description

- As a **booking system administrator**, I want to **schedule launches on specific rockets with pricing and passenger thresholds** so that I can manage launch operations and ensure operational viability.
- As a **customer**, I want to **view available launches with pricing and seat availability** so that I can book seats on my preferred launch.
- As a **system**, I want to **validate launch creation against rocket capacity constraints** so that overbooking cannot occur.

## Solution Overview

Implement a launches management system as REST endpoints that:
- Create launches linked to specific rockets with price, date, and minimum passenger thresholds
- Retrieve launch details including seat availability and pricing information
- Validate launch creation against rocket capacity to prevent overselling
- Track launch status lifecycle (scheduled, active, completed, cancelled)
- Return comprehensive launch data with associated rocket information

## Acceptance Criteria

- [ ] When creating a launch, system SHALL validate that minimum_passengers is at least 1
- [ ] When creating a launch, system SHALL validate that the launch date is in the future
- [ ] When creating a launch, system SHALL validate that price is greater than 0
- [ ] When creating a launch, system SHALL validate that minimum_passengers does not exceed the rocket's total_seats capacity
- [ ] When creating a launch, system SHALL validate that the rocket exists before allowing launch creation
- [ ] When retrieving a launch, system SHALL return launch details including rocket information and available_seats calculation
- [ ] When retrieving a launch, system SHALL calculate available_seats as (rocket.total_seats - booked_passengers)
- [ ] When retrieving all launches, system SHALL return a list of launches with current seat availability and pricing
- [ ] When creating a launch, system SHALL return a 400 error with descriptive message if validation fails

## Technical Details

### Launch Data Structure
```typescript
type Launch = {
  id: string;
  rocketId: string;
  scheduledDate: Date;
  price: number;
  minimumPassengers: number;
  status: 'scheduled' | 'active' | 'completed' | 'cancelled';
  createdAt: Date;
};
```

### Endpoints

**POST /launches** - Create a new launch
- Input: rocketId, scheduledDate, price, minimumPassengers
- Validation: rocket exists, capacity check, date validation
- Response: Created launch with calculated fields

**GET /launches/:id** - Get launch details
- Response: Launch with rocket info and available_seats

**GET /launches** - List all launches
- Response: Array of launches with availability

### Dependencies
- Rocket service for capacity validation
- In-memory launch store (no persistence)

---

**Related Issue**: [#4](https://github.com/AlbertoBasaloAcademy/astro-bookings-demo/issues/4)
