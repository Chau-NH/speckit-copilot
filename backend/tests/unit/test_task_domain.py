from __future__ import annotations

import pytest

from src.lib.task_domain import TaskStatus, ensure_status_transition, normalize_description, normalize_title, parse_status


def test_normalize_title_trims_whitespace_and_rejects_blank_values() -> None:
    assert normalize_title("  Task title  ") == "Task title"

    with pytest.raises(ValueError, match="Task title must not be empty"):
        normalize_title("   ")


def test_normalize_description_and_status_parsing() -> None:
    assert normalize_description(None) == ""
    assert normalize_description("  Notes  ") == "Notes"
    assert parse_status(None) == TaskStatus.TODO
    assert parse_status("done") == TaskStatus.DONE

    with pytest.raises(ValueError, match="Invalid status"):
        parse_status("blocked")


def test_ensure_status_transition_accepts_supported_values() -> None:
    assert ensure_status_transition(TaskStatus.TODO, TaskStatus.DONE) == TaskStatus.DONE
