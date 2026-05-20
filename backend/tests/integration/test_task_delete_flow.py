from __future__ import annotations

from fastapi.testclient import TestClient


def test_delete_removes_only_target_task_from_list(client: TestClient) -> None:
    first = client.post(
        "/tasks",
        json={"title": "First task", "description": "", "status": "todo"},
    )
    second = client.post(
        "/tasks",
        json={"title": "Second task", "description": "", "status": "todo"},
    )

    first_id = first.json()["id"]
    second_id = second.json()["id"]

    delete_response = client.delete(f"/tasks/{first_id}")
    assert delete_response.status_code == 204

    listed = client.get("/tasks")
    assert listed.status_code == 200
    payload = listed.json()
    returned_ids = [item["id"] for item in payload["items"]]

    assert first_id not in returned_ids
    assert second_id in returned_ids


def test_delete_last_task_results_in_empty_list_page(client: TestClient) -> None:
    created = client.post(
        "/tasks",
        json={"title": "Only task", "description": "", "status": "todo"},
    )
    task_id = created.json()["id"]

    delete_response = client.delete(f"/tasks/{task_id}")
    assert delete_response.status_code == 204

    listed = client.get("/tasks")
    assert listed.status_code == 200
    payload = listed.json()
    assert payload["items"] == []
    assert payload["has_more"] is False
    assert payload["next_cursor"] is None
