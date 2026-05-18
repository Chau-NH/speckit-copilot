from __future__ import annotations

from fastapi.testclient import TestClient


def test_create_then_list_with_cursor_pagination(client: TestClient) -> None:
    for idx in range(3):
        created = client.post(
            "/tasks",
            json={
                "title": f"Task {idx}",
                "description": "",
                "status": "todo",
            },
        )
        assert created.status_code == 201

    first_page = client.get("/tasks", params={"limit": 2})
    assert first_page.status_code == 200
    first_payload = first_page.json()
    assert len(first_payload["items"]) == 2
    assert first_payload["has_more"] is True
    assert isinstance(first_payload["next_cursor"], str)

    second_page = client.get(
        "/tasks",
        params={"limit": 2, "cursor": first_payload["next_cursor"]},
    )
    assert second_page.status_code == 200
    second_payload = second_page.json()
    assert len(second_payload["items"]) == 1
    assert second_payload["has_more"] is False
    assert second_payload["next_cursor"] is None
