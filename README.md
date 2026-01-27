# AstroBookings 

A **backend API** for offering bookings for rocket launches.

- Rockets have limited seats; launch requests are validated against rocket capacity.

- Launches are scheduled for specific rockets, with pricing and minimum passenger thresholds.

- Launch status lifecycle: scheduled → confirmed → successful, or cancellation/suspension paths.

- A customer is identified by their email address and has a name and phone number.

- One customer can book multiple seats on a launch but cannot exceed the available seats.

- Customers are billed upon booking, and payments are processed through a mock gateway.

## Features

### Rocket Management API
- Create, read, update, and delete rockets
- Filter rockets by range (suborbital, orbital, moon, mars)
- Filter rockets by minimum capacity (1-10 passengers)
- Paginated rocket listings
- Full data validation and error handling

> [!WARNING]
> AstroBookings is a fictional space travel company.
> The system is designed for demonstration and training purposes. 
> Not for production use; no security or database is required at the initial stage.

---

- [Repository at GitHub](https://github.com/AlbertoBasaloAcademy/astro-bookings-demo)
- Default branch: `main`

- **Author**: [Alberto Basalo](https://albertobasalo.dev)
- **Ai Code Academy en Español**: [AI code Academy](https://aicode.academy)
- **Socials**:
  - [X](https://x.com/albertobasalo)
  - [LinkedIn](https://www.linkedin.com/in/albertobasalo/)
  - [GitHub](https://github.com/albertobasalo)
