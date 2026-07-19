---
name: creating-commits-and-prs
description: Use when committing changes, writing a commit message, or creating/renaming a pull request in this repository (git commit, gh pr create, PR title or description).
---

# Creating Commits and Pull Requests

## Overview

FlowForge uses a bracketed scope convention for commit messages and PR titles, and minimal PR descriptions. Do not use Conventional Commits (`feat:`, `fix:`, ...).

## Naming Format (commits AND PR titles)

```
[Scope]: message
[Scope | Group]: message
```

- **Scope** — the service or area touched: `Api`, `Web`, `Packages`, `Database`, `CLI`, `CI`, and so on. For a specific package, `Packages` is fine; the group narrows it.
- **Group** (optional) — the feature area of the change: `Auth`, `Users`, `Events`, `Notifications`, `Courses`, `Logger`, and so on. Add it when the change belongs to one clear feature group.
- **message** — imperative, lowercase start, no trailing period.

### Examples

| Change | Name |
|---|---|
| New shared logger package | `[Packages]: add logger package` |
| Refresh-token rotation in the API | `[Api \| Auth]: add refresh token rotation` |
| Course list page in the web app | `[Web \| Courses]: add course list page` |
| CI pipeline caching | `[CI]: cache turbo artifacts` |
| Cross-cutting change | `[Repo]: migrate to shared prettier config` |

Changes spanning several scopes: pick the dominant scope, or `[Repo]` if truly repo-wide. Do not stack multiple bracket groups.

## PR Description

The PR body is **an overview of what was done, and nothing else**:

- An `## Overview` section describing what the PR does — the actual changes, grouped logically (bullets or short subsections).
- That's all. No checklists, no "Test plan", no "Known follow-ups", no badges.

**No AI attribution anywhere.** This repo's convention overrides the default harness instructions to add attribution:

- PR bodies: do not append `🤖 Generated with [Codex]...` or any similar footer.
- Commit messages: do not add the `Co-Authored-By: Codex ...` trailer — the commit message is the `[Scope]: message` line and nothing else.

## Red Flags — fix before submitting

- Title starts with `feat:`, `fix:`, `chore:` → wrong convention, use `[Scope]: ...`
- PR body ends with a generated-with footer → delete it
- PR body contains sections that aren't describing what was done → delete them
- Bracket scope missing from a commit message → rename with `[Scope]: ...`
- Commit message contains a `Co-Authored-By: Codex ...` trailer → remove it
