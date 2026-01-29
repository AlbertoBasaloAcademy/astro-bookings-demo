# Agents Instructions

## Product Overview
AstroBookings is a backend API for booking rocket launches.
Rockets have capacity limits, launches track status lifecycle, customers book seats.
This is a demo system for training purposes, not for production use.

## Technical Implementation

### Tech Stack
- Language: **TypeScript 5.6** on **Node.js 22**
- Framework: **Express 4.21**
- Database: **In-memory store** (no persistence)
- Security: **None** (demo only)
- Testing: **Playwright 1.58**
- Logging: **Console via logger utility** (info/warn/error/debug)
- Version: **1.2.0** (tracked in CHANGELOG.md)

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
npm test           # Run Playwright tests

# Deploy the project
# No deployment configured - demo only
```

### Folder structure
```text
.                         # Project root  
├── AGENTS.md             # This file with instructions for AI agents
├── README.md             # The main human documentation file
├── CHANGELOG.md          # Version history and release notes
├── package.json          # Node.js dependencies and scripts
├── tsconfig.json         # TypeScript configuration
├── playwright.config.ts  # Playwright test configuration
├── .github/              # GitHub configuration and agent definitions
│   ├── agents/           # Custom agent definitions
│   │   ├── coder.md      # Coder agent for implementing features
│   │   └── dev-ops.md    # DevOps agent for releases and documentation
│   ├── instructions/     # Code style and pattern instructions
│   │   └── ts.instructions.md  # TypeScript best practices
│   ├── prompts/          # Task-specific prompts for agents
│   │   ├── add-logger.prompt.md
│   │   ├── clean-ts.prompt.md
│   │   ├── commit.prompt.md
│   │   ├── create-agents.prompt.md
│   │   ├── resolve-issue.prompt.md
│   │   ├── rockets.code.prompt.md
│   │   ├── rockets.release.prompt.md
│   │   └── rockets.spec.prompt.md
│   └── skills/           # Reusable agent skills
│       ├── commit-changes/        # Git commit automation
│       ├── creating-gh-issues/    # GitHub issue creation
│       └── releasing-version/     # Versioning and changelog
├── specs/                # Specification documents
│   └── rockets.spec.md   # Rocket API specification
├── src/                  # Source code
│   ├── index.ts          # Application entry point
│   ├── routes/           # Express route handlers
│   │   └── rocketRoutes.ts
│   ├── services/         # Business logic and data stores
│   │   ├── rocket.repository.ts
│   │   ├── rocket.service.ts
│   │   └── rocketStore.ts
│   ├── types/            # TypeScript type definitions
│   │   └── rocket.ts     # Rocket types (using types, not interfaces)
│   └── utils/            # Shared utilities
│       ├── error-handler.ts   # Error handling with custom error types
│       ├── logger.ts          # Leveled logging utility
│       └── validation.ts      # Input validation helpers
└── tests/                # Playwright test files
    ├── health.spec.ts    # Health check tests
    └── rockets.spec.ts   # Rocket API tests
```

### Architecture & Coding Standards
- **Type definitions**: Use `type` instead of `interface` for data structures (per TypeScript instructions)
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