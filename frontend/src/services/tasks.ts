import { useInfiniteQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { adaptTask, adaptTaskPage, type Task } from "../lib/task_adapter";
import { normalizeCursor } from "../lib/task_pagination";
import {
  createTask,
  deleteTask,
  getTasksPage,
  patchTask,
  replaceTask,
  type ApiTaskCreateInput,
  type ApiTaskUpdateInput,
} from "./api";

const TASKS_QUERY_KEY = ["tasks"] as const;

export type CreateTaskInput = {
  title: string;
  description: string;
  status: "todo" | "in_progress" | "done";
};

export function useTasksQuery(limit = 20) {
  const query = useInfiniteQuery({
    queryKey: TASKS_QUERY_KEY,
    initialPageParam: undefined as string | undefined,
    queryFn: async ({ pageParam }) => adaptTaskPage(await getTasksPage(normalizeCursor(pageParam), limit)),
    getNextPageParam: (lastPage) => lastPage.nextCursor ?? undefined,
  });

  const pages = query.data?.pages ?? [];
  const items = pages.flatMap((page) => page.items);
  const lastPage = pages.length > 0 ? pages[pages.length - 1] : undefined;

  return {
    ...query,
    items,
    hasMore: lastPage?.hasMore ?? false,
    nextCursor: lastPage?.nextCursor ?? null,
  };
}

export function useCreateTaskMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload: CreateTaskInput): Promise<Task> => {
      const requestPayload: ApiTaskCreateInput = {
        title: payload.title,
        description: payload.description,
        status: payload.status,
      };
      const created = await createTask(requestPayload);
      return adaptTask(created);
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: TASKS_QUERY_KEY });
    },
  });
}

export function useUpdateTaskStatusMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload: { taskId: string; status: Task["status"] }): Promise<Task> => {
      const updated = await patchTask(payload.taskId, { status: payload.status });
      return adaptTask(updated);
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: TASKS_QUERY_KEY });
    },
  });
}

export function useUpdateTaskDetailsMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload: {
      taskId: string;
      title: string;
      description: string;
      status: Task["status"];
    }): Promise<Task> => {
      const requestPayload: ApiTaskUpdateInput = {
        title: payload.title,
        description: payload.description,
        status: payload.status,
      };

      const updated = await replaceTask(payload.taskId, requestPayload);
      return adaptTask(updated);
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: TASKS_QUERY_KEY });
    },
  });
}

export function useDeleteTaskMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload: { taskId: string }): Promise<void> => {
      await deleteTask(payload.taskId);
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: TASKS_QUERY_KEY });
    },
  });
}
