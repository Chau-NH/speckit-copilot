# Research: TaskFlow Application

## Decision 1: Frontend Framework and Build Tool

- Decision: Use React 18 with Vite and TypeScript.
- Rationale: Fast local startup, small configuration surface, and strong ecosystem support for building responsive task-oriented UI with predictable state updates.
- Alternatives considered: 
  - Next.js: richer framework, but unnecessary overhead for this local-first CRUD app.
  - Vanilla JS: minimal dependencies, but lower maintainability and weaker test ergonomics.

## Decision 2: Backend API Stack

- Decision: Use FastAPI with Pydantic v2 and Uvicorn.
- Rationale: Native support for REST-style endpoints, request/response validation, automatic OpenAPI generation, and good local developer experience.
- Alternatives considered:
  - Flask: simpler core, but requires more manual validation and schema wiring.
  - Node/Express: viable, but Python stack better aligns with required backend choice.

## Decision 3: Persistence Layer

- Decision: Use SQLite file-based storage (`backend/data/taskflow.db`) with SQLModel/SQLAlchemy.
- Rationale: Zero-configuration local persistence, transactional integrity, and easy setup for development and testing.
- Alternatives considered:
  - LocalStorage-only: simpler for frontend-only app, but does not meet backend REST persistence goal.
  - PostgreSQL: scalable, but unnecessary infrastructure for single-user v1 scope.

## Decision 4: API Design and Contract

- Decision: Expose REST endpoints for task CRUD (`GET/POST/PUT/PATCH/DELETE /tasks`).
- Rationale: Clear contract boundaries between frontend and backend, straightforward testing, and natural mapping to user stories.
- Alternatives considered:
  - GraphQL: flexible querying, but overkill for simple CRUD operations.
  - RPC-style endpoints: workable, but less standard and harder to evolve cleanly.

## Decision 5: Security Handling for Titles

- Decision: Treat task titles as plain text only; never render user-supplied title content as HTML/Markdown.
- Rationale: Prevents stored XSS with minimal runtime cost and aligns with clarification decision B.
- Alternatives considered:
  - Raw HTML rendering: rejected due to XSS risk.
  - Markdown subset: adds parser/sanitizer complexity without meaningful product value for v1.

## Decision 6: Testing Strategy (Constitution Compliance)

- Decision: Apply strict TDD with separate test layers:
  - Backend unit tests for domain library functions and repository logic.
  - Backend integration tests for API endpoints and SQLite interactions.
  - Frontend unit/integration tests for task workflows and rendering behavior.
- Rationale: Satisfies non-negotiable test-first requirement and supports safe refactoring.
- Alternatives considered:
  - Integration-only testing: faster to start but weaker fault isolation.
  - Manual-only QA: rejected due to constitution and regression risk.

## Decision 7: Performance Targets

- Decision: Define local performance targets aligned to spec goals:
  - API p95 for CRUD operations < 200 ms in local environment.
  - Initial render of 100 tasks < 1 second.
  - Task interaction feedback (toggle/edit/delete) perceived under 100 ms.
- Rationale: Keeps UX responsive while staying realistic for development hardware.
- Alternatives considered:
  - No explicit targets: rejected because measurable outcomes are required.
  - Aggressive enterprise-scale targets: rejected as out of scope for v1.
