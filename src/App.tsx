import {
  DndContext,
  DragEndEvent,
  useDraggable,
  useDroppable,
} from "@dnd-kit/core";

import { useState, useId } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "./components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./components/ui/dropdown-menu";

const INITIAL_COLUMNS = ["New Task", "In Progress", "Done"].map((title) => ({
  id: crypto.randomUUID(),
  title,
}));
type Task = {
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

type TasksHolderProps = {
  title: string;
  columnId: string;
  tasks: Task[];
  addTask: (task: Task) => void;
  dropdownActions: {
    handleEdit: () => void;
    handleDelete: () => void;
  };
};

function TasksHolder({
  title,
  tasks,
  columnId,
  addTask,
  dropdownActions,
}: TasksHolderProps) {
  const { isOver, setNodeRef } = useDroppable({
    id: title + useId(),
    data: { columnId },
  });

  const handleAddTask = () => {
    const title = prompt("Task title");
    if (title) {
      addTask({ id: crypto.randomUUID(), title, columnId });
    }
  };

  return (
    <Card className={isOver ? "bg-slate-100" : ""} ref={setNodeRef}>
      <CardHeader className="flex flex-row justify-between items-center">
        <CardTitle>{title}</CardTitle>
        <DropdownMenu>
          <DropdownMenuTrigger>Open</DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem onClick={dropdownActions.handleEdit}>
              Edit
            </DropdownMenuItem>
            <DropdownMenuItem onClick={dropdownActions.handleDelete}>
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </CardHeader>
      <CardContent>
        <ul className="flex flex-col gap-2 mb-4">
          {tasks.map((task, id) => (
            <Task key={task.title + id} title={task.title} id={task.id} />
          ))}
          {tasks.length === 0 && <li>No tasks</li>}
        </ul>
      </CardContent>
      <CardFooter>
        <Button onClick={handleAddTask}>+ Add Task</Button>
      </CardFooter>
    </Card>
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
      className="text-lg bg-slate-200 p-2 rounded"
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
