import { Task as TaskType } from "@/App";
import { useDroppable } from "@dnd-kit/core";
import { useId } from "react";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Task } from "./task";
import { MoreHorizontal, Plus } from "lucide-react";

type TasksHolderProps = {
  title: string;
  columnId: string;
  tasks: TaskType[];
  addTask: (task: TaskType) => void;
  dropdownActions: {
    handleEdit: () => void;
    handleDelete: () => void;
  };
};

export function TasksHolder({
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
          <DropdownMenuTrigger>
            <MoreHorizontal size={20} />
          </DropdownMenuTrigger>
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
        <Button onClick={handleAddTask}>
          <Plus className="w-5 h-5 mr-2" /> Add Task
        </Button>
      </CardFooter>
    </Card>
  );
}
