import { Navigate, Route, Routes } from "react-router-dom";
import TaskCreatePage from "./pages/TaskCreatePage";
import TaskDetailPage from "./pages/TaskDetailPage";
import TaskEditPage from "./pages/TaskEditPage";
import TaskPage from "./pages/TaskPage";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/tasks" replace />} />
      <Route path="/tasks" element={<TaskPage />} />
      <Route path="/tasks/new" element={<TaskCreatePage />} />
      <Route path="/tasks/:taskId/edit" element={<TaskEditPage />} />
      <Route path="/tasks/:taskId" element={<TaskDetailPage />} />
    </Routes>
  );
}

export default App;
