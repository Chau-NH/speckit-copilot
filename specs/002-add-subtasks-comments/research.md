# Research: Task Hierarchy and Comments

## Decision 1: Keep the current FastAPI + SQLModel + Alembic backend stack

- Decision: Extend the existing backend instead of introducing a new service boundary.
- Rationale: The repository already uses FastAPI, SQLModel, SQLAlchemy, and Alembic for tasks, so hierarchy/comment support fits naturally into the current repository, service, and migration layers.
- Alternatives considered: A separate service or library package for hierarchy/comment rules. Rejected because it would add integration overhead without reducing feature scope.

## Decision 2: Add React Router DOM for dedicated create/edit pages and task detail navigation

- Decision: Introduce route-based pages for create and edit flows, with a task detail/manage view for subtasks and comments.
- Rationale: The current frontend renders a single page from `App.tsx`; dedicated pages require a navigation layer so create/edit can be separated cleanly.
- Alternatives considered: Query-string state or modal-only flows. Rejected because they do not provide durable page-level entry points for future tasks.

## Decision 3: Model subtasks with a self-referential task relationship and comments as a separate table

- Decision: Use `Task.parent_task_id` to represent one-level subtasks and a separate `Comment` entity tied to `task_id`.
- Rationale: This keeps the hierarchy explicit, supports comment counts and task-level detail loading, and makes the completion rules enforceable in the domain layer.
- Alternatives considered: Storing subtasks and comments as JSON blobs on the parent task. Rejected because it would complicate validation, pagination, and updates.

## Decision 4: Persist comment order preference locally in the frontend

- Decision: Store comment-order preference in browser-local state keyed to the user/device and default to oldest-first.
- Rationale: The feature is single-user and local; a server-side preference store would add unnecessary persistence complexity.
- Alternatives considered: Global server-side preference or no persistence. Rejected because the first is unnecessary and the second would make the setting feel unstable.

## Decision 5: Expose comment endpoints separate from task mutation endpoints

- Decision: Use task-scoped comment endpoints plus comment resource edit/delete endpoints.
- Rationale: Comment lifecycle is independent from the main task payload and needs its own validation and ordering parameters.
- Alternatives considered: Embedding comment writes inside task update endpoints. Rejected because it would blur task and comment responsibilities.
