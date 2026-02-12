# AstroBookings Briefing

A **backend API** for offering bookings for rocket launches.

- Launches are scheduled for specific rockets, with pricing and minimum passenger thresholds.

- Rockets have limited seats; launch requests are validated against rocket capacity.

- Launch status lifecycle: scheduled → confirmed → successful, or cancellation/suspension paths.

- A customer is identified by their email address and has a name and phone number.

- One customer can book multiple seats on a launch but cannot exceed the available seats.

- Customers are billed upon booking, and payments are processed through a mock gateway.

> [!WARNING]
> AstroBookings is a fictional space travel company.
> The system is designed for demonstration and training purposes. 
> Not for production use; no security or database is required at the initial stage.