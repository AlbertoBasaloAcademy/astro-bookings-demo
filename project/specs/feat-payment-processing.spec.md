# Payment Processing Specification
- **Type**: feat
- **Status**: Draft

## Problem Description

Bookings already track a payment status, but AstroBookings does not yet provide a payment flow that moves a booking from pending to a clear payment outcome. Without a mock payment processing capability, the demo cannot represent the full booking lifecycle, test payment-related failure paths, or show how booking state depends on payment completion in a controlled backend-only scenario.

### User Stories

- As a **travel agent**, I want to **submit a mock payment for an existing booking** so that **I can complete the booking flow in the demo system**.
- As a **booking system**, I want to **receive a clear success or failure outcome for a payment attempt** so that **I can update the booking state consistently**.
- As a **system administrator**, I want to **review payment status on bookings** so that **I can understand whether a booking is still pending, completed, or failed**.

## Solution Overview

### User/App interface

- Provide an application flow to trigger mock payment processing for an existing booking.
- Return the booking reference together with the resulting payment status and a clear outcome message.
- Expose payment status in booking retrieval responses so clients can verify the latest state after processing.

### Model and logic

- Use the existing booking payment states: `pending`, `completed`, and `failed`.
- Allow payment processing only for valid existing bookings that are eligible for payment.
- Apply one deterministic mock payment outcome per payment request and update the booking payment status accordingly.
- Prevent ambiguous booking state by rejecting invalid payment attempts, such as processing a booking that cannot be paid.

### Persistence

- Persist the latest payment status as part of the existing in-memory booking record.
- Keep payment outcome changes available through normal booking reads for the lifetime of the running application.
- No external gateway or durable payment ledger is introduced in this backlog item.

## Acceptance Criteria

- [ ] WHEN a client submits a valid payment request for an existing booking with payment status `pending` THEN THE SYSTEM SHALL process the mock payment and return a payment outcome for that booking.
- [ ] WHEN the mock payment outcome is successful THEN THE SYSTEM SHALL update the booking payment status to `completed`.
- [ ] WHEN the mock payment outcome is unsuccessful THEN THE SYSTEM SHALL update the booking payment status to `failed`.
- [ ] WHEN a client requests a booking after payment processing THEN THE SYSTEM SHALL return the latest payment status for that booking.
- [ ] WHEN a client submits a payment request for a booking that does not exist THEN THE SYSTEM SHALL reject the request with a not found error.
- [ ] WHEN a client submits a payment request for a booking that is not eligible for payment processing THEN THE SYSTEM SHALL reject the request with a validation error.
- [ ] WHEN a booking payment status has already been set to `completed` THEN THE SYSTEM SHALL prevent the booking from being paid again.
- [ ] WHEN payment processing changes the payment status THEN THE SYSTEM SHALL preserve the booking reference and all non-payment booking data unchanged.

## PRD Note

- PRD wording should continue to present this item as backlog work not yet started.
- The current FR5 wording in [project/PRD.md](project/PRD.md#L39) already matches that expectation with status `NotStarted`.