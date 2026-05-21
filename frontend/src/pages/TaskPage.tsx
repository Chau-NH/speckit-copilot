import TaskCreateForm from "../components/TaskCreateForm";
import TaskList from "../components/TaskList";
import { getTaskListErrorMessage } from "../lib/task_pagination";
import {
  useCreateTaskMutation,
  useDeleteTaskMutation,
  useTasksQuery,
  useUpdateTaskDetailsMutation,
  useUpdateTaskStatusMutation,
} from "../services/tasks";

function TaskPage() {
  const tasksQuery = useTasksQuery();
  const createTaskMutation = useCreateTaskMutation();
  const updateTaskStatusMutation = useUpdateTaskStatusMutation();
  const updateTaskDetailsMutation = useUpdateTaskDetailsMutation();
  const deleteTaskMutation = useDeleteTaskMutation();

  return (
    <main className="relative overflow-hidden min-h-screen">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -top-20 left-1/2 h-64 w-64 -translate-x-1/2 rounded-full bg-sky-200/40 blur-3xl" />
        <div className="absolute top-40 right-[-4rem] h-56 w-56 rounded-full bg-slate-200/70 blur-3xl" />
      </div>

      <div className="relative mx-auto flex min-h-screen w-full max-w-6xl flex-col px-4 py-8 sm:px-6 lg:px-8 lg:py-12">
        <header className="mb-8 flex flex-col gap-4 rounded-3xl border border-white/70 bg-white/80 p-6 shadow-sm backdrop-blur md:flex-row md:items-end md:justify-between">
          <div className="max-w-2xl space-y-3">
            <div className="inline-flex items-center rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-slate-600">
              TaskFlow
            </div>
            <div className="space-y-2">
              <h1 className="text-3xl font-semibold tracking-tight text-slate-950 sm:text-4xl lg:text-5xl">
                A cleaner way to track work.
              </h1>
              <p className="max-w-2xl text-sm leading-6 text-slate-600 sm:text-base">
                Create tasks, update progress, edit details, and remove work items from a polished, cursor-paginated list.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3 text-center text-sm text-slate-600 md:min-w-[240px]">
            <div className="rounded-2xl border border-slate-200 bg-slate-50 px-3 py-3">
              <div className="text-lg font-semibold text-slate-950">Fast</div>
              <div>CRUD</div>
            </div>
            <div className="rounded-2xl border border-slate-200 bg-slate-50 px-3 py-3">
              <div className="text-lg font-semibold text-slate-950">Clear</div>
              <div>Layout</div>
            </div>
            <div className="rounded-2xl border border-slate-200 bg-slate-50 px-3 py-3">
              <div className="text-lg font-semibold text-slate-950">Polished</div>
              <div>UI</div>
            </div>
          </div>
        </header>

        <div className="grid gap-6 xl:grid-cols-[380px_minmax(0,1fr)] xl:items-start">
          <TaskCreateForm
            onCreate={async (payload) => {
              await createTaskMutation.mutateAsync(payload);
            }}
            isSubmitting={createTaskMutation.isPending}
          />

          <div className="space-y-4">
            {tasksQuery.isError ? (
              <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 shadow-sm">
                <p className="text-sm font-medium text-red-700">{getTaskListErrorMessage(tasksQuery.error)}</p>
              </div>
            ) : null}

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
              onTaskDelete={async (payload) => {
                await deleteTaskMutation.mutateAsync(payload);
              }}
              updatingTaskId={
                updateTaskStatusMutation.isPending ? (updateTaskStatusMutation.variables?.taskId ?? null) : null
              }
              editingTaskId={
                updateTaskDetailsMutation.isPending ? (updateTaskDetailsMutation.variables?.taskId ?? null) : null
              }
              deletingTaskId={deleteTaskMutation.isPending ? (deleteTaskMutation.variables?.taskId ?? null) : null}
            />
          </div>
        </div>
      </div>
    </main>
  );
}

export default TaskPage;
