---
name: coding-express-api
description: "Writes API endpoints with Express.js following layered architecture patterns.To be used for implementing RESTful endpoints with validation, error handling, and business logic."
--- 

# Writing an Express API

Follow a **layered architecture** with clear separation of concerns between HTTP handling (routes), business logic (services), and data models (types).

## Layered Architecture Pattern

The application uses three main layers:

```
Routes (HTTP Layer)
    ↓
Services (Business Logic)
    ↓
Types (Domain Models)
```

## Project Structure

Organize code by technical layer:

```
src/
├── index.ts              # Express app setup, middleware, route registration
├── routes/               # HTTP layer - one file per resource
│   └── resource.ts       # Express Router with endpoint definitions
├── services/             # Business logic - one service per domain
│   └── resourceService.ts
├── types/                # Type definitions - one file per domain
│   └── resource.ts       # Interfaces, DTOs, and domain types
└── utils/                # Shared utilities (logging, helpers)
    └── logger.ts
```

## Routes Layer

### File Naming
- Use kebab-case: `rockets.ts`, `launches.ts`
- One route file per resource
- Use `.ts` extension (no `.routes` suffix needed)

### Route Handler Pattern

Routes instantiate a service and delegate HTTP concerns:
- Extract and validate request data
- Call service methods
- Return appropriate HTTP status codes and response bodies
- Use error handling with try-catch for robustness

See [controller.ts](./controller.ts) template for complete example implementation.

### HTTP Status Codes

| Method | Success | Validation Error | Not Found |
|--------|---------|------------------|-----------|
| GET    | 200     | N/A              | 404       |
| POST   | 201     | 400              | N/A       |
| PUT    | 200     | 400              | 404       |
| DELETE | 204     | N/A              | 404       |

### Error Response Format

Return validation errors as an array:

```typescript
res.status(400).json({
  errors: [
    { field: 'name', message: 'Name is required' },
    { field: 'price', message: 'Price must be positive' }
  ]
});
```

## Services Layer

### File Naming
- Use kebab-case with `.service` suffix: `rocket.service.ts`, `launch.service.ts`
- One service class per domain

### Service Pattern

Services encapsulate all business logic for a resource:
- Manage in-memory Map storage with auto-incrementing ID generation
- Implement CRUD methods (create, getById, getAll, update, delete)
- Provide separate validation methods that return all errors at once
- Use consistent error throwing for exceptional conditions
- Log important operations with component context

Key patterns:
- **IDs**: Generate with pattern `resource-${incrementingId++}`
- **Validation**: Return array of `{ field, message }` objects, never throw validation errors
- **Updates**: Include `updatedAt` timestamp, merge request with existing data
- **Deletion**: Idempotent (safe to call multiple times on same ID)

See [service.ts](./service.ts) template for complete example implementation.

## Types Layer

### File Naming
- Use kebab-case: `rocket.ts`, `launch.ts`
- One type file per domain

### Type Definitions

Organize types into three categories:
- **Domain Entity**: The resource as stored (includes id, timestamps)
- **Request DTOs**: Input contracts for create and update operations
- **Error Types**: Validation and error response structures

Use literal unions for enums and optional fields for partial updates.

See [types.ts](./types.ts) template for complete example implementation.

### Type Guidelines

- Use separate request/response types (DTO pattern)
- Define enums or literal unions for fixed values (prefer unions: `'active' | 'inactive' | 'retired'`)
- Use `readonly` for immutable properties
- Avoid `any` type - use strict typing
- Export interfaces, not type aliases for public contracts

## Utils Layer

### Common Utilities

Utilities provide cross-cutting concerns like logging and helpers:

```typescript
// logger.ts
export const logger = {
  info(component: string, message: string, data?: unknown): void {
    console.log(`[${component}] ${message}`, data ? JSON.stringify(data) : '');
  },
  error(component: string, message: string, data?: unknown): void {
    console.error(`[${component}] ERROR: ${message}`, data ? JSON.stringify(data) : '');
  },
  warn(component: string, message: string, data?: unknown): void {
    console.warn(`[${component}] WARN: ${message}`, data ? JSON.stringify(data) : '');
  },
};
```

Key patterns:
- Keep utilities simple and focused
- Provide consistent interfaces across the app
- Use for shared validation, formatting, or constants

## Application Setup

### Index Entry Point

The entry point (`src/index.ts`) sets up Express with middleware and registers route handlers:

```typescript
import express from 'express';
import rocketsRouter from './routes/rockets';
import { logger } from './utils/logger';

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

app.get('/', (req, res) => {
  res.status(200).json({ status: 'ok', message: 'AstroBookings API' });
});

app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok' });
});

app.use('/rockets', rocketsRouter);
app.use('/launches', launchesRouter);

app.listen(PORT, () => {
  logger.info('Server', `Running on port ${PORT}`);
});

export default app;
```

Key patterns:
- One line per route registration
- JSON middleware should be first after app creation
- Include health check endpoints
- Log server startup with port

## Best Practices

1. **Validation**: Always validate and return all errors in one response
2. **Error Handling**: Use try-catch for async operations, throw descriptive errors
3. **Status Codes**: Use correct HTTP status codes (201 for created, 204 for deleted, etc.)
4. **Logging**: Log important operations with context
5. **Type Safety**: Use strict typing, avoid `any`
6. **Single Responsibility**: Keep routes thin, move logic to services
7. **Separation of Concerns**: Don't mix HTTP logic with business logic
8. **ID Generation**: Use service-generated IDs with pattern `resource-${incrementingId}`
