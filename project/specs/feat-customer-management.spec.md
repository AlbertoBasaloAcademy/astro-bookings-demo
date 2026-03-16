# Customer Management API Specification
- **Type**: feat
- **Status**: Released

## Problem Description

Customers need to be registered and identified uniquely in the system to enable seat bookings on space launches. The system must maintain customer profiles with contact information, validate data integrity, and support profile updates while preventing duplicate registrations.

### User Stories

- As a **customer**, I want to **register with my email and contact details** so that I can **book seats on available launches**.

- As a **booking system**, I want to **retrieve customer profiles by email** so that I can **associate bookings with existing customer accounts**.

- As a **customer**, I want to **update my profile information** so that I can **keep my contact details current for communication purposes**.

## Solution Overview

The solution implements a RESTful Customer Management API with CRUD operations following the existing architectural patterns (routes → services → repositories → stores).

### User/App interface

**REST API Endpoints:**
- `POST /customers` - Register a new customer
- `GET /customers/:id` - Retrieve customer by ID
- `GET /customers/email/:email` - Find customer by email
- `PUT /customers/:id` - Update customer profile
- `DELETE /customers/:id` - Delete customer (admin operation)
- `GET /customers` - List all customers with pagination

**Request/Response Structure:**
- JSON request bodies with validation
- Structured JSON responses with customer data
- Standard HTTP status codes (200, 201, 400, 404, 500)
- Field-level validation error messages

### Model and logic

**Customer Data Model:**
```typescript
type Customer = {
  id: string;        // UUID generated on creation
  email: string;     // Unique identifier, validated format
  name: string;      // Full name, required
  phone: string;     // Contact number, validated format
  createdAt: Date;   // Registration timestamp
  updatedAt: Date;   // Last modification timestamp
};
```

**Business Rules:**
- Email must be unique across all customers
- Email must follow valid email format (regex validation)
- Phone must follow international format (+country code)
- Name must be non-empty string (2-100 characters)
- Customer ID is auto-generated UUID
- Email is immutable after creation (cannot be updated)
- Timestamps are automatically managed

**Validation Rules:**
- Email: required, unique, valid format, max 255 characters
- Name: required, 2-100 characters, alphanumeric with spaces
- Phone: required, valid international format, 8-20 characters

### Persistence

**In-memory Store:**
- `customerStore.ts` - Maintains customer array and ID counter
- `customer.repository.ts` - CRUD operations and queries
- `customer.service.ts` - Business logic and validation orchestration
- `customerRoutes.ts` - Express route handlers

**Store Operations:**
- Create: Add customer with generated ID and timestamps
- Read: Find by ID or email with filter support
- Update: Modify mutable fields (name, phone)
- Delete: Remove customer by ID
- List: Paginated retrieval with optional filters

## Acceptance Criteria

- [ ] **GIVEN** a user submits valid customer data (email, name, phone) **WHEN** creating a new customer **THEN** THE system SHALL create the customer with a unique ID and return 201 status with the customer record.

- [ ] **GIVEN** a customer attempts registration **WHEN** the email already exists in the system **THEN** THE system SHALL return a 400 error with message "Email already registered".

- [ ] **GIVEN** a user submits customer data **WHEN** the email format is invalid **THEN** THE system SHALL return a 400 error with field-level validation error for email.

- [ ] **GIVEN** a customer exists in the system **WHEN** a user requests the customer by ID **THEN** THE system SHALL return the full customer profile with 200 status.

- [ ] **GIVEN** no customer exists with the requested ID **WHEN** a user queries by ID **THEN** THE system SHALL return a 404 error with message "Customer not found".

- [ ] **GIVEN** a customer exists with email "test@example.com" **WHEN** a user queries by email **THEN** THE system SHALL return the matching customer profile with 200 status.

- [ ] **GIVEN** an existing customer record **WHEN** a user updates name or phone with valid data **THEN** THE system SHALL update the customer, update the updatedAt timestamp, and return the updated record with 200 status.

- [ ] **GIVEN** a user attempts to update a customer **WHEN** trying to modify the email field **THEN** THE system SHALL reject the update and return a 400 error with message "Email cannot be modified".

- [ ] **GIVEN** a customer exists in the system **WHEN** an admin deletes the customer by ID **THEN** THE system SHALL remove the customer and return 204 status.

## Technical Details

### File Structure
```
src/
├── routes/
│   └── customerRoutes.ts      # Express route handlers
├── services/
│   ├── customer.repository.ts  # Data access layer
│   ├── customer.service.ts     # Business logic
│   └── customerStore.ts        # In-memory data store
└── types/
    └── customer.ts             # Customer type definitions
```

### Dependencies
- Email validation utility (extend existing validation.ts)
- Phone validation utility (add to validation.ts)
- UUID generation for customer IDs
- Logger for customer operations
- Error handler for structured responses

### Integration Points
- Future booking system will reference customer by ID
- Payment processing will retrieve customer contact info
- Launch booking will validate customer existence before reservation

### Testing Requirements
- Playwright e2e tests for all acceptance criteria
- Happy path: successful registration and retrieval
- Validation errors: invalid email, duplicate email, invalid phone
- Edge cases: special characters in name, update immutable fields
- Error handling: non-existent customer queries

---

**Related PRD**: FR3 - Customer Registration and Profile Management  
**Priority**: High (blocking for FR4 - Seat Booking)  
**Estimated Complexity**: Medium (follows existing patterns)
