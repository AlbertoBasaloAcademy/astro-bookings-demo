# Conventional Commits 

- Structured commit messages to convey the type of change.

- Message Syntax template:

```txt
<type>[optional scope]: <description>
[optional body]
[optional footer] 
```

### Types of Changes

- `feat:` new feature 
- `fix:` bug fix 
- `test:` adding or fixing tests 
- `perf:` code performance improvements 
- `refactor|style:` code cleanup 
- `docs:` documentation only changes 
- `chore|build|ci:` build process or auxiliary tool changes
- Breaking changes (indicated by `!` or "BREAKING CHANGE") 

### Message description

- Concise summary of the change.
- Sacrifice grammar to fit 50 characters.
- Add issue/ticket references if applicable.

### Body and Footer

- Body: detailed explanation of the change.
- Footer: references to issues or breaking changes.
- Sacrifice grammar to fit 72 characters.