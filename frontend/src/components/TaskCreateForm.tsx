import { FormEvent, useState } from "react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Textarea } from "../ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";

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
    <Card className="overflow-hidden border-slate-200/80 shadow-sm">
      <CardHeader className="space-y-2 border-b border-slate-100 bg-slate-50/80">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">Quick entry</p>
        <CardTitle className="text-2xl">Create task</CardTitle>
      </CardHeader>
      <CardContent className="pt-6">
        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="space-y-2">
            <label htmlFor="task-title" className="text-sm font-medium text-slate-700">
              Title
            </label>
            <Input
              id="task-title"
              aria-label="Title"
              placeholder="Enter task title"
              value={title}
              onChange={(event) => setTitle(event.target.value)}
              maxLength={255}
              disabled={isSubmitting}
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="task-description" className="text-sm font-medium text-slate-700">
              Description
            </label>
            <Textarea
              id="task-description"
              aria-label="Description"
              placeholder="Enter task description (optional)"
              value={description}
              onChange={(event) => setDescription(event.target.value)}
              maxLength={4000}
              disabled={isSubmitting}
            />
          </div>

          {error ? <p className="text-sm font-medium text-red-600">{error}</p> : null}

          <div className="flex justify-end">
            <Button type="submit" disabled={isSubmitting} className="w-full sm:w-auto sm:min-w-40">
            {isSubmitting ? "Adding..." : "Add task"}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}

export default TaskCreateForm;
