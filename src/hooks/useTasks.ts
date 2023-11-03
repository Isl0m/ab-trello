import { useState } from "react";

export type Task = {
  id: string;
  title: string;
  columnId: string;
};

export function useTasks() {
  const [tasks, setTasks] = useState<Task[]>([]);

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

  const removeTasksInColumn = (columnId: string) => {
    setTasks((prev) => prev.filter((task) => task.columnId !== columnId));
  };

  return { updateTask, addTask, tasks, removeTasksInColumn };
}
