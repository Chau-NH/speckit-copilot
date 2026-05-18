from __future__ import annotations

from enum import Enum


class TaskStatus(str, Enum):
    TODO = "todo"
    IN_PROGRESS = "in_progress"
    DONE = "done"


ALLOWED_STATUS_TRANSITIONS: dict[TaskStatus, set[TaskStatus]] = {
    TaskStatus.TODO: {TaskStatus.TODO, TaskStatus.IN_PROGRESS, TaskStatus.DONE},
    TaskStatus.IN_PROGRESS: {TaskStatus.TODO, TaskStatus.IN_PROGRESS, TaskStatus.DONE},
    TaskStatus.DONE: {TaskStatus.TODO, TaskStatus.IN_PROGRESS, TaskStatus.DONE},
}


def normalize_title(title: str) -> str:
    cleaned = title.strip()
    if not cleaned:
        raise ValueError("Task title must not be empty.")
    return cleaned


def normalize_description(description: str | None) -> str:
    if description is None:
        return ""
    return description.strip()


def parse_status(status: str | TaskStatus | None) -> TaskStatus:
    if status is None:
        return TaskStatus.TODO
    if isinstance(status, TaskStatus):
        return status
    try:
        return TaskStatus(status)
    except ValueError as exc:
        allowed = ", ".join(s.value for s in TaskStatus)
        raise ValueError(f"Invalid status '{status}'. Allowed values: {allowed}.") from exc


def ensure_status_transition(current_status: str | TaskStatus, next_status: str | TaskStatus) -> TaskStatus:
    current = parse_status(current_status)
    candidate = parse_status(next_status)
    if candidate not in ALLOWED_STATUS_TRANSITIONS[current]:
        allowed = ", ".join(sorted(status.value for status in ALLOWED_STATUS_TRANSITIONS[current]))
        raise ValueError(f"Invalid status transition from '{current.value}' to '{candidate.value}'. Allowed values: {allowed}.")
    return candidate
