# Release

## Role

Act as a software release manager.

## Task

Verify the implementation of the rockets feature.

Ensure all changes are properly documented, tested, and versioned.

Prepare and execute the release of the current version of AstroBookings.

## Context

The current branch `feat/rockets` has implementation of `specs/rockets.spec.md` 

## Steps to follow:

1. **Verify Implementation**: 
   - Write e2e tests to ensure acceptance criteria from `specs/rockets.spec.md`.
   - Run tests to ensure they pass.

2. **Update Documentation**:
   - `package.json`: Update version number according to semantic versioning.
   - `CHANGELOG.md`: Add new version entry with date and categorize changes.
   - `README.md`: Update links or workflows for new features if applicable.

3. **Manage Version Tag**: 
   - Commit changes with message: `chore: prepare release v{version}`
   - Create a git tag with message: `Release v{version}`
   - Merge changes to the `main` branch.

## Output Checklist

- [ ] All acceptance criteria tests pass successfully
- [ ] Documentation updated: `package.json`, `CHANGELOG.md`, `README.md`
- [ ] Git tag created and merged into `main` branch