<!--
SYNC IMPACT REPORT
==================
Version change: (unversioned template) → 1.0.0
Principles added:
  - I. Library-First (new)
  - II. Test-First / TDD (new)
  - III. Functional Programming Patterns (new)
Sections added:
  - Core Principles (3 principles)
  - Development Workflow
  - Code Quality Standards
  - Governance
Templates updated:
  - ✅ .specify/templates/plan-template.md — Constitution Check gates updated
  - ✅ .specify/templates/spec-template.md — no changes required; structure is aligned
  - ✅ .specify/templates/tasks-template.md — no changes required; structure is aligned
Deferred items:
  - None
-->

# speckit-copilot Constitution

## Core Principles

### I. Library-First

Every feature MUST be implemented as a standalone library before being integrated into
any application, CLI, or service layer. Libraries MUST be:

- Self-contained and independently installable with no coupling to application context.
- Independently testable with their own test suite and documented public API.
- Purposeful — a library MUST have a single clear responsibility; no organizational-only
  libraries that exist purely to group code.

Any feature that cannot be expressed first as a library requires explicit written
justification before implementation may begin.

### II. Test-First (NON-NEGOTIABLE)

TDD is mandatory on this project. The Red-Green-Refactor cycle MUST be followed
without exception:

1. Write failing tests that describe the required behaviour.
2. Obtain approval from the team/user that the tests capture intent correctly.
3. Confirm tests fail (Red).
4. Implement the minimum code required to pass (Green).
5. Refactor — improve structure without changing behaviour.

No implementation code MAY be committed before a corresponding failing test exists.
Skipping or deferring tests is not permitted. Test coverage gates MUST be met before
a feature is considered done.

### III. Functional Programming Patterns

Functional programming idioms MUST be preferred over imperative or object-oriented
alternatives wherever the language permits:

- Pure functions with no hidden side effects are the default building block.
- Immutable data structures MUST be used; mutable state requires explicit justification.
- Side effects (I/O, network, DB) MUST be isolated at the boundaries of the system,
  never embedded in core logic.
- Higher-order functions, function composition, and declarative pipelines are preferred
  over loops with accumulated mutable state.
- Classes MAY be used for I/O boundaries and framework integration points only;
  they MUST NOT contain business logic.

## Development Workflow

All work flows through the speckit command pipeline:

1. `/speckit.specify` — Capture requirements in `spec.md`.
2. `/speckit.plan` — Produce `plan.md` covering tech stack, architecture, and structure.
3. `/speckit.tasks` — Generate ordered `tasks.md` from design artifacts.
4. `/speckit.implement` — Execute tasks with TDD and library-first discipline.
5. `/speckit.analyze` — Validate consistency across spec, plan, and tasks before shipping.

Each phase gate MUST be passed before the next phase begins. Constitution compliance
is verified at the plan phase (Constitution Check in `plan.md`) and again at review.

## Code Quality Standards

- Every public library function MUST have a docstring / type signature describing
  inputs, outputs, and side effects.
- Linting and formatting tools configured per the project's tech stack MUST pass
  with zero warnings on CI.
- Integration tests MUST cover all inter-library contracts and any shared schemas.
- Complexity MUST be justified — any architectural decision that introduces more than
  two layers of abstraction requires a documented rationale in `plan.md`.

## Governance

This constitution supersedes all other conventions, style guides, and informal practices.
When a conflict arises between this document and any other guidance, the constitution wins.

**Amendment procedure**:
1. Propose the change with written rationale referencing a concrete problem it solves.
2. Obtain explicit approval before the change takes effect.
3. Update the version number according to the semantic versioning policy below.
4. Update all dependent templates and guidance files in the same commit.
5. Document the change in the Sync Impact Report at the top of this file.

**Versioning policy**:
- MAJOR: A principle is removed, renamed, or its non-negotiable rules are weakened.
- MINOR: A new principle or section is added, or existing guidance is materially expanded.
- PATCH: Clarifications, wording improvements, or typo fixes with no semantic change.

All PRs MUST be reviewed against this constitution before merging.

**Version**: 1.0.0 | **Ratified**: 2026-05-14 | **Last Amended**: 2026-05-14
