import { useState } from "react";

type Column = {
  id: string;
  title: string;
};

export function useColumns(INITIAL_COLUMNS: Column[]) {
  const [columns, setColumns] = useState(INITIAL_COLUMNS);

  const handleAddColumn = () => {
    const title = prompt("Column title");
    const foundColumn = columns.find((c) => c.title === title);
    if (title && !foundColumn) {
      setColumns((prev) => {
        return [...prev, { id: crypto.randomUUID(), title }];
      });
    }
  };

  const removeColumn = (columnId: string) => {
    setColumns((prev) => prev.filter((column) => column.id !== columnId));
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

  return { columns, handleAddColumn, removeColumn, handleEditColumn };
}
