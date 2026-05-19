import TaskCreateForm from "../components/TaskCreateForm";
import TaskList from "../components/TaskList";
import {
  useCreateTaskMutation,
  useTasksQuery,
  useUpdateTaskDetailsMutation,
  useUpdateTaskStatusMutation,
} from "../services/tasks";

function TaskPage() {
  const tasksQuery = useTasksQuery();
  const createTaskMutation = useCreateTaskMutation();
  const updateTaskStatusMutation = useUpdateTaskStatusMutation();
  const updateTaskDetailsMutation = useUpdateTaskDetailsMutation();

  return (
    <main className="container">
      <h1>TaskFlow</h1>
      <p className="subtitle">Create tasks and load task pages with cursor-based pagination.</p>

      <TaskCreateForm
        onCreate={async (payload) => {
          await createTaskMutation.mutateAsync(payload);
        }}
        isSubmitting={createTaskMutation.isPending}
      />

      {tasksQuery.isError ? <p className="error">Unable to load tasks.</p> : null}

      <TaskList
        items={tasksQuery.items}
        canLoadMore={tasksQuery.hasMore}
        isLoadingMore={tasksQuery.isFetchingNextPage}
        onLoadMore={() => {
          void tasksQuery.fetchNextPage();
        }}
        onStatusChange={(payload) => {
          void updateTaskStatusMutation.mutateAsync(payload);
        }}
        onTaskEdit={async (payload) => {
          await updateTaskDetailsMutation.mutateAsync(payload);
        }}
        updatingTaskId={
          updateTaskStatusMutation.isPending ? (updateTaskStatusMutation.variables?.taskId ?? null) : null
        }
        editingTaskId={
          updateTaskDetailsMutation.isPending ? (updateTaskDetailsMutation.variables?.taskId ?? null) : null
        }
      />
    </main>
  );
}

export default TaskPage;
