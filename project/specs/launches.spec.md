# Launches Endpoint Specification
- **Type**: feat
- **Status**: Released
  
## Problem Description

- As a **booking system administrator**, I want to **schedule launches on specific rockets with pricing and passenger thresholds** so that I can manage launch operations and ensure operational viability.
- As a **customer**, I want to **view available launches with pricing and seat availability** so that I can book seats on my preferred launch.
- As a **system**, I want to **validate launch creation against rocket capacity constraints** so that overbooking cannot occur.

## Solution Overview

Implement a launch management API that:
- Creates launches linked to specific rockets with price, date, minimum passenger thresholds, and status
- Retrieves launch details including derived availability and rocket information
- Updates and deletes launches through the same domain model
- Validates launch creation against rocket capacity and scheduling rules
- Exposes current availability for booking workflows

## Acceptance Criteria

- [ ] WHEN a client creates a launch THE SYSTEM SHALL validate that `minimumPassengers` is at least 1.
- [ ] WHEN a client creates a launch THE SYSTEM SHALL validate that `scheduledDate` is in the future.
- [ ] WHEN a client creates a launch THE SYSTEM SHALL validate that `price` is greater than 0.
- [ ] WHEN a client creates a launch THE SYSTEM SHALL validate that `minimumPassengers` does not exceed the selected rocket capacity.
- [ ] WHEN a client creates a launch THE SYSTEM SHALL validate that the referenced rocket exists.
- [ ] WHEN a client retrieves a launch THE SYSTEM SHALL return rocket name, total seats, booked seats, and available seats.
- [ ] WHEN a client retrieves all launches THE SYSTEM SHALL return each launch with its current availability view.
- [ ] WHEN a client updates a launch THE SYSTEM SHALL return the updated launch with current availability data.
- [ ] IF launch validation fails THEN THE SYSTEM SHALL return HTTP 400 with descriptive error details.

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
  updatedAt: Date;
};
```

### Endpoints

**POST /api/launches** - Create a new launch
- Input: rocketId, scheduledDate, price, minimumPassengers
- Validation: rocket exists, capacity check, date validation
- Response: Created launch with calculated fields

**GET /api/launches/:id** - Get launch details
- Response: Launch with `rocketName`, `totalSeats`, `bookedSeats`, and `availableSeats`

**GET /api/launches** - List all launches
- Response: Array of launches with availability

**PUT /api/launches/:id** - Update an existing launch
- Response: Updated launch with availability

**DELETE /api/launches/:id** - Delete a launch
- Response: HTTP 204 on success

**GET /api/launches/:launchId/availability** - Retrieve availability summary
- Response: Launch ID with total seats, booked seats, and available seats

### Dependencies
- Rocket service for capacity validation
- Booking service for derived availability
- In-memory launch store and repository

---

**Related Issue**: [#4](https://github.com/AlbertoBasaloAcademy/astro-bookings-demo/issues/4)
