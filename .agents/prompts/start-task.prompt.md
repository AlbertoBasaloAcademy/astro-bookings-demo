---
name: start-task
description: Prepares workspace for a new coding task with proper git workflow.
argument-hint: Brief description of the task to work on.
agent: agent
model: GPT-5 mini (copilot)
tools: ['execute/getTerminalOutput', 'execute/runInTerminal', 'read', 'edit/editFiles', 'search']
---

# Start New Task

## Role

Act as a software developer preparing to work on a new task.

## Task

Prepare the local workspace for a new coding task following proper git workflow.

## Workflow Rules

**CRITICAL**: ALL work must be LOCAL. NEVER use GitHub API tools (mcp_github_*) during development. Remote sync happens ONLY when explicitly requested via `/push` prompt.

### Step-by-Step Process

1. **Check workspace status**:
   ```bash
   git status
   ```

2. **If uncommitted changes exist**:
   - Ask user: "You have uncommitted changes. Commit them now? (yes/no)"
   - If yes, run `/commit` prompt
   - If no, abort and warn about potential conflicts

3. **Update main branch**:
   ```bash
   git checkout main
   git pull origin main
   ```

4. **Create task branch**:
   - Determine branch type from task description:
     - `feat/` for new features
     - `fix/` for bug fixes
     - `chore/` for maintenance
   - Create slug from task description (lowercase, hyphens)
   ```bash
   git checkout -b <type>/<slug>
   ```

5. **Verify setup**:
   ```bash
   git branch --show-current
   git status
   ```

6. **Confirm to user**:
   - Current branch: `<type>/<slug>`
   - Clean working tree
   - Ready to start coding

## Context

This prompt combines checking for uncommitted changes, updating from main, and creating a feature branch. It ensures a clean starting point for development.

Use the `committing-changes` skill as reference. Use the terminal tool to run git commands.

## Output checklist

- [ ] Workspace status checked
- [ ] No uncommitted changes (or committed via `/commit`)
- [ ] Main branch updated from remote
- [ ] New branch created with proper naming convention
- [ ] Current branch verified
- [ ] User informed they can start coding
- [ ] Reminded that all changes stay LOCAL until `/push` is used