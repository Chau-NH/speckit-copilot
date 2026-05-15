import type { ApiTask, ApiTaskListPage } from "../services/api";

export type Task = {
  id: string;
  title: string;
  description: string;
  status: "todo" | "in_progress" | "done";
  createdAt: string;
  updatedAt: string;
};

export type TaskListPage = {
  items: Task[];
  nextCursor: string | null;
  hasMore: boolean;
  limit: number;
};

export function adaptTask(apiTask: ApiTask): Task {
  return {
    id: apiTask.id,
    title: apiTask.title,
    description: apiTask.description,
    status: apiTask.status,
    createdAt: apiTask.created_at,
    updatedAt: apiTask.updated_at,
  };
}

export function adaptTaskPage(apiPage: ApiTaskListPage): TaskListPage {
  return {
    items: apiPage.items.map(adaptTask),
    nextCursor: apiPage.next_cursor,
    hasMore: apiPage.has_more,
    limit: apiPage.limit,
  };
}
