# Implementation Plan: Task Hierarchy and Comments

**Branch**: `002-add-subtasks-comments` | **Date**: 2026-05-22 | **Spec**: [spec.md](spec.md)

**Input**: Feature specification from `/specs/002-add-subtasks-comments/spec.md`

## Summary

Extend TaskFlow from a flat task list to hierarchical main tasks and subtasks with comment management and configurable comment ordering. The backend will add self-referential task relationships, a comments table, and completion-rule enforcement in the service layer; the frontend will split creation and editing into dedicated routes, add task-detail interactions for subtasks/comments, and persist comment-order preference locally.

## Technical Context

**Language/Version**: Python 3.11 backend, TypeScript 5.5 frontend

**Primary Dependencies**: FastAPI, SQLModel, SQLAlchemy, Alembic, Uvicorn, Pydantic, React 18, React Router DOM, TanStack Query, Vite, Tailwind CSS, Radix UI

**Storage**: SQLite via SQLModel/Alembic migrations

**Testing**: pytest for backend contract/integration/unit coverage; Vitest with React Testing Library for frontend unit/integration coverage

**Target Platform**: Local web application served from a FastAPI API and modern desktop browsers

**Project Type**: Web application with backend API and SPA frontend

**Performance Goals**: Preserve cursor-paginated list responsiveness; keep task/comment actions to single-request updates in local development; avoid blocking list rendering during task-detail interactions

**Constraints**: Preserve existing task API behavior where feasible; maintain plain-text sanitization; enforce one subtask level only; block all subtask mutations after a main task is done; keep comment-order preference local to the user/device. Compatibility note: the list endpoint intentionally shifts to returning top-level (main) tasks only, while detailed task payloads provide subtasks.

**Scale/Scope**: Single-user local app, moderate task volume, paginated top-level task lists, one-level task hierarchy, comments on both main tasks and subtasks

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

Verify compliance with `.specify/memory/constitution.md` before proceeding:

- [x] **I. Library-First** — Core task hierarchy and comment rules are isolated in reusable backend domain/service modules and frontend service hooks before UI/API wiring.
- [x] **II. Test-First (NON-NEGOTIABLE)** — Implementation will start from failing backend and frontend tests that describe the new hierarchy/comment behaviours.
- [x] **III. Functional Programming** — Rule enforcement stays in pure domain functions and repository boundaries; side effects remain at API, database, and UI boundaries.

## Project Structure

### Documentation (this feature)

```text
specs/002-add-subtasks-comments/
├── plan.md
├── research.md
├── data-model.md
├── quickstart.md
├── contracts/
└── tasks.md
```

### Source Code (repository root)

```text
backend/
├── src/
│   ├── api/
│   │   └── routes/
│   ├── lib/
│   ├── models/
│   └── repositories/
└── tests/
    ├── contract/
    ├── integration/
    └── unit/

frontend/
├── src/
│   ├── components/
│   ├── lib/
│   ├── pages/
│   ├── services/
│   └── ui/
└── tests/
    ├── integration/
    └── unit/
```

**Structure Decision**: Use the existing web-application split (`backend/` + `frontend/`) and expand the current FastAPI/SQLModel service layer plus the React/Vite UI. The new feature adds route-based task pages on the frontend and self-referential task/comment persistence in the backend.

