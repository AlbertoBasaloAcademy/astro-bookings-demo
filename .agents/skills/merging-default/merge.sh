#!/bin/bash
# Git Merge Utility - Merge current branch into default branch (main/master)
# Usage: ./merge.sh [PROJECT_PATH]
# Validates Git repo, checks for uncommitted changes, fetches latest, detects
# default branch, and merges current branch.
# Exit: 0=Success, 1=InvalidPath, 2=NotARepo, 3=UncommittedChanges, 4=GitFailed

set -e  # Exit on error

# Color codes for output
RED='\033[0;31m'
GREEN='\033[0;32m'
LUE='\033[0;34m'
NC='\033[0m'  # No Color

# Logger functions
log_info() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

log_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

log_error() {
    echo -e "${RED}[ERROR]${NC} $1" >&2
}

# MAIN SCRIPT

# Get project path from argument or use current directory
PROJECT_PATH="${1:-.}"

log_info "Starting merge process for project: $PROJECT_PATH"

# Validate project path exists
if [ ! -d "$PROJECT_PATH" ]; then
    log_error "Project path does not exist: $PROJECT_PATH"
    exit 1
fi

# Navigate to project directory
cd "$PROJECT_PATH"
log_info "Changed to directory: $(pwd)"

# Verify this is a git repository
if [ ! -d ".git" ]; then
    log_error "Not a git repository: $PROJECT_PATH"
    exit 2
fi

# Get current branch name
CURRENT_BRANCH=$(git rev-parse --abbrev-ref HEAD)
log_info "Current branch: $CURRENT_BRANCH"

# Check for uncommitted changes
STATUS=$(git status --porcelain)
if [ -n "$STATUS" ]; then
    log_error "Uncommitted changes detected in working directory. Please commit or stash changes before merging"
    exit 3
fi
log_info "Working directory is clean"

# Fetch latest changes from remote
log_info "Fetching latest changes from remote origin..."
if ! git fetch origin; then
    log_error "Failed to fetch from remote origin"
    exit 4
fi
log_success "Fetched latest changes"

# Detect default branch (main or master)
if git ls-remote --heads origin main | grep -q refs/heads/main; then
    DEFAULT_BRANCH="main"
else
    DEFAULT_BRANCH="master"
fi
log_info "Default branch detected: $DEFAULT_BRANCH"

# Checkout default branch
log_info "Checking out default branch: $DEFAULT_BRANCH"
if ! git checkout "$DEFAULT_BRANCH"; then
    log_error "Failed to checkout $DEFAULT_BRANCH"
    exit 4
fi

# Pull latest changes to default branch
log_info "Pulling latest changes from origin/$DEFAULT_BRANCH"
if ! git pull origin "$DEFAULT_BRANCH"; then
    log_error "Failed to pull from origin/$DEFAULT_BRANCH"
    exit 4
fi
log_success "Default branch updated"

# Merge current branch into default branch
MERGE_MESSAGE="chore: merge branch $CURRENT_BRANCH into $DEFAULT_BRANCH"
log_info "Merging $CURRENT_BRANCH into $DEFAULT_BRANCH with message: $MERGE_MESSAGE"
if ! git merge --no-ff "$CURRENT_BRANCH" -m "$MERGE_MESSAGE"; then
    log_error "Failed to merge $CURRENT_BRANCH into $DEFAULT_BRANCH"
    exit 4
fi
log_success "Branch merged successfully"

log_success "Merge completed: $CURRENT_BRANCH merged into $DEFAULT_BRANCH"
exit 0