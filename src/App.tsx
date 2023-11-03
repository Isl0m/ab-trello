import { DndContext, DragEndEvent } from "@dnd-kit/core";

import { Button } from "@/components/ui/button";

import { TasksHolder } from "./components/task-holder";
import { Plus } from "lucide-react";
import { useTasks } from "./hooks/useTasks";
import { useColumns } from "./hooks/useColumns";

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
  const { tasks, addTask, updateTask, removeTasksInColumn } = useTasks();
  const { columns, handleAddColumn, handleEditColumn, removeColumn } =
    useColumns(INITIAL_COLUMNS);

  const handleDeleteColumn = (id: string) => () => {
    const isConfirm = confirm("Are you sure?");
    if (isConfirm) {
      removeColumn(id);
      removeTasksInColumn(id);
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
          <Button onClick={handleAddColumn}>
            <Plus className="w-5 h-5 mr-2" /> Add Column
          </Button>
        </section>
      </DndContext>
    </main>
  );
}

export default App;
