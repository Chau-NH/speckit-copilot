import axios from "axios";

const baseURL = import.meta.env.VITE_API_BASE_URL ?? "http://127.0.0.1:8000";

export const apiClient = axios.create({
  baseURL,
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

export type ApiTask = {
  id: string;
  title: string;
  description: string;
  status: "todo" | "in_progress" | "done";
  created_at: string;
  updated_at: string;
};

export type ApiTaskListPage = {
  items: ApiTask[];
  next_cursor: string | null;
  has_more: boolean;
  limit: number;
};

export type ApiHealthResponse = {
  status: "ok" | string;
};

export async function getHealth(): Promise<ApiHealthResponse> {
  const response = await apiClient.get<ApiHealthResponse>("/health");
  return response.data;
}

export async function getTasksPage(cursor?: string, limit = 20): Promise<ApiTaskListPage> {
  const response = await apiClient.get<ApiTaskListPage>("/tasks", {
    params: {
      cursor,
      limit,
    },
  });
  return response.data;
}
