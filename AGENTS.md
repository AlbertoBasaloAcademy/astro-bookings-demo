# Agents Instructions

- **Root_Folder**: /.
- **Agents_Folder**: .agents.
- **Agents_file**: AGENTS.md.
- **Project_Folder**: project.

## Product Overview
AstroBookings is a demo backend API for rocket launch booking.
It manages rockets, launches, customers, and bookings.
It enforces capacity rules and launch lifecycle transitions.
Customer booking and payment flows are planned next.
This project is for training and architecture practice.

## Technical Implementation

### Tech Stack
- **Language**: TypeScript 5.6 on Node.js 22.
- **Framework**: Express 4.21.
- **Database**: In-memory store.
- **Security**: None for this demo stage.
- **Testing**: Playwright 1.58 and Vitest 4.0.
- **Logging**: Console logger with levels.
- **Version**: 1.5.0 in CHANGELOG.md.

### Development Workflow
```bash
# Set up the project
npm install

# Build/Compile the project
npm run build

# Run the project
npm run dev
npm start

# Test the project
npm test
npm run test:dev
npm run test:unit
npm run test:coverage

# Deploy the project
# No deployment configured for this demo
```

### Folder Structure
```text
.                         # Project root
├── AGENTS.md             # Main instructions file for agents
├── .agents/              # Agent files, prompts, and skills
│   └── skills/           # Reusable skill definitions
├── project/              # Project context and planning docs
│   ├── briefing.md       # Project briefing summary
│   ├── PRD.md            # Product requirements document
│   ├── ADD.md            # Architecture design document
│   └── specs/            # Detailed feature specifications
├── src/                  # Application source code
│   ├── routes/           # Express route handlers
│   ├── services/         # Business logic and repositories
│   ├── types/            # Domain type definitions
│   └── utils/            # Shared utilities
├── tests/                # End-to-end test suite
├── CHANGELOG.md          # Version history
├── README.md             # Human-oriented documentation
└── package.json          # Scripts and dependencies
```

## Behavior And Collaboration
Write code and docs in English.
Reply in the user prompt language.
Be concise, even if grammar is rough.
Do not invent missing requirements.
Ask one focused question when blocked.
Do not revert user edits without approval.
Keep edits minimal and scoped.
Run relevant tests after code changes.
Report risks, assumptions, and next actions.
Use clear commit messages with proper prefixes.

## Environment
- **OS dev**: Windows.
- **Terminal**: git bash.
- **Default branch**: main.
- **Git remote**: AlbertoBasaloAcademy/astro-bookings-demo.