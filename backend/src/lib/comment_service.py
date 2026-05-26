from __future__ import annotations

from uuid import UUID

from src.models.comment import Comment
from src.repositories.comment_repository import CommentRepository


def list_comments(repo: CommentRepository, *, task_id: UUID) -> list[Comment]:
    raise NotImplementedError("Comment service is not implemented yet.")