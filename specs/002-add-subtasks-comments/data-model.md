# Data Model: Task Hierarchy and Comments

## Task

- `id`: UUID, primary key
- `parent_task_id`: UUID nullable foreign key to `Task.id`
- `title`: required plain-text string, non-empty after trimming
- `description`: optional plain-text string
- `status`: one of `todo`, `in_progress`, `done`
- `created_at`: timestamp
- `updated_at`: timestamp

### Relationships

- A main task has `parent_task_id = null`.
- A subtask has exactly one parent task.
- A task may have zero or many direct subtasks.
- Subtasks do not have nested subtasks.

### Validation Rules

- Titles must not be empty or whitespace-only.
- A subtask cannot be created under a task that is already done.
- A subtask status cannot change when its parent task is done.
- A main task cannot transition to `done` until all direct subtasks are `done`.

## Comment

- `id`: UUID, primary key
- `task_id`: UUID foreign key to `Task.id`
- `body`: required plain-text string, non-empty after trimming
- `created_at`: timestamp
- `updated_at`: timestamp

### Relationships

- A task may have zero or many comments.
- Comments belong to exactly one task.
- Comment order is a view concern, not a persistence concern.

### Validation Rules

- Comment text must not be empty or whitespace-only.
- Comments can be created, edited, and deleted independently of task title/description updates.
- Comment ordering defaults to oldest-first and can be switched to newest-first in the UI.

## Local UI State

- `comment_order_preference`: local browser setting, not stored in the backend.
- Allowed values: `oldest_first`, `newest_first`.
