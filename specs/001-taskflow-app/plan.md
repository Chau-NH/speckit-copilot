# Implementation Plan: TaskFlow Application

**Branch**: `001-taskflow-app` | **Date**: 2026-05-14 | **Spec**: [spec.md](./spec.md)

**Input**: Feature specification from `/specs/001-taskflow-app/spec.md`

**Note**: This template is filled in by the `/speckit.plan` command. See `.specify/templates/plan-template.md` for the execution workflow.

## Summary

Build a lightweight task management web app where users can create, track, edit, and delete tasks with persistent storage across reloads. Architecture uses a React frontend consuming a FastAPI REST backend backed by SQLite on the local machine, with security hardening for plain-text task title rendering and cursor-paginated task listing for 100+ tasks.

## Technical Context

**Language/Version**: Python 3.11 (backend), TypeScript 5.5 + Node.js 20 LTS (frontend)

**Primary Dependencies**: FastAPI, Pydantic v2, Uvicorn, SQLModel/SQLAlchemy, React 18, Vite, React Query, Axios, shadcn/ui, Radix UI, class-variance-authority (cva), clsx

**Storage**: SQLite database file (`backend/data/taskflow.db`)

**Testing**: `pytest` + `httpx` (backend), `vitest` + React Testing Library (frontend), optional Playwright for end-to-end smoke

**Target Platform**: Local development on Windows/macOS/Linux; modern desktop browsers (Chrome, Edge, Firefox)

**Project Type**: Web application (`frontend` + `backend`)

**Performance Goals**: CRUD API p95 < 200ms for local single-user usage; first task batch render < 1s for 100 total tasks; additional cursor-pagination fetches complete within 500 ms in local development; UI interactions < 100ms perceived latency. shadcn/ui tree-shaking ensures no increase in bundle size for unused components.

**Constraints**: Library-first structure for domain logic, strict TDD, functional core/imperative shell pattern, task titles rendered as plain text only (no HTML/Markdown execution), create form disabled for the full duration of an in-flight creation request to prevent duplicate submissions. UI components use shadcn/ui composable patterns; styling via Tailwind CSS; no custom CSS files except globals.

**Scale/Scope**: Single-user local app, 0-auth, 100-500 tasks, flat list management only (no tags, filters, or multi-user sync in v1)

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

Verify compliance with `.specify/memory/constitution.md` before proceeding:

- [x] **I. Library-First** — Domain behavior will be implemented first in standalone libraries:
      `backend/src/lib/task_domain.py` and `frontend/src/lib/task_adapter.ts` before wiring API/UI.
- [x] **II. Test-First (NON-NEGOTIABLE)** — Implementation tasks will enforce Red-Green-Refactor with failing tests reviewed and approved before feature code in both frontend and backend.
- [x] **III. Functional Programming** — Domain logic modeled as pure functions over immutable task objects; side effects isolated to API handlers, database repository, and frontend service/UI boundaries.

**Gate Result (Pre-Research)**: PASS

## Project Structure

### Documentation (this feature)

```text
specs/001-taskflow-app/
├── plan.md              # This file (/speckit.plan command output)
├── research.md          # Phase 0 output (/speckit.plan command)
├── data-model.md        # Phase 1 output (/speckit.plan command)
├── quickstart.md        # Phase 1 output (/speckit.plan command)
├── contracts/           # Phase 1 output (/speckit.plan command)
└── tasks.md             # Phase 2 output (/speckit.tasks command - NOT created by /speckit.plan)
```

### Source Code (repository root)

```text
backend/
├── src/
│   ├── api/
│   ├── lib/
│   ├── models/
│   └── repositories/
├── tests/
│   ├── contract/
│   ├── integration/
│   └── unit/
└── data/

frontend/
├── src/
│   ├── components/
│   ├── pages/
│   ├── lib/
│   └── services/
└── tests/
            ├── integration/
            └── unit/
```

**Structure Decision**: Use a two-project web architecture (`frontend` + `backend`) to align with requested stack and REST separation. Library-first is maintained by isolating task business rules in `lib` modules in both projects, with frameworks only at edges.

## Post-Design Constitution Check

- [x] I. Library-First maintained in planned module boundaries and contract-first API design
- [x] II. Test-First reflected in quickstart, implementation order, and test approval gates
- [x] III. Functional Programming reflected in data model and operation design

**Gate Result (Post-Design)**: PASS

## Phase 8: UI Refactor with shadcn/ui (Enhancement)

**Purpose**: Upgrade frontend UI components to shadcn/ui for improved accessibility, composability, and visual polish without altering core functionality or domain logic.

**Decision Rationale**: 
- shadcn/ui provides pre-built, accessible Radix UI components with Tailwind CSS styling
- Tree-shaking ensures no unused components inflate bundle
- Composable component API aligns with functional programming principles
- Improves DX through better component variants and consistent styling patterns
- Zero additional runtime overhead; all code is co-located in the project

**Components to Refactor**:
- Form inputs (TaskCreateForm: Button, Input, Textarea)
- Dialog/Modal for delete confirmation (Dialog from shadcn/ui)
- Select for status dropdown (Select from shadcn/ui)
- Card for task list container (Card from shadcn/ui)
- Empty state message (Typography utilities)

**Styling Approach**: Tailwind CSS + shadcn/ui presets; centralized component library in `frontend/src/ui/` (generated by shadcn/ui init)

**Scope**: UI-only refactor; no changes to business logic, API contracts, or test files. All existing integration tests remain green.

**Gate**: Phase 8 is optional and may be deferred. Phases 1–7 deliver complete, working feature. Phase 8 improves UX/DX only.

## Complexity Tracking

> **Fill ONLY if Constitution Check has violations that must be justified**

| Violation | Why Needed | Simpler Alternative Rejected Because |
|-----------|------------|-------------------------------------|
| None | N/A | N/A |
