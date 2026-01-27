# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

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
