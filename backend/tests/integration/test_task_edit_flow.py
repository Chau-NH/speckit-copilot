from __future__ import annotations

from fastapi.testclient import TestClient


def test_editing_title_and_description_persists(client: TestClient) -> None:
    created = client.post(
        "/tasks",
        json={
            "title": "Buy gorceries",
            "description": "",
            "status": "todo",
        },
    )
    task_id = created.json()["id"]

    updated = client.put(
        f"/tasks/{task_id}",
        json={
            "title": "Buy groceries",
            "description": "Weekly shopping",
            "status": "todo",
        },
    )
    assert updated.status_code == 200
    assert updated.json()["title"] == "Buy groceries"
    assert updated.json()["description"] == "Weekly shopping"

    fetched = client.get(f"/tasks/{task_id}")
    assert fetched.status_code == 200
    assert fetched.json()["title"] == "Buy groceries"
    assert fetched.json()["description"] == "Weekly shopping"


def test_empty_title_is_rejected_when_editing(client: TestClient) -> None:
    created = client.post(
        "/tasks",
        json={
            "title": "Keep me",
            "description": "Original",
            "status": "todo",
        },
    )
    task_id = created.json()["id"]

    response = client.put(
        f"/tasks/{task_id}",
        json={
            "title": "   ",
            "description": "Changed",
            "status": "todo",
        },
    )
    assert response.status_code == 422

    fetched = client.get(f"/tasks/{task_id}")
    assert fetched.status_code == 200
    assert fetched.json()["title"] == "Keep me"
    assert fetched.json()["description"] == "Original"
