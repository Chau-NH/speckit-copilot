# Tasks: Task Hierarchy and Comments

**Input**: Design documents from `/specs/002-add-subtasks-comments/`
**Prerequisites**: plan.md, spec.md, research.md, data-model.md, contracts/
**Tests**: Included because this feature requires TDD coverage across backend and frontend stories.
**Organization**: Tasks are grouped by user story to preserve independent implementation and testing.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel with other tasks in the same phase
- **[Story]**: Story label for user story phases only
- Every task includes exact file paths

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Prepare the frontend routing shell and shared feature scaffolding

- [ ] T001 [P] Add React Router DOM dependency and browser-router entrypoint in frontend/package.json, frontend/src/main.tsx, and frontend/src/App.tsx
- [ ] T002 [P] Create dedicated task page stubs for list, detail, create, and edit flows in frontend/src/pages/TaskPage.tsx, frontend/src/pages/TaskDetailPage.tsx, frontend/src/pages/TaskCreatePage.tsx, and frontend/src/pages/TaskEditPage.tsx
- [ ] T003 [P] Add backend feature module stubs for comments and hierarchy support in backend/src/models/comment.py, backend/src/repositories/comment_repository.py, backend/src/lib/comment_service.py, and backend/src/api/routes/comments.py

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Shared rule, schema, API, and data-model work that all stories depend on

**⚠️ Critical**: No user story work should begin until this phase is complete

- [ ] T004 [P] Write failing backend unit tests for task hierarchy, completion rules, and comment validation helpers in backend/tests/unit/test_task_domain.py
- [ ] T005 [P] Write failing backend contract tests for task detail, subtask, and comment endpoints in backend/tests/contract/test_task_hierarchy_comments.py
- [ ] T006 [P] Write failing backend integration tests for subtask flow and comment ordering in backend/tests/integration/test_task_hierarchy_comments_flow.py
- [ ] T007 Review and approve failing foundational tests before foundational implementation in backend/tests/unit/test_task_domain.py, backend/tests/contract/test_task_hierarchy_comments.py, and backend/tests/integration/test_task_hierarchy_comments_flow.py
- [ ] T008 [P] Implement task hierarchy data model and migration in backend/src/models/task.py, backend/src/models/comment.py, and backend/migrations/versions/20260522_0003_add_task_hierarchy_and_comments.py
- [ ] T009 [P] Implement shared domain helpers and repository/service primitives in backend/src/lib/task_domain.py, backend/src/repositories/task_repository.py, backend/src/repositories/comment_repository.py, and backend/src/lib/task_service.py
- [ ] T010 [P] Implement shared backend schemas and frontend API/type adapters in backend/src/api/schemas.py, backend/src/api/routes/tasks.py, frontend/src/services/api.ts, frontend/src/services/tasks.ts, frontend/src/lib/task_adapter.ts, and frontend/src/lib/comment_order_preference.ts

**Checkpoint**: Foundation ready - user story implementation can now begin

---

## Phase 3: User Story 1 - Manage Main Tasks With Subtasks (Priority: P1)

**Goal**: A main task can own zero or many subtasks, and the UI can show subtasks grouped under the parent task.

**Independent Test**: Create a main task, add zero subtasks, then add multiple subtasks and confirm they remain attached to the correct parent task.

### Tests for User Story 1

- [ ] T011 [P] [US1] Write failing backend contract tests for subtask creation and grouped task detail in backend/tests/contract/test_task_hierarchy_comments.py
- [ ] T012 [P] [US1] Write failing backend integration tests for subtask creation and grouped task detail in backend/tests/integration/test_task_hierarchy_comments_flow.py
- [ ] T013 [US1] Review and approve failing US1 tests before US1 implementation in backend/tests/contract/test_task_hierarchy_comments.py and backend/tests/integration/test_task_hierarchy_comments_flow.py

### Implementation for User Story 1

- [ ] T014 [P] [US1] Implement subtask creation and grouped task detail loading in backend/src/api/routes/tasks.py, backend/src/lib/task_service.py, and backend/src/repositories/task_repository.py
- [ ] T015 [P] [US1] Implement subtask UI controls and hierarchy display in frontend/src/pages/TaskDetailPage.tsx, frontend/src/components/TaskListItem.tsx, and frontend/src/components/TaskSubtaskForm.tsx
- [ ] T016 [US1] Wire task-detail navigation from frontend/src/App.tsx and frontend/src/pages/TaskPage.tsx

**Checkpoint**: User Story 1 should now be independently functional and demonstrable

---

## Phase 4: User Story 2 - Enforce Completion Rules (Priority: P1)

**Goal**: A main task can only be marked done when all subtasks are done, and completed main tasks block all subtask mutations.

**Independent Test**: Create a main task with subtasks, verify completion is blocked while a subtask is incomplete, then complete subtasks, mark the main task done, and confirm all subtask mutations are blocked afterward.

### Tests for User Story 2

- [ ] T017 [P] [US2] Write failing backend contract tests for blocked completion and locked subtask mutations in backend/tests/contract/test_task_completion_rules.py
- [ ] T018 [P] [US2] Write failing backend integration tests for completion-rule enforcement in backend/tests/integration/test_task_completion_rules_flow.py
- [ ] T019 [US2] Review and approve failing US2 tests before US2 implementation in backend/tests/contract/test_task_completion_rules.py and backend/tests/integration/test_task_completion_rules_flow.py

### Implementation for User Story 2

- [ ] T020 [US2] Implement completion-rule validation in backend/src/lib/task_domain.py, backend/src/lib/task_service.py, and backend/src/repositories/task_repository.py
- [ ] T021 [P] [US2] Implement blocked-state UI messaging in frontend/src/pages/TaskDetailPage.tsx, frontend/src/components/TaskListItem.tsx, and frontend/src/services/tasks.ts

**Checkpoint**: User Stories 1 and 2 should both work independently

---

## Phase 5: User Story 3 - Use Dedicated Create and Edit Pages (Priority: P2)

**Goal**: Create and edit flows move to dedicated routes so future work can extend those screens cleanly.

**Independent Test**: Navigate from the task list to the create page and edit page, save changes, and return to the list with the latest task state.

### Tests for User Story 3

- [ ] T022 [P] [US3] Write failing frontend route tests for dedicated create and edit pages in frontend/tests/integration/task_page_routes.test.tsx
- [ ] T023 [US3] Review and approve failing US3 tests before US3 implementation in frontend/tests/integration/task_page_routes.test.tsx

### Implementation for User Story 3

- [ ] T024 [US3] Implement dedicated task create page in frontend/src/pages/TaskCreatePage.tsx and move create-form flow out of frontend/src/pages/TaskPage.tsx
- [ ] T025 [US3] Implement dedicated task edit page in frontend/src/pages/TaskEditPage.tsx and move edit-form flow out of frontend/src/components/TaskEditForm.tsx
- [ ] T026 [US3] Update app routing and list navigation in frontend/src/App.tsx, frontend/src/main.tsx, and frontend/src/components/TaskListItem.tsx

**Checkpoint**: Dedicated create and edit pages should now be independently usable

---

## Phase 6: User Story 4 - Add Comments to Tasks (Priority: P2)

**Goal**: Users can add, edit, delete, and reorder comments on any task, with the selected order remembered locally.

**Independent Test**: Add a comment, edit it, delete it, switch order to newest-first, reload, and confirm the preference is preserved on the same device.

### Tests for User Story 4

- [ ] T027 [P] [US4] Write failing backend contract tests for comment lifecycle and ordering in backend/tests/contract/test_task_comments.py
- [ ] T028 [P] [US4] Write failing backend integration tests for comment create/edit/delete and ordering in backend/tests/integration/test_task_comments_flow.py
- [ ] T029 [P] [US4] Write failing frontend integration tests for comment UI and local ordering preference in frontend/tests/integration/task_comments_flow.test.tsx
- [ ] T030 [US4] Review and approve failing US4 tests before US4 implementation in backend/tests/contract/test_task_comments.py, backend/tests/integration/test_task_comments_flow.py, and frontend/tests/integration/task_comments_flow.test.tsx

### Implementation for User Story 4

- [ ] T031 [P] [US4] Implement backend comment persistence and comment routes in backend/src/models/comment.py, backend/src/repositories/comment_repository.py, backend/src/lib/comment_service.py, backend/src/api/routes/comments.py, backend/src/api/routes/tasks.py, and backend/src/api/schemas.py
- [ ] T032 [P] [US4] Implement comment UI, order toggle, and preference persistence in frontend/src/pages/TaskDetailPage.tsx, frontend/src/components/TaskCommentList.tsx, frontend/src/components/TaskCommentForm.tsx, frontend/src/components/TaskOrderToggle.tsx, frontend/src/lib/comment_order_preference.ts, and frontend/src/services/tasks.ts

### FR-018 Coverage Block

- [ ] T033 [US4] Add explicit allow-after-done coverage for main-task field updates and comment lifecycle in backend/tests/integration/test_task_post_done_allowed_flow.py and frontend/tests/integration/task_comments_flow.test.tsx

**Checkpoint**: Comment lifecycle and ordering should now be independently functional

---

## Phase 7: Polish & Cross-Cutting Concerns

**Purpose**: Final cleanup, documentation, and validation across all stories

- [ ] T034 [P] Update quickstart and OpenAPI docs for task hierarchy and comments in specs/002-add-subtasks-comments/quickstart.md and specs/002-add-subtasks-comments/contracts/openapi.yaml
- [ ] T035 [P] Run backend and frontend test suites, then fix any regressions in backend/tests and frontend/tests
- [ ] T036 [P] Refactor shared task, detail, and comment helpers for clarity in backend/src/lib/task_domain.py, backend/src/lib/task_service.py, frontend/src/pages/TaskDetailPage.tsx, and frontend/src/components
- [ ] T037 [P] Add explicit SC-005 combined reload-persistence scenario for hierarchy, statuses, and comments in backend/tests/integration/test_task_hierarchy_persistence_flow.py

---

## Dependencies & Execution Order

### Phase Dependencies

- Setup (Phase 1): No dependencies; can start immediately
- Foundational (Phase 2): Depends on Setup; blocks all user stories
- User Stories (Phase 3+): Depend on Foundational
- Polish (Phase 7): Depends on the desired user stories being complete

### User Story Dependencies

- User Story 1 (P1): Can start after Foundational and delivers the task hierarchy baseline
- User Story 2 (P1): Can start after Foundational and may rely on the hierarchy model from User Story 1
- User Story 3 (P2): Can start after Foundational and is independent of subtasks/comments feature details
- User Story 4 (P2): Can start after Foundational and can build on the shared task detail surface

### Within Each User Story

- Tests must be written before implementation
- Backend or shared rule helpers should be implemented before UI wiring
- Use the minimal set of changes needed to satisfy the story before moving to the next one

### Parallel Opportunities

- Setup tasks marked [P] can run in parallel because they touch different files
- Foundational tasks marked [P] can run in parallel where file ownership does not overlap
- After Foundation, User Stories 1 through 4 can be staffed in parallel if needed
- Test tasks within a story are parallelizable when they cover different layers or files
- UI tasks in different pages/components can proceed in parallel once the backend contract is stable

---

## Parallel Example: User Story 1

```bash
Task: "Write failing backend contract tests for subtask creation and grouped task detail in backend/tests/contract/test_task_hierarchy_comments.py"
Task: "Write failing backend integration tests for subtask creation and grouped task detail in backend/tests/integration/test_task_hierarchy_comments_flow.py"
```

```bash
Task: "Implement subtask UI controls and hierarchy display in frontend/src/pages/TaskDetailPage.tsx, frontend/src/components/TaskListItem.tsx, and frontend/src/components/TaskSubtaskForm.tsx"
Task: "Wire task-detail navigation from frontend/src/App.tsx and frontend/src/pages/TaskPage.tsx"
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 1: Setup
2. Complete Phase 2: Foundational
3. Complete Phase 3: User Story 1
4. Validate User Story 1 independently before moving on

### Incremental Delivery

1. Finish Setup + Foundation
2. Deliver User Story 1 and validate subtasks work
3. Deliver User Story 2 and validate completion rules
4. Deliver User Story 3 and validate route split for create/edit
5. Deliver User Story 4 and validate comment lifecycle and ordering
6. Run Polish phase and final regression tests

### Parallel Team Strategy

1. One developer can handle User Story 1 while another prepares User Story 2
2. User Story 3 can proceed independently once the router is in place
3. User Story 4 can proceed independently once the comment API surface is available

---

## Notes

- [P] tasks can run in parallel when they touch different files and have no dependency on unfinished work
- Each user story is designed to be independently testable and demoable
- TDD order is preserved by placing test tasks before implementation tasks within each story
- Avoid broad cross-story edits unless they are explicitly listed in the task description
