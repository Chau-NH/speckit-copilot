# Data Model: TaskFlow Application

## Entity: Task

- Purpose: Represents one actionable item in the task list.
- Storage: SQLite table `tasks`.

### Fields

- `id` (string UUID): Unique identifier for task operations.
- `title` (string): Plain-text task title.
- `description` (string): Optional plain-text details about the task.
- `status` (enum): Task progress status (`todo`, `in_progress`, `done`).
- `created_at` (datetime): Creation timestamp.
- `updated_at` (datetime): Last update timestamp.

### Validation Rules

- `title` MUST NOT be empty after trim.
- `title` MUST NOT contain only whitespace.
- `title` is treated as plain text only (no HTML/Markdown rendering semantics).
- `description` is optional and defaults to empty string.
- `description` is plain text and rendered safely.
- `status` MUST be one of: `todo`, `in_progress`, `done`.
- `status` defaults to `todo` on creation.
- `created_at` is immutable after creation.
- `updated_at` MUST be refreshed on title or status changes.

### State Transitions

- `todo -> in_progress`: user starts work.
- `in_progress -> done`: user completes work.
- `done -> in_progress`: user reopens completed work.
- `in_progress -> todo`: user resets task to backlog.
- `todo/in_progress/done -> Deleted`: user deletes task (terminal state).

## API Payload Models

### TaskListPage

- `items` (array of `TaskView`)
- `next_cursor` (optional string): Opaque cursor for the next batch.
- `has_more` (boolean): Indicates whether more tasks are available after this batch.
- `limit` (integer): Applied batch size for this response.

### TaskCreate

- `title` (required string)
- `description` (optional string)
- `status` (optional enum: `todo`, `in_progress`, `done`)

### TaskUpdate

- `title` (required string)
- `description` (required string, empty allowed)
- `status` (required enum: `todo`, `in_progress`, `done`)

### TaskPatch

- `title` (optional string)
- `description` (optional string)
- `status` (optional enum: `todo`, `in_progress`, `done`)

### TaskView

- `id`, `title`, `description`, `status`, `created_at`, `updated_at`

## Query Models

### TaskListQuery

- `cursor` (optional string): Opaque cursor pointing to the next slice of ordered tasks.
- `limit` (optional integer): Requested batch size, constrained by server maximum.

### Pagination Rules

- Tasks are ordered deterministically by `created_at` descending, with `id` as a tiebreaker.
- `cursor` encodes the last seen ordering key and is opaque to clients.
- Invalid or expired cursors MUST be rejected with a validation error.
- `has_more = true` only when another batch exists after the returned items.

## Relationships

- No cross-entity relationships in v1.
- Task is a standalone aggregate in this feature scope.
