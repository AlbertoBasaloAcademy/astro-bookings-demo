# Booking Cancellation and Seat Release Specification
- **Type**: feat
- **Status**: Draft

## Problem Description

Booking creation and retrieval already exist, but there is no way to cancel an existing booking. This leaves seats locked even when a customer or agent no longer intends to use them, and it prevents launch availability from reflecting real demand. The system needs a clear cancellation flow that preserves booking history while releasing seats back to availability.

### User Stories

- As a **customer**, I want to **cancel a booking I no longer need** so that **the reserved seats are released**.
- As a **travel agent**, I want to **see availability increase after a cancellation** so that **I can resell those seats**.
- As a **system administrator**, I want to **keep cancelled bookings in history** so that **booking records remain traceable**.

## Solution Overview

### User/App interface

- Add a booking cancellation operation on the existing booking API.
- Return the updated booking with status `cancelled` when cancellation succeeds.
- Keep booking retrieval endpoints able to return cancelled bookings.
- Make launch and booking availability views reflect released seats after cancellation.

### Model and logic

- Allow a booking to move from `pending` or `confirmed` to `cancelled`.
- Treat only non-cancelled bookings as seat-consuming for availability calculations.
- Reject cancellation when the booking does not exist or is already cancelled.
- Preserve payment status for visibility; refund handling remains out of scope for this backlog item.

### Persistence

- Update the existing in-memory booking record instead of deleting it.
- Persist the new booking status and updated timestamp in the booking store.
- Keep availability derived from rocket capacity minus non-cancelled bookings.

## Acceptance Criteria

- [ ] WHEN a client cancels an existing `pending` booking THE AstroBookings API SHALL mark the booking as `cancelled` and return the updated booking.
- [ ] WHEN a client cancels an existing `confirmed` booking THE AstroBookings API SHALL mark the booking as `cancelled` and return the updated booking.
- [ ] WHEN a booking becomes `cancelled` THE AstroBookings API SHALL exclude its `seatCount` from launch availability calculations.
- [ ] WHEN a cancelled booking is retrieved THE AstroBookings API SHALL return the booking with status `cancelled` and its current payment status.
- [ ] IF the requested booking does not exist THEN THE AstroBookings API SHALL return HTTP 404.
- [ ] IF the requested booking is already `cancelled` THEN THE AstroBookings API SHALL reject the cancellation and leave seat availability unchanged.
- [ ] WHEN a cancellation succeeds THE AstroBookings API SHALL preserve the booking in customer and launch history.
- [ ] WHILE seats have been released by cancellation THE AstroBookings API SHALL allow later bookings to use those seats up to the rocket capacity.
- [ ] WHERE booking cancellation is supported THE AstroBookings API SHALL treat refund processing as out of scope for this feature.