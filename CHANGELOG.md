# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.4.0] - 2026-02-12

### Added
- Customer Management API for registering and managing customers
- Customer profile creation with unique email validation
- RESTful endpoints for customer CRUD operations (POST, GET, PUT, DELETE)
- Customer lookup by ID and email address
- Comprehensive validation for email format and uniqueness
- Phone number validation with international format support
- Customer profile update with immutable email field protection
- Pagination support for customer listings
- Full e2e test coverage for all customer management acceptance criteria
- Structured error handling with field-level validation messages

## [1.3.0] - 2026-02-02

### Added
- Launches Management API for scheduling rocket launches
- Launch creation with pricing and passenger threshold configuration
- RESTful endpoints for managing launches (POST, GET, PUT, DELETE)
- Launch availability calculation based on rocket capacity
- Comprehensive validation for launch data
- Rocket capacity constraint enforcement to prevent overbooking
- Launch status lifecycle (scheduled, active, completed, cancelled)
- Integration with rocket service for capacity validation
- Full error handling with descriptive validation messages

## [1.2.0] - 2026-01-29

### Added
- Logger utility with leveled output and ISO timestamps
- `LOG_LEVEL` support to enable debug logging
- Startup and rocket creation logs using the logger
- Manual debug logging check in README
  
## [1.1.0] - 2026-01-27

### Added
- Rocket Management API with full CRUD operations
- RESTful endpoints for creating, reading, updating, and deleting rockets
- Support for rocket filtering by range (suborbital, orbital, moon, mars)
- Support for rocket filtering by minimum capacity
- Pagination support for rocket listings
- Data validation for rocket properties (name uniqueness, range validation, capacity constraints 1-10)
- Comprehensive e2e test suite covering all acceptance criteria
- Type-safe TypeScript implementation with Express.js
- In-memory data storage for rocket inventory

### Changed
- Updated project structure to support modular service architecture

## [1.0.0] - 2026-01-20

### Added
- Initial project setup with TypeScript and Express.js
- Health check endpoint
- Basic test infrastructure with Playwright
