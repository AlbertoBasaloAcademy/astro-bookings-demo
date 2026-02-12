# Implementation Plan for feat-seat-booking

## Overview
Implement the Seat Booking and Reservation feature (FR4) following the existing layered architecture pattern: types → store → repository → service → routes. This plan prioritizes atomic operations for data integrity and comprehensive validation against business rules.

---

## Step 1: Define types and data structures for Booking
Create TypeScript type definitions for the Booking domain model and related interfaces.

- [ ] Create `src/types/booking.ts` with `Booking`, `BookingStatus`, `BookingRequest`, and `BookingResponse` types
- [ ] Add `PaymentStatus` type for tracking payment state (pending | completed | failed)
- [ ] Define `BookingAPIResponse` to match existing response patterns in other types files
- [ ] Add Business rule constants (e.g., MIN_SEATS, STATUS_VALUES)

---

## Step 2: Create in-memory store for bookings
Implement the data storage layer for bookings using in-memory collections.

- [ ] Create `src/services/bookingStore.ts` with booking array storage and ID management
- [ ] Implement `addBooking(booking: Booking)` to append booking to store
- [ ] Implement `getBookingById(id: string)` to retrieve single booking
- [ ] Implement `getBookingsByLaunchId(launchId: string)` to find all bookings for a launch
- [ ] Implement `getBookingsByCustomerEmail(email: string)` to filter bookings by customer

---

## Step 3: Create repository layer for bookings
Build the repository pattern to abstract data access from business logic.

- [ ] Create `src/services/booking.repository.ts` with CRUD operations
- [ ] Implement `createBooking(booking: Booking): Booking` with ID generation
- [ ] Implement `getBookingById(id: string): Booking | undefined`
- [ ] Implement `findByLaunchId(launchId: string): Booking[]` for capacity checks
- [ ] Implement `findByCustomerEmail(email: string): Booking[]` for history
- [ ] Implement `getAvailableSeats(launchId: string): number` by calculating rocket capacity minus total booked

---

## Step 4: Create service layer with business logic
Implement core feature logic with validation and error handling.

- [ ] Create `src/services/booking.service.ts` with business rule enforcement
- [ ] Implement `createBooking(req: BookingRequest): BookingResponse` with:
  - Customer email validation (required, correct format)
  - Launch existence and status validation (must be "active")
  - Seat quantity validation (must be ≥ 1)
  - Availability check (total requested ≤ available)
  - Atomic booking creation with cost calculation
  - Rollback on any validation failure
- [ ] Implement `getBookingById(id: string): BookingResponse` with error for missing booking
- [ ] Implement `getBookingsByLaunchId(launchId: string): BookingResponse[]`
- [ ] Implement `getBookingsByCustomerEmail(email: string): BookingResponse[]`
- [ ] Implement `getAvailableSeats(launchId: string): number` with launch validation

---

## Step 5: Create REST routes and endpoints
Build Express route handlers integrating service layer with HTTP.

- [ ] Create `src/routes/bookingRoutes.ts` with route handlers
- [ ] Implement `POST /launches/:launchId/bookings` to create booking:
  - Parse JSON body (customerEmail, seatCount)
  - Call service.createBooking()
  - Return HTTP 201 with booking details on success
  - Return HTTP 400 with field-level validation errors
  - Return HTTP 404 if launch not found
- [ ] Implement `GET /launches/:launchId/bookings/:bookingId` to retrieve booking:
  - Return HTTP 200 with booking details
  - Return HTTP 404 if not found
- [ ] Implement `GET /customers/:email/bookings` to list customer bookings:
  - Return HTTP 200 with array of bookings
  - Return HTTP 200 with empty array if no bookings found
- [ ] Implement `GET /launches/:launchId/availability` to check seats:
  - Return HTTP 200 with remaining seat count
  - Return HTTP 404 if launch not found
- [ ] Mount routes in `src/index.ts` at prefix `/api/bookings`

---

## Step 6: Write unit tests for service and repository
Test business logic in isolation using Vitest with mocked dependencies.

- [ ] Create `src/services/booking.service.spec.ts`:
  - Test successful booking creation with valid input
  - Test rejection when launch is not in "active" status
  - Test rejection when insufficient seats available
  - Test rejection for invalid customer email
  - Test rejection when seat quantity ≤ 0
  - Test rollback on validation failure
  - Test cost calculation accuracy (seats × price)
  - Test atomic transaction semantics
- [ ] Create `src/services/booking.repository.spec.ts`:
  - Test booking creation and ID generation
  - Test retrieval by ID
  - Test filtering by launch ID
  - Test filtering by customer email
  - Test available seats calculation

---

## Step 7: Write E2E acceptance tests
Verify acceptance criteria through full HTTP API tests using Playwright.

- [ ] Create `tests/bookings.spec.ts` with scenarios:
  - Happy path: POST booking with valid data → HTTP 201 + booking confirmation
  - Capacity validation: POST booking exceeding available → HTTP 400 "Insufficient seats"
  - Launch status validation: POST booking on inactive launch → HTTP 400 "Launch is not available"
  - Email validation: POST booking with invalid email → HTTP 400 validation error
  - Seat quantity validation: POST booking with 0 seats → HTTP 400
  - Retrieve booking: GET existing booking → HTTP 200 with correct details
  - Retrieve non-existent: GET missing booking → HTTP 404
  - Customer history: GET /customers/email/bookings → HTTP 200 with all bookings
  - Availability check: GET /launches/{id}/availability → HTTP 200 with remaining seats
  - Concurrent bookings: Verify atomic operations prevent overbooking
  - Cost calculation: Verify totalPrice = seatCount × launchPrice

---

## Dependencies Between Steps

```
Step 1 (Types) → Step 2 (Store) → Step 3 (Repository)
                                 ↓
Step 4 (Service) ← Step 3 + Step 1
    ↓
Step 5 (Routes) ← Step 4
    ↓
Step 6 (Unit Tests) ← Step 3 + Step 4
    ↓
Step 7 (E2E Tests) ← Step 5 + routes mounted
```

Steps can be worked in parallel where no dependencies exist, but typically flow left-to-right for TDD approach.

---

## Definition of Done

- [ ] All types defined in `src/types/booking.ts`
- [ ] In-memory store created in `src/services/bookingStore.ts`
- [ ] Repository implemented in `src/services/booking.repository.ts`
- [ ] Service layer with all business rules in `src/services/booking.service.ts`
- [ ] REST routes created in `src/routes/bookingRoutes.ts` and mounted in `src/index.ts`
- [ ] Unit tests pass with >80% coverage of service and repository
- [ ] E2E tests pass for all 11 acceptance criteria scenarios
- [ ] All builds successfully with `npm run build`
- [ ] Specification status updated to "Coded" after implementation complete
- [ ] Branch merged to main after all reviews pass
