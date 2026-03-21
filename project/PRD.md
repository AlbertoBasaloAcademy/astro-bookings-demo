# AstroBookings Product Requirements Document

Backend API for managing rockets, launches, customers, and seat bookings for demo space travel operations.

## Vision and Scope

AstroBookings provides a REST API for managing rocket inventory, scheduling launches, registering customers, and creating bookings while enforcing capacity and availability rules. The product is intended for training and architecture practice rather than production use.

**Target Users:**
- **Administrators**: Manage rockets and launches.
- **Travel Agents**: Check launch availability and create bookings for customers.
- **Client Systems**: Integrate with customer and booking endpoints for demo workflows.

**In Scope:**
- Rocket CRUD with filtering and pagination.
- Launch CRUD with pricing, date, and capacity validation.
- Customer CRUD with unique and immutable email identity.
- Booking creation, retrieval, customer history, and launch availability checks.
- Structured validation, JSON error responses, logging, and automated tests.

**Out of Scope:**
- Authentication and authorization.
- Database persistence.
- Real payment gateway integration.
- Refund workflows.
- Frontend UI.
- Real-time notifications or websockets.

## Functional Requirements

### FR1: Rocket Inventory Management
Administrators can create, list, filter, update, and delete rockets. Rockets include name, range, and capacity, and the API validates uniqueness, allowed ranges, and seat limits.
- **Status**: Implemented

### FR2: Launch Scheduling and Availability
Administrators can create, list, update, and delete launches linked to rockets. Launches store scheduled date, price, minimum passengers, and status. API responses include derived availability based on rocket capacity and current bookings.
- **Status**: Implemented

### FR3: Customer Registration and Profile Management
The system can create, retrieve, list, update, and delete customers. Customers are identified by unique email addresses, and email cannot be changed after creation.
- **Status**: Implemented

### FR4: Booking Creation and Capacity Enforcement
The system can create bookings for existing customers on active launches, calculate total price from seat count and launch price, reject invalid seat counts, and prevent overbooking.
- **Status**: Implemented

### FR5: Booking Retrieval and Availability Checks
The system can retrieve a booking by ID, list bookings by launch, list bookings by customer email, and expose launch availability for seat checks.
- **Status**: Implemented

### FR6: Booking Cancellation and Seat Release
The system should allow an existing booking to be cancelled while preserving booking history and releasing seats back to launch availability. Refund processing is not part of this requirement.
- **Status**: NotStarted

### FR7: Payment Processing
The system should support mock payment processing for existing bookings, updating booking payment status from pending to completed or failed. Real payment gateways and financial reconciliation are out of scope.
- **Status**: NotStarted

### FR8: Launch Lifecycle Guards
The system should enforce valid launch status transitions between scheduled, active, completed, and cancelled, rejecting invalid lifecycle changes instead of accepting arbitrary status updates.
- **Status**: NotStarted

## Technical Requirements

### TR1: Express and TypeScript REST API
The product is implemented as a stateless JSON REST API using Express 4.21 on Node.js 22 with TypeScript 5.6. The API exposes health, rocket, launch, customer, and booking endpoints with standard HTTP status codes.
- **Status**: Implemented

### TR2: In-Memory Domain Storage and Derived Read Models
The system stores rockets, launches, customers, and bookings in process memory. Availability and enriched booking responses are derived at read time rather than persisted separately.
- **Status**: Implemented

### TR3: Validation, Error Handling, and Logging
The API validates request payloads and business rules, returns structured JSON errors with field-level details, and emits leveled console logs for operational visibility.
- **Status**: Implemented

### TR4: Automated API and Unit Test Coverage
The product includes Playwright end-to-end tests for API behavior and Vitest unit tests for services, repositories, and utilities.
- **Status**: Implemented
