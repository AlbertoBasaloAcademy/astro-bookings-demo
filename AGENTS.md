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
├── package.json          # Node.js dependencies and scripts
├── tsconfig.json         # TypeScript configuration
├── playwright.config.ts  # Playwright test configuration
├── specs/                # Specification documents
│   └── rockets.spec.md   # Rocket API specification
├── src/                  # Source code
│   ├── index.ts          # Application entry point
│   ├── routes/           # Express route handlers
│   ├── services/         # Business logic and data stores
│   ├── utils/            # Shared utilities (logger, validation, errors)
│   └── types/            # TypeScript type definitions
└── tests/                # Playwright test files
    ├── health.spec.ts    # Health check tests
    └── rockets.spec.ts   # Rocket API tests
```

## Environment
- Code and documentation must be in English.
- Chat responses must be in the language of the user prompt.
- Sacrifice grammar for conciseness in responses.
- This is a windows environment using git bash terminal.
- My default branch is `main`.
- Remote repository, with active issues, is hosted on GitHub :
  - [AlbertoBasaloAcademy / astro-bookings-demo](https://github.com/AlbertoBasaloAcademy/astro-bookings-demo)