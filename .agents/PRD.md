# AstroBookings Product Requirements Document

A backend API for managing and booking seats on rocket launches for space travel.

## Vision and Scope

AstroBookings provides a RESTful API that enables travel agents and administrators to manage rocket inventory, schedule launches with pricing and capacity constraints, and allow customers to book seats on scheduled space flights. The system validates all business rules (capacity limits, minimum passengers, rocket availability) and tracks the complete lifecycle of launches from scheduling to completion.

**Target Users:**
- **Travel Agents**: Browse available rockets and launches to match customer requirements
- **System Administrators**: Manage rocket inventory and schedule launches
- **Customers**: View available launches and book seats (via integrated booking systems)
- **Booking Systems**: Automated integration for seat reservations and availability checks

**Scope:**
The product focuses on backend API operations for rocket and launch management, customer bookings, and basic payment processing. It provides RESTful endpoints with comprehensive validation, error handling, and logging capabilities.

**Out of Scope:**
- User authentication and authorization (demo system)
- Database persistence (in-memory storage only)
- Production-grade security features
- Payment gateway integration (mock only)
- Frontend user interface
- Real-time seat availability websockets
- Multi-currency support
- Refund processing

## Functional Requirements

### FR1: Rocket Inventory Management
Administrators can create, read, update, and delete rockets with specific ranges (suborbital, orbital, moon, mars) and passenger capacity (1-10 seats). The system validates rocket properties including name uniqueness, valid range values, and capacity constraints. Rockets can be filtered by range and minimum capacity, with paginated listings for efficient browsing.
- **Status**: Implemented

### FR2: Launch Scheduling and Management
Administrators can schedule launches for specific rockets with configurable pricing, scheduled dates, and minimum passenger thresholds. The system validates that minimum passengers don't exceed rocket capacity, scheduled dates are in the future, and prices are positive. Launch status transitions through a lifecycle (scheduled → active → completed/cancelled) with automatic availability calculation based on rocket capacity minus booked seats.
- **Status**: Implemented

### FR3: Customer Registration and Profile Management
Customers are identified by unique email addresses and maintain profiles with name and phone number. The system validates email uniqueness and format, stores customer contact information, and allows profile updates. Multiple bookings per customer are supported with full booking history tracking.
- **Status**: Implemented

### FR4: Seat Booking and Reservation
Customers can book single or multiple seats on scheduled launches based on available inventory. The system validates seat availability in real-time, prevents overbooking beyond rocket capacity, calculates total booking cost based on seat quantity and launch pricing, and confirms bookings atomically or rolls back on failure.
- **Status**: Coded

### FR5: Payment Processing
Customers are billed upon successful booking through a mock payment gateway. The system generates payment records with booking references, processes payments with success/failure handling, and prevents booking confirmation until payment succeeds. Payment status is tracked for each booking transaction.
- **Status**: NotStarted

### FR6: Launch Status Lifecycle Management
Launches progress through defined status transitions: scheduled (initial creation), active (accepting bookings), completed (launch executed successfully), suspended (temporarily unavailable), or cancelled (permanently stopped). Status changes are validated according to business rules and trigger appropriate notifications through the logging system.
- **Status**: InProgress

## Technical Requirements

### TR1: RESTful API Architecture with Express.js
The system is built as a stateless RESTful API using Express.js 4.21 on Node.js 22 with TypeScript 5.6. All endpoints follow REST conventions (GET, POST, PUT, DELETE) with appropriate HTTP status codes (200, 201, 400, 404, 500), return JSON responses with consistent error formats including field-level validation details, and use type-safe implementations for request/response handling.
- **Status**: Implemented

### TR2: In-Memory Data Storage
The system uses in-memory data stores for rockets, launches, customers, and bookings without database persistence. This approach is suitable for demonstration and training purposes. Data structures use TypeScript types for compile-time safety and support CRUD operations with filtering and pagination capabilities.
- **Status**: Implemented

### TR3: Comprehensive Validation and Error Handling
All user inputs are validated with custom validation utilities that check data types, ranges, and business rules. The system uses custom error classes (AppError, ValidationError) for structured error responses, returns field-level validation errors with descriptive messages, and logs all errors with appropriate severity levels (info, warn, error, debug).
- **Status**: Implemented

### TR4: Observable Operations with Leveled Logging
The system implements structured logging with configurable log levels (info, warn, error, debug) controlled via LOG_LEVEL environment variable. All operations log significant events including entity creation, updates, deletions, validation failures, and system errors. Logs include ISO timestamps and contextual information for debugging and monitoring.
- **Status**: Implemented

### TR5: Automated Testing with Playwright and Vitest
End-to-end acceptance tests validate all acceptance criteria using Playwright 1.58. Tests cover happy paths, validation errors, edge cases, and business rule enforcement. The test suite validates HTTP endpoints, response formats, status codes, and error messages with comprehensive assertions for data integrity. Unit tests validate business logic in services and utilities using Vitest with mocked dependencies for isolated testing.
- **Status**: Implemented
