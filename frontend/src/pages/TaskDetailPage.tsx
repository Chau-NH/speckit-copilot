import { useParams } from "react-router-dom";

function TaskDetailPage() {
  const { taskId } = useParams();

  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-50 px-4 py-12 text-slate-950">
      <section className="w-full max-w-xl rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-500">TaskFlow</p>
        <h1 className="mt-3 text-3xl font-semibold tracking-tight">Task detail</h1>
        <p className="mt-3 text-sm leading-6 text-slate-600">
          Detailed task interactions will live here for task {taskId ?? "unknown"}.
        </p>
      </section>
    </main>
  );
}

export default TaskDetailPage;