# AstroBookings Briefing

AstroBookings is a backend API for booking rocket launches.
It is a demo project for training, not production.
Rockets define seat capacity and model details.
Launches use one rocket, date, base price, and status.
Statuses are scheduled, confirmed, successful, or cancelled.
Customers use email as identity, plus name and phone.
A customer can book seats on a launch.
Bookings must not exceed available seats.
Validation runs before state changes.
Data is in memory, with no persistent database.
Security hardening is out of scope in this phase.
Testing uses Playwright for E2E and Vitest for units.
Goal is clear code that is easy to evolve.
Near term focus is booking and payment flow.