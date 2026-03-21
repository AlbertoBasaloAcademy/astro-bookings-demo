# Seat Booking and Reservation Specification
- **Type**: feat
- **Status**: Released

## Problem Description

AstroBookings needed a booking flow that lets customers reserve seats on scheduled launches while keeping availability accurate and preventing overbooking. The released feature provides seat validation, total price calculation, booking lookup, customer booking history, and launch availability checks.

### User Stories

- As a **customer**, I want to **book one or more seats on a scheduled launch** so that **I can reserve my space travel experience**.
- As a **travel agent**, I want to **verify seat availability before confirming a customer booking** so that **I don't oversell launch capacity**.
- As a **system administrator**, I want to **track booked seats per launch** so that **I can manage capacity and revenue**.

## Solution Overview

### User/App interface

- **POST /api/bookings** - Create a booking with launch ID, customer email, and seat count
- **GET /api/bookings/:id** - Retrieve booking details by booking ID
- **GET /api/bookings/launch/:launchId** - List bookings for a launch
- **GET /api/bookings/customer/:email** - List bookings for a customer email
- **GET /api/launches/:launchId/availability** - Check remaining available seats for a launch

### Model and logic

- **Booking entity** with:
  - Unique booking ID
  - Reference to customer (customer ID with email lookup at input time)
  - Reference to launch (launch ID)
  - Number of seats booked
  - Total cost (seats × launch price)
  - Booking status (pending, confirmed, cancelled)
  - Payment status (pending, completed, failed)
  - Created and updated timestamps

- **Business rules**:
  - Total booked seats for a launch cannot exceed rocket capacity
  - Booking quantity must be 1 or more
  - Customer can have multiple bookings on different launches
  - Same customer can book multiple times on same launch (up to capacity)
  - Booking cost = seat quantity × launch price
  - Bookings are atomic: all seats reserved or entire operation fails
  - Bookings can only be made on launches in `active` status

### Persistence

- Bookings stored in in-memory `bookingStore`
- Booking repository provides CRUD operations
- Launch availability calculated dynamically from rocket capacity minus non-cancelled booked seats
- Booking responses are enriched with customer email, rocket name, and launch price

## Acceptance Criteria

- [ ] WHEN a client submits a valid launch ID, seat count, and customer email THEN THE SYSTEM SHALL create a booking and return HTTP 201.
- [ ] WHEN THE booking request includes seat quantity exceeding available capacity THEN THE SYSTEM SHALL return HTTP 400 with error message "Insufficient seats available".
- [ ] WHEN THE booking request is for a launch not in "active" status THEN THE SYSTEM SHALL return HTTP 400 with error message "Launch is not available for booking".
- [ ] WHERE THE booking is created THE SYSTEM SHALL calculate total cost as seat quantity multiplied by launch price.
- [ ] WHERE THE booking is successful THE SYSTEM SHALL update launch availability immediately and prevent concurrent overbooking.
- [ ] WHEN THE customer requests booking history by email THEN THE SYSTEM SHALL return all bookings for that customer with complete details including status, total price, and payment status.
- [ ] WHEN THE booking request includes invalid customer email format THEN THE SYSTEM SHALL return HTTP 400 with validation error message.
- [ ] WHEN THE booking is created THE SYSTEM SHALL initialize payment status as "pending".
- [ ] IF THE total booked seats plus new booking exceeds rocket capacity THEN THE SYSTEM SHALL rollback the booking and return HTTP 400.
