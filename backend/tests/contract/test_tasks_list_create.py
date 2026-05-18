from __future__ import annotations

from fastapi.testclient import TestClient


def test_list_tasks_returns_page_metadata(client: TestClient) -> None:
    response = client.get("/tasks")

    assert response.status_code == 200
    payload = response.json()
    assert payload["items"] == []
    assert payload["has_more"] is False
    assert payload["next_cursor"] is None
    assert payload["limit"] == 20


def test_create_task_and_return_resource(client: TestClient) -> None:
    response = client.post(
        "/tasks",
        json={
            "title": "Buy groceries",
            "description": "Milk and eggs",
            "status": "todo",
        },
    )

    assert response.status_code == 201
    payload = response.json()
    assert payload["title"] == "Buy groceries"
    assert payload["description"] == "Milk and eggs"
    assert payload["status"] == "todo"
    assert payload["id"]
    assert payload["created_at"]
    assert payload["updated_at"]
