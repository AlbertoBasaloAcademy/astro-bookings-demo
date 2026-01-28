---
name : commit-changes
description : >
  Commits pending changes.
  To be used for committing code changes in a git repository.
---

# Committing Changes Skill

When asked for committing changes, follow these steps:

1. **Check for uncommitted changes**:
  - Use `git status` to see if there are any uncommitted changes.
2. **Group changes**:
  - If there are multiple files changed, group them logically if possible.
  - Decide on meaningful commit messages for each group.
3. **Stage changes**:
  - Stage the changes using `git add` for each group of files.
4. **Commit changes**:
  - Commit the staged changes using [conventional commit messages](./conventional-commits.md) guidelines.