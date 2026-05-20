from __future__ import annotations

from datetime import datetime, timedelta, timezone
from uuid import UUID

import pytest
from sqlmodel import Session, SQLModel, create_engine

from src.lib.task_domain import TaskStatus
from src.models.task import Task
from src.repositories.task_repository import TaskRepository


@pytest.fixture()
def repo() -> TaskRepository:
    engine = create_engine("sqlite://", connect_args={"check_same_thread": False})
    SQLModel.metadata.create_all(engine)

    session = Session(engine)
    try:
        yield TaskRepository(session)
    finally:
        session.close()


def test_cursor_round_trip_encoding_and_decoding() -> None:
    created_at = datetime(2026, 5, 20, 12, 30, tzinfo=timezone.utc)
    task_id = UUID("00000000-0000-0000-0000-000000000123")

    cursor = TaskRepository._encode_cursor(created_at, task_id)
    decoded_created_at, decoded_task_id = TaskRepository._decode_cursor(cursor)

    assert decoded_created_at == created_at
    assert decoded_task_id == task_id


def test_decode_cursor_rejects_invalid_values() -> None:
    with pytest.raises(ValueError, match="Invalid cursor"):
        TaskRepository._decode_cursor("not-a-valid-cursor")


def test_list_tasks_uses_cursor_ordering_and_limit(repo: TaskRepository) -> None:
    base_time = datetime(2026, 5, 20, 12, 0, tzinfo=timezone.utc)
    tasks = [
        Task(
            id=UUID("00000000-0000-0000-0000-000000000003"),
            title="older",
            description="",
            status=TaskStatus.TODO.value,
            created_at=base_time - timedelta(hours=1),
            updated_at=base_time - timedelta(hours=1),
        ),
        Task(
            id=UUID("00000000-0000-0000-0000-000000000002"),
            title="same-time-second",
            description="",
            status=TaskStatus.TODO.value,
            created_at=base_time,
            updated_at=base_time,
        ),
        Task(
            id=UUID("00000000-0000-0000-0000-000000000001"),
            title="same-time-first",
            description="",
            status=TaskStatus.TODO.value,
            created_at=base_time,
            updated_at=base_time,
        ),
    ]

    repo.session.add_all(tasks)
    repo.session.commit()

    items, next_cursor, has_more, applied_limit = repo.list_tasks(cursor=None, limit=1)

    assert [item.title for item in items] == ["same-time-second"]
    assert applied_limit == 1
    assert has_more is True
    assert next_cursor is not None

    next_items, second_cursor, second_has_more, second_applied_limit = repo.list_tasks(cursor=next_cursor, limit=2)

    assert [item.title for item in next_items] == ["same-time-first", "older"]
    assert second_cursor is None
    assert second_has_more is False
    assert second_applied_limit == 2
