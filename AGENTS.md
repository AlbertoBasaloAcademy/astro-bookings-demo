# Agents Instructions

## Product Overview
AstroBookings is a backend API for booking rocket launches.
Rockets have capacity limits and launch status lifecycles.
Customer booking and payment features are planned.
This is a demo system for training purposes.

## Technical Implementation

### Tech Stack
- Language: **TypeScript 5.6** on **Node.js 22**
- Framework: **Express 4.21**
- Database: **In-memory store** (no persistence)
- Security: **None** (demo only)
- Testing: **Playwright 1.58** (E2E), **Vitest 4.0** (unit)
- Logging: **Console via logger utility** (info/warn/error/debug)
- Version: **1.3.0** (tracked in CHANGELOG.md)

### Development workflow
```bash
# Set up the project
npm install

# Build/Compile the project
npm run build

# Run the project
npm run dev        # Development mode with watch
npm start          # Production mode

# Test the project
npm test           # Run Playwright E2E tests
npm run test:dev   # Run unit tests in watch mode
npm run test:unit  # Run all unit tests once
npm run test:coverage  # Generate unit test coverage report

# Deploy the project
# No deployment configured - demo only
```

### Folder structure
```text
.                         # Project root  
├── AGENTS.md             # This file with instructions for AI agents
├── .agents/              # Agent docs and skills
│   ├── PRD.md            # Product Requirements Document
│   ├── ADD.md            # Architectural Design Document
│   └── skills/           # Agent skills and templates
├── README.md             # The main human documentation file
├── CHANGELOG.md          # Version history and release notes
├── package.json          # Node.js dependencies and scripts
├── tsconfig.json         # TypeScript configuration
├── playwright.config.ts  # Playwright test configuration
├── specs/                # Specification documents
│   ├── rockets.spec.md   # Rocket API specification
│   └── launches.spec.md  # Launches API specification
├── src/                  # Source code
│   ├── index.ts          # Application entry point
│   ├── routes/           # Express route handlers
│   │   ├── launchRoutes.ts
│   │   └── rocketRoutes.ts
│   ├── services/         # Business logic and data stores
│   │   ├── launch.repository.ts
│   │   ├── launch.service.ts
│   │   ├── launchStore.ts
│   │   ├── rocket.repository.ts
│   │   ├── rocket.service.ts
│   │   └── rocketStore.ts
│   ├── types/            # TypeScript type definitions
│   │   ├── launch.ts     # Launch types and data structures
│   │   └── rocket.ts     # Rocket types and data structures
│   └── utils/            # Shared utilities
│       ├── error-handler.ts   # Error handling with custom error types
│       ├── logger.ts          # Leveled logging utility
│       └── validation.ts      # Input validation helpers
└── tests/                # Playwright test files
    ├── health.spec.ts    # Health check tests
    └── rockets.spec.ts   # Rocket API tests
```

### Architecture & Coding Standards
- **Type definitions**: Use `type` for data structures, `interface` for class contracts (per TypeScript instructions in .github/instructions/)
- **File naming**: `kebab-case.{pattern}.ts` (e.g., `rocket.service.ts`, `error-handler.ts`)
- **Exports**: Prefer named exports over default exports
- **Error handling**: Custom error classes (`AppError`, `ValidationError`) with structured error responses
- **Validation**: Centralized validation in utilities
- **Data storage**: In-memory stores for demo purposes
- **Logging**: Structured logging with levels (info, warn, error, debug) via LOG_LEVEL env var

## Environment
- Code and documentation must be in English.
- Chat responses must be in the language of the user prompt.
- Sacrifice grammar for conciseness in responses.
- This is a windows environment using git bash terminal.
- My default branch is `main`.
- Remote repository, with active issues, is hosted on GitHub :
  - [AlbertoBasaloAcademy / astro-bookings-demo](https://github.com/AlbertoBasaloAcademy/astro-bookings-demo)