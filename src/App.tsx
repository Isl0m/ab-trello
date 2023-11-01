import {
  DndContext,
  DragEndEvent,
  useDraggable,
  useDroppable,
} from "@dnd-kit/core";

const TASK_STATUSES = ["new_task", "in_progress", "done"] as const;
type Task = {
  id: string;
  title: string;
  status: (typeof TASK_STATUSES)[number];
};

import { useEffect, useState, useId } from "react";
import { Button } from "./components/ui/button";

function App() {
  const [tasks, setTasks] = useState<Task[]>([]);

  useEffect(() => {
    window.document.documentElement.classList.add("dark");
  });

  const updateTask = (taskId: string, status: Task["status"]) => {
    setTasks((prev) => {
      const taskIndex = prev.findIndex((task) => task.id === taskId);

      if (taskIndex === -1) return prev;
      const task = prev[taskIndex];
      task.status = status;

      prev.splice(taskIndex, 1);
      return [...prev, task];
    });
  };

  const addTask = (task: Task) => {
    setTasks((prev) => {
      return [...prev, task];
    });
  };

  const handleDragEnd = (e: DragEndEvent) => {
    if (
      typeof e.active.id === "string" &&
      e.over?.data.current &&
      TASK_STATUSES.includes(e.over.data.current.status)
    ) {
      updateTask(e.active.id, e.over.data.current.status);
    }
  };
  return (
    <main className="py-6 max-w-screen-xl mx-auto">
      <DndContext onDragEnd={handleDragEnd}>
        <section className="grid grid-cols-3 gap-4">
          <TasksHolder
            title="New Tasks"
            status="new_task"
            tasks={tasks.filter((task) => task.status === "new_task")}
            addTask={addTask}
          />
          <TasksHolder
            title="In Progress"
            status="in_progress"
            tasks={tasks.filter((task) => task.status === "in_progress")}
            addTask={addTask}
          />
          <TasksHolder
            title="Done"
            status="done"
            tasks={tasks.filter((task) => task.status === "done")}
            addTask={addTask}
          />
        </section>
      </DndContext>
    </main>
  );
}

type TasksHolderProps = {
  title: string;
  status: Task["status"];
  tasks: Task[];
  addTask: (task: Task) => void;
};

function TasksHolder({ title, tasks, status, addTask }: TasksHolderProps) {
  const { isOver, setNodeRef } = useDroppable({
    id: title + useId(),
    data: { status },
  });

  const handleAddTask = () => {
    const title = prompt("Task title");
    if (title) {
      addTask({ id: crypto.randomUUID(), title, status });
    }
  };

  return (
    <div
      className={`${isOver ? "bg-slate-600" : "bg-slate-700"} rounded-md p-4`}
      ref={setNodeRef}
    >
      <h3 className="text-2xl font-bold mb-4">{title}</h3>
      <ul className="flex flex-col gap-2 mb-4">
        {tasks.map((task, id) => (
          <Task key={task.title + id} title={task.title} id={task.id} />
        ))}
        {tasks.length === 0 && <li>No tasks</li>}
      </ul>
      <Button onClick={handleAddTask}>Add</Button>
    </div>
  );
}

function Task({ id, title }: { id: string; title: string }) {
  const { attributes, listeners, setNodeRef, transform } = useDraggable({
    id: id,
  });
  const style = transform
    ? {
        transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
      }
    : undefined;
  return (
    <li
      className="text-lg bg-slate-900 p-2 rounded"
      draggable
      ref={setNodeRef}
      style={style}
      {...listeners}
      {...attributes}
    >
      {title}
    </li>
  );
}

export default App;
