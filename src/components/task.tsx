"use client";

import { useDraggable } from "@dnd-kit/core";

export function Task({ id, title }: { id: string; title: string }) {
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
