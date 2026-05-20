"""add task cursor index

Revision ID: 20260520_0002
Revises: 20260518_0001
Create Date: 2026-05-20 00:00:00
"""

from __future__ import annotations

from collections.abc import Sequence

from alembic import op
import sqlalchemy as sa

# revision identifiers, used by Alembic.
revision: str = "20260520_0002"
down_revision: str | None = "20260518_0001"
branch_labels: str | Sequence[str] | None = None
depends_on: str | Sequence[str] | None = None


def upgrade() -> None:
    bind = op.get_bind()
    inspector = sa.inspect(bind)

    if not inspector.has_table("tasks"):
        return

    existing_indexes = {index["name"] for index in inspector.get_indexes("tasks")}
    if "ix_tasks_created_at_id" not in existing_indexes:
        op.create_index("ix_tasks_created_at_id", "tasks", ["created_at", "id"], unique=False)


def downgrade() -> None:
    bind = op.get_bind()
    inspector = sa.inspect(bind)

    if not inspector.has_table("tasks"):
        return

    existing_indexes = {index["name"] for index in inspector.get_indexes("tasks")}
    if "ix_tasks_created_at_id" in existing_indexes:
        op.drop_index("ix_tasks_created_at_id", table_name="tasks")
