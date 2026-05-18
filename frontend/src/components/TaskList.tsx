import type { Task } from "../lib/task_adapter";
import TaskListItem from "./TaskListItem";

type TaskListProps = {
  items: Task[];
  canLoadMore: boolean;
  isLoadingMore: boolean;
  onLoadMore: () => void;
  onStatusChange: (payload: { taskId: string; status: Task["status"] }) => void;
  updatingTaskId: string | null;
};

function TaskList({ items, canLoadMore, isLoadingMore, onLoadMore, onStatusChange, updatingTaskId }: TaskListProps) {
  return (
    <section className="card">
      <h2>Tasks</h2>
      {items.length === 0 ? <p>No tasks yet.</p> : null}
      <ul className="task-list">
        {items.map((task) => (
          <TaskListItem
            key={task.id}
            task={task}
            onStatusChange={onStatusChange}
            isUpdating={updatingTaskId === task.id}
          />
        ))}
      </ul>

      {canLoadMore ? (
        <button type="button" onClick={onLoadMore} disabled={isLoadingMore}>
          {isLoadingMore ? "Loading..." : "Load more"}
        </button>
      ) : null}
    </section>
  );
}

export default TaskList;
