# Tasks: TaskFlow Application

**Input**: Design documents from `/specs/001-taskflow-app/`

**Prerequisites**: plan.md (required), spec.md (required for user stories), research.md, data-model.md, contracts/

**Tests**: Tests are required for this feature because the project constitution mandates strict TDD.

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3)
- Include exact file paths in descriptions

## Path Conventions

- **Web app**: `backend/src/`, `frontend/src/`
- **Backend tests**: `backend/tests/`
- **Frontend tests**: `frontend/tests/`

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Initialize frontend and backend workspaces, dependencies, and local development tooling.

- [X] T001 Create backend and frontend directory structure per plan in `backend/` and `frontend/`
- [X] T002 Initialize FastAPI backend dependencies and Python 3.11 tooling in `backend/requirements.txt` and `backend/pyproject.toml`
- [X] T003 [P] Initialize React + Vite + TypeScript frontend dependencies in `frontend/package.json` and `frontend/tsconfig.json`
- [X] T004 [P] Configure repository-level developer tooling in `.gitignore`, `backend/.env.example`, and `frontend/.env.example`

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Establish core domain, persistence, API, and app shell required by all user stories.

**⚠️ CRITICAL**: No user story work can begin until this phase is complete

- [X] T005 Create backend task domain models and pure validation helpers in `backend/src/lib/task_domain.py`
- [X] T006 [P] Create backend SQLModel/SQLAlchemy task schema in `backend/src/models/task.py`
- [X] T007 [P] Create SQLite session and database bootstrap in `backend/src/repositories/db.py`
- [X] T008 Implement backend task repository with cursor pagination primitives in `backend/src/repositories/task_repository.py`
- [X] T009 Implement Pydantic request/response schemas for task APIs in `backend/src/api/schemas.py`
- [X] T010 Implement FastAPI application bootstrap and router registration in `backend/src/main.py` and `backend/src/api/routes/tasks.py`
- [X] T011 [P] Create frontend API client and task DTO adapters in `frontend/src/services/api.ts` and `frontend/src/lib/task_adapter.ts`
- [X] T012 [P] Create frontend application shell and query provider wiring in `frontend/src/main.tsx`, `frontend/src/App.tsx`, and `frontend/src/pages/TaskPage.tsx`

**Checkpoint**: Foundation ready - user story implementation can now begin in parallel

---

## Phase 3: User Story 1 - Create and View Tasks (Priority: P1) 🎯 MVP

**Goal**: Let users create tasks and browse the task list with cursor-based incremental loading.

**Independent Test**: Start both apps, create a new task, verify it appears in the list, then load the next cursor batch from the task list without losing ordering or data.

### Tests for User Story 1 ⚠️

> **NOTE: Write these tests FIRST, ensure they FAIL before implementation**

- [X] T013 [P] [US1] Add backend contract tests for `GET /tasks` and `POST /tasks` in `backend/tests/contract/test_tasks_list_create.py`
- [X] T014 [P] [US1] Add backend integration tests for task creation and cursor pagination in `backend/tests/integration/test_task_list_create_flow.py`
- [X] T015 [P] [US1] Add frontend integration tests for task creation form and paginated list loading in `frontend/tests/integration/task_list_create_flow.test.tsx`
- [X] T015A [US1] Review and approve failing US1 test coverage before implementation

### Implementation for User Story 1

- [X] T016 [US1] Implement backend list/create task service functions in `backend/src/lib/task_service.py`
- [X] T017 [US1] Implement `GET /tasks` and `POST /tasks` handlers with validation and cursor metadata in `backend/src/api/routes/tasks.py`
- [X] T018 [US1] Implement frontend task query and create-task mutation hooks in `frontend/src/services/tasks.ts`
- [X] T019 [US1] Implement task creation form UI in `frontend/src/components/TaskCreateForm.tsx` — form button MUST be disabled while a creation request is in flight (FR-015)
- [X] T020 [US1] Implement paginated task list and load-more interaction in `frontend/src/components/TaskList.tsx`
- [X] T021 [US1] Compose Task page create/list workflow in `frontend/src/pages/TaskPage.tsx`

**Checkpoint**: At this point, User Story 1 should be fully functional and testable independently

---

## Phase 4: User Story 2 - Track Task Progress with Status (Priority: P2)

**Goal**: Allow users to update a task status between `todo`, `in_progress`, and `done`.

**Independent Test**: Create a task from US1, change status across all supported values, reload the app, and verify the selected status persists and displays correctly.

### Tests for User Story 2 ⚠️

- [X] T022 [P] [US2] Add backend contract tests for `PATCH /tasks/{taskId}` status updates in `backend/tests/contract/test_task_status_patch.py`
- [X] T023 [P] [US2] Add backend integration tests for status transitions in `backend/tests/integration/test_task_status_flow.py`
- [X] T024 [P] [US2] Add frontend integration tests for status selector updates in `frontend/tests/integration/task_status_flow.test.tsx`
- [X] T024A [US2] Review and approve failing US2 test coverage before implementation

### Implementation for User Story 2

- [X] T025 [US2] Implement backend status transition rules in `backend/src/lib/task_domain.py`
- [X] T026 [US2] Implement backend patch-task status update flow in `backend/src/lib/task_service.py` and `backend/src/api/routes/tasks.py`
- [X] T027 [US2] Implement frontend status update mutation in `frontend/src/services/tasks.ts`
- [X] T028 [US2] Implement task status selector and visual status state in `frontend/src/components/TaskListItem.tsx`

**Checkpoint**: At this point, User Stories 1 and 2 should both work independently

---

## Phase 5: User Story 3 - Edit Task Title and Description (Priority: P3)

**Goal**: Allow users to edit task title and description with validation and cancel/save behavior.

**Independent Test**: Create a task from US1, edit its title and description, save changes, then reopen edit mode and cancel changes to verify original values remain intact.

### Tests for User Story 3 ⚠️

- [X] T029 [P] [US3] Add backend contract tests for `PUT /tasks/{taskId}` detail updates in `backend/tests/contract/test_task_replace.py`
- [X] T030 [P] [US3] Add backend integration tests for title and description edits in `backend/tests/integration/test_task_edit_flow.py`
- [X] T031 [P] [US3] Add frontend integration tests for edit and cancel behavior in `frontend/tests/integration/task_edit_flow.test.tsx`
- [X] T031A [US3] Review and approve failing US3 test coverage before implementation

### Implementation for User Story 3

- [X] T032 [US3] Implement backend replace-task update flow for title and description in `backend/src/lib/task_service.py` and `backend/src/api/routes/tasks.py`
- [X] T033 [US3] Implement frontend edit-task mutation in `frontend/src/services/tasks.ts`
- [X] T034 [US3] Implement task edit form for title and description in `frontend/src/components/TaskEditForm.tsx`
- [X] T035 [US3] Integrate edit mode and cancel/save behavior in `frontend/src/components/TaskListItem.tsx`

**Checkpoint**: User Stories 1, 2, and 3 should now be independently functional

---

## Phase 6: User Story 4 - Delete Tasks (Priority: P4)

**Goal**: Allow users to remove tasks from the list with a delete confirmation modal, while preserving correct pagination and empty-state behavior.

**Independent Test**: Create multiple tasks from US1, click delete and verify a confirmation modal appears, confirm deletion and verify only that task is removed, then delete the last remaining task and verify the empty state appears.

### Tests for User Story 4 ⚠️

- [X] T036 [P] [US4] Add backend contract tests for `DELETE /tasks/{taskId}` in `backend/tests/contract/test_task_delete.py`
- [X] T037 [P] [US4] Add backend integration tests for delete and empty-state data behavior in `backend/tests/integration/test_task_delete_flow.py`
- [X] T038 [P] [US4] Add frontend integration tests for delete confirmation modal interaction, confirmed/canceled delete paths, and empty state in `frontend/tests/integration/task_delete_flow.test.tsx`
- [X] T038A [US4] Review and approve failing US4 test coverage before implementation

### Implementation for User Story 4

- [X] T039 [US4] Implement backend delete-task flow in `backend/src/lib/task_service.py` and `backend/src/api/routes/tasks.py`
- [X] T040 [US4] Implement frontend delete-task mutation in `frontend/src/services/tasks.ts`
- [X] T041 [US4] Implement delete confirmation modal workflow (open, confirm, cancel), delete action, and empty-state rendering in `frontend/src/components/TaskListItem.tsx` and `frontend/src/components/TaskList.tsx`

**Checkpoint**: All user stories should now be independently functional

---

## Phase 7: Polish & Cross-Cutting Concerns

**Purpose**: Improve quality, documentation, performance, and cross-story robustness.

- [X] T042 [P] Add backend unit tests for domain validation and cursor helpers in `backend/tests/unit/test_task_domain.py` and `backend/tests/unit/test_cursor_pagination.py`
- [X] T043 [P] Add frontend unit tests for task adapter and pagination helpers in `frontend/tests/unit/task_adapter.test.ts` and `frontend/tests/unit/task_pagination.test.ts`
- [X] T044 Optimize cursor pagination queries and repository indexes in `backend/src/repositories/task_repository.py` and `backend/src/models/task.py`
- [X] T045 Harden plain-text rendering and invalid cursor/error handling across `backend/src/api/routes/tasks.py`, `frontend/src/components/TaskListItem.tsx`, and `frontend/src/services/tasks.ts`
- [X] T046 Run and document quickstart validation in `specs/001-taskflow-app/quickstart.md`
- [X] T047 Add Alembic-based migration workflow and remove runtime SQLModel table auto-creation in `backend/migrations/`, `backend/alembic.ini`, `backend/src/repositories/db.py`, and `backend/src/main.py`

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies - can start immediately
- **Foundational (Phase 2)**: Depends on Setup completion - blocks all user stories
- **User Stories (Phase 3+)**: All depend on Foundational phase completion
- **Polish (Phase 7)**: Depends on all desired user stories being complete

### User Story Dependencies

- **User Story 1 (P1)**: Starts after Foundational - no dependencies on other stories
- **User Story 2 (P2)**: Starts after Foundational - builds on shared task list/task item surfaces from US1 but remains independently testable
- **User Story 3 (P3)**: Starts after Foundational - builds on shared task item surfaces from US1 but remains independently testable
- **User Story 4 (P4)**: Starts after Foundational - builds on shared list/item surfaces from US1 but remains independently testable

### Within Each User Story

- Tests MUST be written first, verified to fail, and approved before implementation begins
- Backend domain/service changes before API handlers
- API and client services before UI components
- Story integration before moving to the next priority

### Parallel Opportunities

- T003 and T004 can run in parallel after T001
- T006, T007, T011, and T012 can run in parallel after T005
- All test tasks within a user story marked `[P]` can run in parallel
- Different user stories can be developed in parallel after Phase 2 if team capacity allows
- T042 and T043 can run in parallel during polish

---

## Parallel Example: User Story 1

```bash
# Launch all User Story 1 tests together:
Task: "Add backend contract tests for GET /tasks and POST /tasks in backend/tests/contract/test_tasks_list_create.py"
Task: "Add backend integration tests for task creation and cursor pagination in backend/tests/integration/test_task_list_create_flow.py"
Task: "Add frontend integration tests for task creation form and paginated list loading in frontend/tests/integration/task_list_create_flow.test.tsx"
```

---

## Parallel Example: Foundational Phase

```bash
# Launch independent foundational tasks together after T005:
Task: "Create backend SQLModel/SQLAlchemy task schema in backend/src/models/task.py"
Task: "Create SQLite session and database bootstrap in backend/src/repositories/db.py"
Task: "Create frontend API client and task DTO adapters in frontend/src/services/api.ts and frontend/src/lib/task_adapter.ts"
Task: "Create frontend application shell and query provider wiring in frontend/src/main.tsx, frontend/src/App.tsx, and frontend/src/pages/TaskPage.tsx"
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 1: Setup
2. Complete Phase 2: Foundational
3. Complete Phase 3: User Story 1
4. **STOP and VALIDATE**: Verify task creation and cursor-paginated list loading independently
5. Demo/deploy the MVP if ready

### Incremental Delivery

1. Complete Setup + Foundational
2. Deliver US1 (create/view with cursor pagination)
3. Deliver US2 (status tracking)
4. Deliver US3 (edit title/description)
5. Deliver US4 (delete + empty-state behavior)
6. Finish with Phase 7 polish and validation

### Parallel Team Strategy

1. Team completes Setup + Foundational together
2. After Foundational:
   - Developer A: US1 backend/frontend flow
   - Developer B: US2 status updates
   - Developer C: US3 edit flow
   - Developer D: US4 delete flow
3. Merge completed stories behind passing tests only

---

## Phase 8: UI Refactor with shadcn/ui (Enhancement)

**Purpose**: Upgrade frontend UI components to shadcn/ui for improved accessibility, composability, and visual polish.

**Gate**: Optional phase; only proceed if Phases 1-7 are complete and all tests pass. No breaking changes to existing APIs or tests.

### Prerequisites

- All existing tests pass (from Phase 7)
- Tailwind CSS already configured in `frontend/`
- Vite and React 18 setup complete

### Setup Tasks

- [X] T048 Initialize shadcn/ui in frontend project via `npx shadcn-ui@latest init` with Vite preset in `frontend/src/ui/`
- [X] T049 Add shadcn/ui dependencies to `frontend/package.json` (Radix UI, class-variance-authority, clsx, lucide-react for icons)

### Component Refactor Tasks

- [X] T050 [P] Refactor `TaskCreateForm.tsx` to use shadcn/ui Button and Input components for title/description fields
- [X] T051 [P] Refactor task status selector in `TaskListItem.tsx` to use shadcn/ui Select component
- [X] T052 [P] Refactor delete confirmation dialog in `TaskListItem.tsx` to use shadcn/ui Dialog component
- [X] T053 [P] Refactor `TaskList.tsx` container to use shadcn/ui Card component for task list section
- [X] T054 Add shadcn/ui icons (Trash, Edit, Plus) to buttons in `TaskListItem.tsx` and `TaskCreateForm.tsx`
- [X] T055 Update `styles.css` to integrate shadcn/ui Tailwind preset; remove custom CSS for refactored components

### Validation

- [X] T056 Run full test suite to confirm all 11+ integration tests still pass after UI refactor
- [X] T057 [P] Update frontend quickstart documentation in `specs/001-taskflow-app/quickstart.md` to mention shadcn/ui setup

### Scope Notes

- No changes to `src/lib/`, `src/services/`, or test files
- All component props and callback signatures remain unchanged
- Final bundle size impact should be minimal or null (tree-shaking removes unused components)
- No new runtime dependencies on state management or style libraries

---

## Notes

- `[P]` tasks operate on separate files and have no unmet dependencies
- Each user story remains independently testable after Foundational
- Cursor pagination is part of the MVP, not a polish item
- Plain-text rendering and validation rules must remain enforced across all stories
- Commit after each task or logical task group once tests are passing
- Phase 8 is optional; Phase 7 delivers the complete, working feature
