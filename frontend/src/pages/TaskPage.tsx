import { useQuery } from "@tanstack/react-query";
import { adaptTaskPage } from "../lib/task_adapter";
import { getHealth, getTasksPage } from "../services/api";

function TaskPage() {
  const healthQuery = useQuery({
    queryKey: ["health"],
    queryFn: getHealth,
  });

  const firstPageQuery = useQuery({
    queryKey: ["tasks", "first-page"],
    queryFn: async () => adaptTaskPage(await getTasksPage(undefined, 20)),
  });

  return (
    <main className="container">
      <h1>TaskFlow</h1>
      <p className="subtitle">Foundation phase wired: API client, adapters, and query provider are active.</p>

      <section className="card">
        <h2>Backend Health</h2>
        <p>
          {healthQuery.isLoading && "Checking backend..."}
          {healthQuery.isError && "Backend is unreachable."}
          {healthQuery.data && `Status: ${healthQuery.data.status}`}
        </p>
      </section>

      <section className="card">
        <h2>Task Feed Bootstrap</h2>
        <p>
          {firstPageQuery.isLoading && "Loading first task page..."}
          {firstPageQuery.isError && "Unable to load tasks yet."}
          {firstPageQuery.data &&
            `Loaded ${firstPageQuery.data.items.length} tasks. hasMore=${String(firstPageQuery.data.hasMore)}.`}
        </p>
      </section>
    </main>
  );
}

export default TaskPage;
