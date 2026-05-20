from __future__ import annotations

import base64
import json
from datetime import datetime, timezone
from uuid import UUID

from sqlalchemy import and_, or_
from sqlmodel import Session, select

from src.lib.task_domain import TaskStatus, normalize_description, normalize_title, parse_status
from src.models.task import Task


class TaskRepository:
    def __init__(self, session: Session):
        self.session = session

    @staticmethod
    def _encode_cursor(created_at: datetime, task_id: UUID) -> str:
        payload = {
            "created_at": created_at.isoformat(),
            "id": str(task_id),
        }
        raw = json.dumps(payload).encode("utf-8")
        return base64.urlsafe_b64encode(raw).decode("utf-8")

    @staticmethod
    def _decode_cursor(cursor: str) -> tuple[datetime, UUID]:
        try:
            raw = base64.urlsafe_b64decode(cursor.encode("utf-8")).decode("utf-8")
            payload = json.loads(raw)
            created_at = datetime.fromisoformat(payload["created_at"])
            task_id = UUID(payload["id"])
            return created_at, task_id
        except Exception as exc:  # noqa: BLE001
            raise ValueError("Invalid cursor.") from exc

    def list_tasks(self, cursor: str | None, limit: int) -> tuple[list[Task], str | None, bool, int]:
        applied_limit = min(max(limit, 1), 100)
        normalized_cursor = cursor.strip() if cursor is not None else None
        if normalized_cursor == "":
            normalized_cursor = None

        statement = select(Task)
        if normalized_cursor:
            cursor_created_at, cursor_id = self._decode_cursor(normalized_cursor)
            statement = statement.where(
                or_(
                    Task.created_at < cursor_created_at,
                    and_(Task.created_at == cursor_created_at, Task.id < cursor_id),
                )
            )

        statement = statement.order_by(Task.created_at.desc(), Task.id.desc()).limit(applied_limit + 1)
        rows = list(self.session.exec(statement))

        has_more = len(rows) > applied_limit
        items = rows[:applied_limit]

        next_cursor: str | None = None
        if has_more and items:
            last = items[-1]
            next_cursor = self._encode_cursor(last.created_at, last.id)

        return items, next_cursor, has_more, applied_limit

    def create_task(self, *, title: str, description: str | None, status: str | TaskStatus | None) -> Task:
        task = Task(
            title=normalize_title(title),
            description=normalize_description(description),
            status=parse_status(status).value,
            created_at=datetime.now(timezone.utc),
            updated_at=datetime.now(timezone.utc),
        )
        self.session.add(task)
        self.session.commit()
        self.session.refresh(task)
        return task

    def get_task(self, task_id: UUID) -> Task | None:
        return self.session.get(Task, task_id)

    def replace_task(self, task_id: UUID, *, title: str, description: str, status: str | TaskStatus) -> Task | None:
        task = self.get_task(task_id)
        if not task:
            return None

        task.title = normalize_title(title)
        task.description = normalize_description(description)
        task.status = parse_status(status).value
        task.updated_at = datetime.now(timezone.utc)

        self.session.add(task)
        self.session.commit()
        self.session.refresh(task)
        return task

    def patch_task(
        self,
        task_id: UUID,
        *,
        title: str | None,
        description: str | None,
        status: str | TaskStatus | None,
    ) -> Task | None:
        task = self.get_task(task_id)
        if not task:
            return None

        if title is not None:
            task.title = normalize_title(title)
        if description is not None:
            task.description = normalize_description(description)
        if status is not None:
            task.status = parse_status(status).value

        task.updated_at = datetime.now(timezone.utc)
        self.session.add(task)
        self.session.commit()
        self.session.refresh(task)
        return task

    def delete_task(self, task_id: UUID) -> bool:
        task = self.get_task(task_id)
        if not task:
            return False
        self.session.delete(task)
        self.session.commit()
        return True
