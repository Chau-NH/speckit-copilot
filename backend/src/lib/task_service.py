from __future__ import annotations

from uuid import UUID

from src.lib.task_domain import ensure_status_transition
from src.models.task import Task
from src.repositories.task_repository import TaskRepository


def list_tasks(repo: TaskRepository, *, cursor: str | None, limit: int) -> tuple[list[Task], str | None, bool, int]:
    return repo.list_tasks(cursor=cursor, limit=limit)


def create_task(
    repo: TaskRepository,
    *,
    title: str,
    description: str | None,
    status: str | None,
) -> Task:
    return repo.create_task(title=title, description=description, status=status)


def replace_task_details(
    repo: TaskRepository,
    *,
    task_id: UUID,
    title: str,
    description: str,
    status: str,
) -> Task | None:
    return repo.replace_task(task_id, title=title, description=description, status=status)


def update_task_status(repo: TaskRepository, *, task_id: UUID, status: str | None) -> Task | None:
    task = repo.get_task(task_id)
    if task is None:
        return None

    next_status = ensure_status_transition(task.status, status)
    return repo.patch_task(task_id, title=task.title, description=task.description, status=next_status)


def delete_task(repo: TaskRepository, *, task_id: UUID) -> bool:
    return repo.delete_task(task_id)
