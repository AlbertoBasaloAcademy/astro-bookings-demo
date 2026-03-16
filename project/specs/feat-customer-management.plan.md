# Implementation Plan for Customer Management (FR3)

## Step 1: Create Customer Type Definitions
Define the TypeScript types and data structures for the customer domain.

- [ ] Create `src/types/customer.ts` with Customer type, request/response DTOs
- [ ] Define validation constraints (email regex, phone format, name length rules)
- [ ] Include timestamps for createdAt and updatedAt fields

## Step 2: Build In-Memory Customer Store
Implement the data persistence layer for customer records.

- [ ] Create `src/services/customerStore.ts` with array-based store
- [ ] Implement store initialization with ID counter for UUID generation
- [ ] Provide methods for adding, finding, updating, and deleting customers
- [ ] Add email-based lookup with uniqueness enforcement

## Step 3: Implement Customer Repository
Create the data access abstraction layer following existing patterns.

- [ ] Create `src/services/customer.repository.ts` 
- [ ] Implement CRUD operations (create, findById, findByEmail, update, delete, findAll)
- [ ] Add filtering and pagination support for list operations
- [ ] Handle repository-level data consistency checks

## Step 4: Build Customer Service Layer
Implement business logic and validation orchestration.

- [ ] Create `src/services/customer.service.ts`
- [ ] Implement email uniqueness validation before creation
- [ ] Add email format, phone format, and name validation
- [ ] Prevent email modification during updates
- [ ] Log all service operations (create, update, delete)
- [ ] Wrap repository calls with error handling and transformations

## Step 5: Create Customer Routes and Handlers
Implement REST API endpoints for customer management.

- [ ] Create `src/routes/customerRoutes.ts` with Express route handlers
- [ ] Implement POST /customers (register new customer)
- [ ] Implement GET /customers/:id (retrieve by ID)
- [ ] Implement GET /customers/email/:email (retrieve by email)
- [ ] Implement PUT /customers/:id (update profile)
- [ ] Implement DELETE /customers/:id (delete customer)
- [ ] Implement GET /customers (list with pagination)
- [ ] Add proper HTTP status codes: 200, 201, 400, 404, 500

## Step 6: Extend Validation Utilities
Add customer-specific validation helpers to shared utilities.

- [ ] Update `src/utils/validation.ts` with email regex validation
- [ ] Add phone format validation (international format)
- [ ] Add name length and character validation
- [ ] Add function for checking email uniqueness via repository lookup

## Step 7: Integrate Routes into Main Application
Connect customer routes to the Express application.

- [ ] Update `src/index.ts` to import and register customerRoutes
- [ ] Ensure routes are mounted before error handling middleware
- [ ] Verify middleware execution order

## Step 8: Create End-to-End Test Suite
Implement comprehensive Playwright tests for all acceptance criteria.

- [ ] Create `tests/customers.spec.ts` with test scenarios
- [ ] Test happy path: register, retrieve, update customer
- [ ] Test validation: invalid email, duplicate email, invalid phone
- [ ] Test error cases: not found, immutable email protection
- [ ] Test pagination and filtering
- [ ] Verify response status codes and error messages

## Step 9: Documentation and Code Review
Complete implementation and prepare for deployment.

- [ ] Update spec file status to "Coded"
- [ ] Run full test suite and verify all tests pass
- [ ] Commit changes with conventional commit messages
- [ ] Update CHANGELOG.md with new features
- [ ] Verify integration with existing rocket and launch endpoints
