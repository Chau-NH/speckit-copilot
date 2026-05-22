# Feature Specification: Task Hierarchy and Comments

**Feature Branch**: `002-add-subtasks-comments`

**Created**: 2026-05-22

**Status**: Draft

**Input**: User description: "Make an upgrade to task flow application, being able to add sub task to the main task (none or multiple), all sub tasks must be done before main task is done, main task is done cannot add more sub task or change sub task status, put create form and edit form to separate page for future tasks, add comment feature for each task"

## Clarifications

### Session 2026-05-22

- Q: What comment lifecycle is required for this feature? → A: Option B - comments support create, list, edit, and delete.
- Q: After a main task is done, what should be locked? → A: Option A - lock all subtask mutations (create, status change, edit, delete).
- Q: What should comment ordering be? → A: Default oldest-first, with a feature to switch to newest-first.
- Q: Where should comment-order preference be persisted? → A: Option A - remember per user/device as a local preference.

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Manage Main Tasks With Subtasks (Priority: P1)

A user can create subtasks under a main task. A main task may have no subtasks or many subtasks, and users can track subtask progress individually.

**Why this priority**: Subtasks are the core requested upgrade and unlock structured task breakdown.

**Independent Test**: Can be fully tested by creating one main task, adding zero subtasks, then adding multiple subtasks and confirming they are attached to the correct main task.

**Acceptance Scenarios**:

1. **Given** a main task exists, **When** the user adds a subtask, **Then** the new subtask appears under that main task.
2. **Given** a main task exists, **When** the user adds multiple subtasks, **Then** all subtasks remain linked to that main task.
3. **Given** a main task exists, **When** the user does not add any subtasks, **Then** the task remains valid and manageable.

---

### User Story 2 - Enforce Completion Rules (Priority: P1)

A user can mark a main task as done only after all of its subtasks are done. If the main task is already done, subtask management is locked.

**Why this priority**: This rule protects workflow consistency and is explicitly required for task correctness.

**Independent Test**: Can be fully tested by creating a main task with two subtasks, attempting to mark the main task done early (blocked), completing both subtasks, then marking the main task done (allowed), and verifying subtask updates are blocked afterward.

**Acceptance Scenarios**:

1. **Given** a main task has at least one incomplete subtask, **When** the user tries to mark the main task as done, **Then** the system blocks the action and explains why.
2. **Given** all subtasks of a main task are done, **When** the user marks the main task as done, **Then** the status change is accepted.
3. **Given** a main task is done, **When** the user tries to add a new subtask, **Then** the system blocks the action.
4. **Given** a main task is done, **When** the user tries to change any existing subtask status, **Then** the system blocks the action.
5. **Given** a main task is done, **When** the user tries to edit or delete any existing subtask, **Then** the system blocks the action.

---

### User Story 3 - Use Dedicated Create and Edit Pages (Priority: P2)

A user navigates to dedicated pages for creating a task and editing a task instead of using in-place forms.

**Why this priority**: Dedicated pages improve scalability for future feature growth and keep the user flow predictable.

**Independent Test**: Can be fully tested by navigating from the task list to the create page and edit page, saving changes, and returning to the list with updated data.

**Acceptance Scenarios**:

1. **Given** the user is on the task list, **When** they choose to create a task, **Then** they are taken to a dedicated create page.
2. **Given** the user is on the task list, **When** they choose to edit a task, **Then** they are taken to a dedicated edit page for that task.
3. **Given** a create or edit action is completed, **When** the user saves, **Then** they are returned to the list view with the latest task state.

---

### User Story 4 - Add Comments to Tasks (Priority: P2)

A user can add, edit, and delete comments on any task to capture context, updates, or notes and can view comments ordered by creation time, with oldest-first as default and newest-first as an available alternate view.

**Why this priority**: Comments provide task-level communication and history, which increases task clarity.

**Independent Test**: Can be fully tested by adding a comment, editing it, deleting it, reloading, and confirming visible comments remain in chronological order.

**Acceptance Scenarios**:

1. **Given** a task exists, **When** the user submits a comment, **Then** the comment is saved and visible on that task.
2. **Given** a task has an existing comment, **When** the user edits that comment, **Then** the updated comment text is saved and visible on that task.
3. **Given** a task has an existing comment, **When** the user deletes that comment, **Then** the comment is no longer shown on that task.
4. **Given** multiple comments exist for a task, **When** the task is viewed in default mode, **Then** comments are shown oldest-first.
5. **Given** multiple comments exist for a task, **When** the user switches ordering mode, **Then** comments are shown newest-first.
6. **Given** a user attempts to submit an empty comment, **When** submission occurs, **Then** the system rejects it with a validation message.

---

### Edge Cases

- What happens when a user attempts to complete a main task that has one or more incomplete subtasks? The system must reject completion and preserve current statuses.
- What happens when all subtasks are complete and one is later set back to not done before main task completion? The main task must remain not done until all subtasks are done again.
- What happens when a main task has zero subtasks and the user marks it done? The action is allowed.
- What happens when a user directly attempts to modify subtask status for a completed main task from another session or stale screen? The system rejects the change and returns a clear error.
- What happens when a user directly attempts to edit or delete a subtask for a completed main task from another session or stale screen? The system rejects the change and returns a clear error.
- What happens when two users or two browser tabs try to add subtasks while a main task is being completed? Only valid updates that satisfy completion rules are accepted; invalid updates are rejected.
- What happens when comment text is only whitespace? The comment is rejected.
- What happens when comment ordering mode is switched? The same comment set is shown with reversed order and no data is lost.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: Users MUST be able to create subtasks under a main task.
- **FR-002**: A main task MUST support zero, one, or many subtasks.
- **FR-003**: Each subtask MUST be associated with exactly one main task.
- **FR-004**: Users MUST be able to view subtasks grouped under their main task.
- **FR-005**: The system MUST prevent marking a main task as done if any of its subtasks are not done.
- **FR-006**: The system MUST allow marking a main task as done only when all of its subtasks are done, or when no subtasks exist.
- **FR-007**: Once a main task is marked as done, the system MUST prevent adding new subtasks to that main task.
- **FR-008**: Once a main task is marked as done, the system MUST prevent all subtask mutations, including status changes, content edits, and deletions.
- **FR-009**: The task creation experience MUST be provided on a dedicated create page.
- **FR-010**: The task editing experience MUST be provided on a dedicated edit page.
- **FR-011**: Users MUST be able to add comments to each task (main tasks and subtasks).
- **FR-012**: Users MUST be able to edit existing comments on each task.
- **FR-013**: Users MUST be able to delete existing comments on each task.
- **FR-014**: The system MUST reject empty or whitespace-only comments.
- **FR-015**: The system MUST display comments for each task in oldest-first order by default.
- **FR-016**: The system MUST persist task hierarchy, statuses, and comments across page reloads.
- **FR-017**: When an action is blocked by completion rules, the system MUST provide a clear user-facing explanation.
- **FR-018**: Once a main task is done, updates to main-task fields and comment lifecycle operations remain allowed unless blocked by a separate rule.
- **FR-019**: The system MUST provide a feature that allows switching comment order to newest-first.
- **FR-020**: The selected comment-order mode MUST be remembered per user/device as a local preference and applied on subsequent page loads.

### Key Entities *(include if feature involves data)*

- **Main Task**: A parent work item that may contain zero or many subtasks, has a completion status, and may include comments.
- **Subtask**: A child work item linked to one main task, has its own completion status, and may include comments; its status mutability depends on the parent task state.
- **Comment**: A text note linked to a specific task, including content and creation timestamp, that can be updated or removed and is displayed in chronological order.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: 100% of attempts to mark a main task done while any subtask is incomplete are blocked with an explanatory message.
- **SC-002**: 100% of attempts to create, edit, delete, or change status of subtasks after main task completion are blocked.
- **SC-003**: At least 90% of users can successfully complete the create-task and edit-task flows from dedicated pages on first attempt without guidance.
- **SC-004**: At least 90% of users can add, edit, or delete a task comment in under 20 seconds.
- **SC-005**: After reload, 100% of sampled tasks retain correct parent-child relationships, statuses, and comments.
- **SC-006**: 100% of comment ordering switches correctly change between oldest-first default and newest-first alternate view without missing or duplicate comments.
- **SC-007**: 100% of page reloads preserve the previously selected comment-order preference on the same user/device.

## Assumptions

- Existing task status semantics continue to use the current done/not-done behavior while adding parent-child enforcement rules.
- Subtask nesting is one level only in this feature (subtasks cannot have their own subtasks).
- Users can add comments to both main tasks and subtasks unless future policy changes specify otherwise.
- Existing task list and persistence behavior remain in scope and are extended, not replaced.
- Existing access model remains unchanged (no new roles or permissions introduced in this feature).
- Comment-order preference persistence is local to the user/device and does not require cross-device synchronization.
