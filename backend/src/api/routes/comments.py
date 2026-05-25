from __future__ import annotations

from fastapi import APIRouter

router = APIRouter(prefix="/tasks/{task_id}/comments", tags=["comments"])