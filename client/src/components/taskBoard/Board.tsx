// Component Imports
import TaskCard from "./TaskCard";

// Dnd Kit Imports
import { useDroppable } from "@dnd-kit/core";
import {
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";

interface Task {
  id: string;
  title: string;
  description: string;
  status: string;
  createdAt: string;
}

interface BoardProps {
  id: string;
  containerType: string;
  tasks: Task[];
}

export default function Board({ id, containerType, tasks }: BoardProps) {
  const { setNodeRef } = useDroppable({ id });

  return (
    <div
      ref={setNodeRef}
      className="flex flex-col p-2 border border-muted shadow-md gap-4"
    >
      <div className="flex bg-primary/75 px-2 py-1 rounded-sm">
        <h1 className="text-white text-lg font-bold">{containerType}</h1>
      </div>
      <SortableContext items={tasks} strategy={verticalListSortingStrategy}>
        <div className="flex flex-col gap-4">
          {tasks.map((task) => (
            <TaskCard
              key={task.id}
              id={task.id}
              title={task.title}
              description={task.description}
              createdAt={task.createdAt}
            />
          ))}
        </div>
      </SortableContext>
    </div>
  );
}
