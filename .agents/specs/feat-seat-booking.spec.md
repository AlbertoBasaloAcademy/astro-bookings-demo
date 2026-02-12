# Seat Booking and Reservation Specification
- **Type**: feat
- **Status**: Verified

## Problem Description

Currently, the AstroBookings system manages rockets and launches but lacks the core functionality for customers to reserve seats on scheduled flights. Without a booking system, customers cannot complete space travel reservations, and administrators cannot track which seats are available or sold for each launch. The system needs to provide real-time seat availability validation, prevent overbooking, calculate booking costs accurately, and ensure booking integrity through atomic operations.

### User Stories

- As a **customer**, I want to **book one or more seats on a scheduled launch** so that **I can reserve my space travel experience**.
- As a **travel agent**, I want to **verify seat availability before confirming a customer booking** so that **I don't oversell launch capacity**.
- As a **system administrator**, I want to **track booked seats per launch** so that **I can manage capacity and revenue**.

## Solution Overview

### User/App interface

- **POST /launches/{launchId}/bookings** - Create a booking with customer email, number of seats, and optional payment details
- **GET /launches/{launchId}/bookings/{bookingId}** - Retrieve booking confirmation details
- **GET /customers/{email}/bookings** - List all bookings for a customer with status and details
- **GET /launches/{launchId}/availability** - Check remaining available seats for a launch

### Model and logic

- **Booking entity** with:
  - Unique booking ID
  - Reference to customer (email)
  - Reference to launch (launch ID)
  - Number of seats booked
  - Total cost (seats × launch price)
  - Booking status (pending, confirmed, cancelled)
  - Booking timestamp
  - Payment status (pending, completed, failed)

- **Business rules**:
  - Total booked seats for a launch cannot exceed rocket capacity
  - Booking quantity must be 1 or more
  - Customer can have multiple bookings on different launches
  - Same customer can book multiple times on same launch (up to capacity)
  - Booking cost = seat quantity × launch price
  - Bookings are atomic: all seats reserved or entire operation fails
  - Bookings can only be made on launches in "active" status

### Persistence

- Bookings stored in in-memory `bookingStore`
- Booking repository provides CRUD operations
- Launch availability calculated dynamically: `rocket.capacity - totalBookedSeats`
- Customer booking history retrieved from store filtered by customer email

## Acceptance Criteria

- [ ] WHEN THE customer provides a valid launch ID, seat quantity, and email THEN THE SYSTEM SHALL create a booking with confirmation ID and return HTTP 201.
- [ ] WHEN THE booking request includes seat quantity exceeding available capacity THEN THE SYSTEM SHALL return HTTP 400 with error message "Insufficient seats available".
- [ ] WHEN THE booking request is for a launch not in "active" status THEN THE SYSTEM SHALL return HTTP 400 with error message "Launch is not available for booking".
- [ ] WHERE THE booking is created THE SYSTEM SHALL calculate total cost as seat quantity multiplied by launch price.
- [ ] WHERE THE booking is successful THE SYSTEM SHALL update launch availability immediately and prevent concurrent overbooking.
- [ ] WHEN THE customer requests booking history by email THEN THE SYSTEM SHALL return all bookings for that customer with complete details including status and cost.
- [ ] WHEN THE booking request includes invalid customer email format THEN THE SYSTEM SHALL return HTTP 400 with validation error message.
- [ ] WHEN THE booking is created THE SYSTEM SHALL initialize payment status as "pending" and await payment processing.
- [ ] IF THE total booked seats plus new booking exceeds rocket capacity THEN THE SYSTEM SHALL rollback the booking and return HTTP 400.
