import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { vi } from "vitest";
import TaskPage from "../../src/pages/TaskPage";

const mockUseTasksQuery = vi.fn();
const mockCreateTask = vi.fn();
const mockUpdateStatus = vi.fn();

vi.mock("../../src/services/tasks", () => ({
  useTasksQuery: () => mockUseTasksQuery(),
  useCreateTaskMutation: () => ({
    mutateAsync: mockCreateTask,
    isPending: false,
  }),
  useUpdateTaskStatusMutation: () => ({
    mutateAsync: mockUpdateStatus,
    isPending: false,
  }),
  useUpdateTaskDetailsMutation: () => ({
    mutateAsync: vi.fn(),
    isPending: false,
    variables: undefined,
  }),
  useDeleteTaskMutation: () => ({
    mutateAsync: vi.fn(),
    isPending: false,
    variables: undefined,
  }),
}));

function renderPage() {
  const queryClient = new QueryClient();
  return render(
    <QueryClientProvider client={queryClient}>
      <TaskPage />
    </QueryClientProvider>
  );
}

describe("Task list/create flow", () => {
  beforeEach(() => {
    mockCreateTask.mockReset();
    mockUpdateStatus.mockReset();

    mockUseTasksQuery.mockReturnValue({
      items: [
        {
          id: "1",
          title: "Existing task",
          description: "",
          status: "todo",
          createdAt: "2026-05-14T10:00:00Z",
          updatedAt: "2026-05-14T10:00:00Z",
        },
      ],
      nextCursor: "next-cursor",
      hasMore: true,
      isLoading: false,
      isError: false,
      isFetchingNextPage: false,
      fetchNextPage: vi.fn(),
      limit: 20,
    });
    mockCreateTask.mockResolvedValue({
      id: "2",
      title: "Buy groceries",
      description: "Milk",
      status: "todo",
      createdAt: "2026-05-14T10:05:00Z",
      updatedAt: "2026-05-14T10:05:00Z",
    });
  });

  it("renders existing tasks and creates a new task", async () => {
    renderPage();

    expect(screen.getByText("Existing task")).toBeInTheDocument();

    fireEvent.change(screen.getByLabelText("Title"), { target: { value: "Buy groceries" } });
    fireEvent.change(screen.getByLabelText("Description"), { target: { value: "Milk" } });
    fireEvent.click(screen.getByRole("button", { name: "Add task" }));

    await waitFor(() => {
      expect(mockCreateTask).toHaveBeenCalledWith({
        title: "Buy groceries",
        description: "Milk",
        status: "todo",
      });
    });
  });

  it("shows load more when more pages are available", () => {
    renderPage();
    expect(screen.getByRole("button", { name: "Load more" })).toBeInTheDocument();
  });
});
