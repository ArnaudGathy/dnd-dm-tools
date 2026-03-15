---
description: Stage changed files, write a commit message, and commit
argument-hint: "[optional message override]"
allowed-tools: Bash
---

Create a git commit for current changes.

Steps:
1. Run `git status` to see what files changed.
2. Run `git diff` (unstaged) and `git diff --staged` to understand the changes.
3. Run `git log --oneline -5` to match the existing commit message style (short, imperative, lowercase, no period — e.g. "Added Kuriboh", "Added steam mephit fight").
4. Stage relevant files with `git add <files>` — prefer specific file paths over `git add .`.
5. If $ARGUMENTS is provided, use it as the commit message. Otherwise, write a concise message following the existing style.
6. Commit with the message.
7. Run `git status` to confirm the working tree is clean.

Do not push unless explicitly asked.
