from __future__ import annotations

from sqlmodel import Session


class CommentRepository:
    def __init__(self, session: Session):
        self.session = session