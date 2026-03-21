# AstroBookings

AstroBookings is a backend API for managing rockets, launches, customers, and seat bookings for demo space travel operations.

## Current Scope

- Rockets have limited capacity and support filtering and pagination.
- Launches are scheduled for specific rockets with pricing, minimum passenger thresholds, and status.
- Customers are identified by unique email and store name and phone details.
- Bookings reserve seats on active launches and update derived availability.
- Payment status exists on bookings as a placeholder field, but payment execution is not implemented.

## Implemented Features

### Rocket Management
- Create, read, update, and delete rockets.
- Filter rockets by range and minimum capacity.
- Return paginated rocket listings.

### Launch Management
- Create, read, update, and delete launches.
- Validate future dates, positive price, and capacity constraints.
- Return launch responses with `rocketName`, `totalSeats`, `bookedSeats`, and `availableSeats`.

### Customer Management
- Create, read, update, delete, and list customers.
- Enforce unique email identity.
- Reject email changes after creation.

### Booking Management
- Create bookings for existing customers on active launches.
- Retrieve bookings by ID, by launch, and by customer email.
- Calculate total booking cost from seat count and launch price.
- Reject overbooking based on derived seat availability.

## Planned Backlog

- Booking cancellation and seat release.
- Mock payment processing for bookings.
- Launch lifecycle transition guards.
- Authentication and persistent storage remain out of scope for the current demo phase.

## API Surface

- `GET /health`
- `GET|POST|PUT|DELETE /api/rockets`
- `GET|POST|PUT|DELETE /api/launches`
- `GET /api/launches/:launchId/availability`
- `GET|POST|PUT|DELETE /api/customers`
- `POST /api/bookings`
- `GET /api/bookings/:id`
- `GET /api/bookings/launch/:launchId`
- `GET /api/bookings/customer/:email`

## Development

```bash
npm install
npm run build
npm run dev
npm test
npm run test:unit
```

## Logging

- Logs are written to stdout and stderr with timestamped level tags.
- Default log level is `info`.
- Set `LOG_LEVEL=debug` to enable debug logs.

## Notes

> [!WARNING]
> AstroBookings is a fictional training project.
> It is intentionally in-memory, unauthenticated, and not designed for production use.

- [Repository at GitHub](https://github.com/AlbertoBasaloAcademy/astro-bookings-demo)
- Default branch: `main`
- **Author**: [Alberto Basalo](https://albertobasalo.dev)
