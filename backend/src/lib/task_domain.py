from __future__ import annotations

from enum import Enum


class TaskStatus(str, Enum):
    TODO = "todo"
    IN_PROGRESS = "in_progress"
    DONE = "done"


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
