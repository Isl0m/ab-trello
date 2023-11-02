import { DndContext, DragEndEvent } from "@dnd-kit/core";

import { useState } from "react";
import { Button } from "@/components/ui/button";

import { TasksHolder } from "./components/task-holder";

const INITIAL_COLUMNS = ["New Task", "In Progress", "Done"].map((title) => ({
  id: crypto.randomUUID(),
  title,
}));

export type Task = {
  id: string;
  title: string;
  columnId: string;
};

function App() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [columns, setColumns] = useState(INITIAL_COLUMNS);

  const updateTask = (taskId: string, columnId: string) => {
    setTasks((prev) => {
      const taskIndex = prev.findIndex((task) => task.id === taskId);

      if (taskIndex === -1) return prev;
      const task = prev[taskIndex];
      task.columnId = columnId;

      prev.splice(taskIndex, 1);
      return [...prev, task];
    });
  };

  const addTask = (task: Task) => {
    setTasks((prev) => {
      return [...prev, task];
    });
  };

  const handleAddColumn = () => {
    const title = prompt("Column title");
    const foundColumn = columns.find((c) => c.title === title);
    if (title && !foundColumn) {
      setColumns((prev) => {
        return [...prev, { id: crypto.randomUUID(), title }];
      });
    }
  };

  const handleDeleteColumn = (id: string) => () => {
    const isConfirm = confirm("Are you sure?");
    if (isConfirm) {
      setColumns((prev) => prev.filter((column) => column.id !== id));
      setTasks((prev) => prev.filter((task) => task.columnId !== id));
    }
  };

  const handleEditColumn = (id: string) => () => {
    const newTitle = prompt("Column title");
    if (newTitle) {
      setColumns((prev) =>
        prev.map((column) => {
          if (column.id === id) {
            return { ...column, title: newTitle };
          }
          return column;
        })
      );
    }
  };

  const handleDragEnd = (e: DragEndEvent) => {
    if (
      typeof e.active.id === "string" &&
      e.over?.data.current &&
      columns.find((c) => c.id === e.over?.data.current?.columnId)
    ) {
      updateTask(e.active.id, e.over.data.current.columnId);
    }
  };
  return (
    <main className="py-6 max-w-screen-xl mx-auto">
      <DndContext onDragEnd={handleDragEnd}>
        <section className="grid grid-cols-4 items-start gap-4">
          {columns.map(({ id, title }) => (
            <TasksHolder
              key={id}
              title={title}
              columnId={id}
              tasks={tasks.filter((task) => task.columnId === id)}
              addTask={addTask}
              dropdownActions={{
                handleDelete: handleDeleteColumn(id),
                handleEdit: handleEditColumn(id),
              }}
            />
          ))}
          <Button onClick={handleAddColumn}>+ Add Column</Button>
        </section>
      </DndContext>
    </main>
  );
}

export default App;
