import { FormEvent, useState } from "react";

type TaskCreateFormProps = {
  onCreate: (payload: { title: string; description: string; status: "todo" }) => Promise<void>;
  isSubmitting: boolean;
};

function TaskCreateForm({ onCreate, isSubmitting }: TaskCreateFormProps) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const cleanTitle = title.trim();

    if (!cleanTitle) {
      setError("Title is required.");
      return;
    }

    setError(null);
    await onCreate({ title: cleanTitle, description: description.trim(), status: "todo" });
    setTitle("");
    setDescription("");
  };

  return (
    <form className="card task-form" onSubmit={handleSubmit}>
      <h2>Create Task</h2>
      <label htmlFor="task-title">Title</label>
      <input
        id="task-title"
        aria-label="Title"
        value={title}
        onChange={(event) => setTitle(event.target.value)}
        maxLength={255}
      />

      <label htmlFor="task-description">Description</label>
      <textarea
        id="task-description"
        aria-label="Description"
        value={description}
        onChange={(event) => setDescription(event.target.value)}
        maxLength={4000}
      />

      {error ? <p className="error">{error}</p> : null}
      <button type="submit" disabled={isSubmitting}>
        {isSubmitting ? "Adding..." : "Add task"}
      </button>
    </form>
  );
}

export default TaskCreateForm;
