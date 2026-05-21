from __future__ import annotations

from datetime import datetime, timezone
from uuid import UUID, uuid4

from sqlalchemy import Index
from sqlmodel import Field, SQLModel


class Task(SQLModel, table=True):
    __tablename__ = "tasks"
    __table_args__ = (Index("ix_tasks_created_at_id", "created_at", "id"),)

    id: UUID = Field(default_factory=uuid4, primary_key=True, index=True)
    title: str = Field(min_length=1, max_length=255)
    description: str = Field(default="", max_length=4000)
    status: str = Field(default="todo", index=True)
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc), index=True)
    updated_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc), index=True)
