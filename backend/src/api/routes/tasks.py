from __future__ import annotations

from uuid import UUID

from fastapi import APIRouter, Depends, HTTPException, Query, Response, status
from sqlmodel import Session

from src.api.schemas import TaskCreate, TaskListPage, TaskPatch, TaskRead, TaskUpdate
from src.lib import task_service
from src.repositories.db import get_session
from src.repositories.task_repository import TaskRepository

router = APIRouter(prefix="/tasks", tags=["tasks"])


def get_task_repository(session: Session = Depends(get_session)) -> TaskRepository:
    return TaskRepository(session)


@router.get("", response_model=TaskListPage)
def list_tasks(
    cursor: str | None = Query(default=None),
    limit: int = Query(default=20, ge=1, le=100),
    repo: TaskRepository = Depends(get_task_repository),
) -> TaskListPage:
    try:
        tasks, next_cursor, has_more, applied_limit = task_service.list_tasks(repo, cursor=cursor, limit=limit)
    except ValueError as exc:
        raise HTTPException(status_code=status.HTTP_422_UNPROCESSABLE_ENTITY, detail=str(exc)) from exc

    return TaskListPage(
        items=[TaskRead.model_validate(task) for task in tasks],
        next_cursor=next_cursor,
        has_more=has_more,
        limit=applied_limit,
    )


@router.post("", response_model=TaskRead, status_code=status.HTTP_201_CREATED)
def create_task(payload: TaskCreate, repo: TaskRepository = Depends(get_task_repository)) -> TaskRead:
    try:
        task = task_service.create_task(
            repo,
            title=payload.title,
            description=payload.description,
            status=payload.status,
        )
    except ValueError as exc:
        raise HTTPException(status_code=status.HTTP_422_UNPROCESSABLE_ENTITY, detail=str(exc)) from exc
    return TaskRead.model_validate(task)


@router.get("/{task_id}", response_model=TaskRead)
def get_task(task_id: UUID, repo: TaskRepository = Depends(get_task_repository)) -> TaskRead:
    task = repo.get_task(task_id)
    if task is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Task not found.")
    return TaskRead.model_validate(task)


@router.put("/{task_id}", response_model=TaskRead)
def replace_task(task_id: UUID, payload: TaskUpdate, repo: TaskRepository = Depends(get_task_repository)) -> TaskRead:
    try:
        task = repo.replace_task(task_id, title=payload.title, description=payload.description, status=payload.status)
    except ValueError as exc:
        raise HTTPException(status_code=status.HTTP_422_UNPROCESSABLE_ENTITY, detail=str(exc)) from exc

    if task is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Task not found.")
    return TaskRead.model_validate(task)


@router.patch("/{task_id}", response_model=TaskRead)
def patch_task(task_id: UUID, payload: TaskPatch, repo: TaskRepository = Depends(get_task_repository)) -> TaskRead:
    try:
        if payload.title is None and payload.description is None:
            task = task_service.update_task_status(repo, task_id=task_id, status=payload.status)
        else:
            task = repo.patch_task(
                task_id,
                title=payload.title,
                description=payload.description,
                status=payload.status,
            )
    except ValueError as exc:
        raise HTTPException(status_code=status.HTTP_422_UNPROCESSABLE_ENTITY, detail=str(exc)) from exc

    if task is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Task not found.")
    return TaskRead.model_validate(task)


@router.delete("/{task_id}", status_code=status.HTTP_204_NO_CONTENT, response_class=Response)
def delete_task(task_id: UUID, repo: TaskRepository = Depends(get_task_repository)) -> Response:
    removed = repo.delete_task(task_id)
    if not removed:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Task not found.")
    return Response(status_code=status.HTTP_204_NO_CONTENT)
