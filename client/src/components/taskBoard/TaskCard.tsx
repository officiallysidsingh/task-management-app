// ShadCN Imports
import { Button } from "../ui/button";

// Dnd Kit Imports
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

interface TaskCardProps {
  id: string;
  title: string;
  description: string;
  createdAt: string;
  isDragging?: boolean;
}

export default function TaskCard({
  id,
  title,
  description,
  createdAt,
  isDragging,
}: TaskCardProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging: isSortableDragging,
  } = useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isSortableDragging ? 0.5 : 1,
  };

  const cardContent = (
    <>
      <div>
        <h1 className="text-lg font-bold">{title}</h1>
        <p className="text-base">{description}</p>
      </div>
      <div>
        <p className="text-sm">Created at: {createdAt}</p>
        {!isDragging && (
          <div className="flex justify-end gap-2">
            <Button size="sm" className="bg-red-500 hover:bg-red-400">
              Delete
            </Button>
            <Button size="sm" className="bg-primary/75 hover:bg-primary/65">
              Edit
            </Button>
            <Button size="sm">View Details</Button>
          </div>
        )}
      </div>
    </>
  );

  if (isDragging) {
    return (
      <div
        style={{
          ...style,
          cursor: "grabbing",
          boxShadow:
            "0 0 0 1px rgba(63, 63, 68, 0.05), 0 1px 3px 0 rgba(34, 33, 81, 0.15)",
        }}
        className="bg-primary/25 px-2 py-4 flex flex-col gap-14 rounded-md"
      >
        {cardContent}
      </div>
    );
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className="bg-primary/25 px-2 py-4 flex flex-col gap-14 rounded-md touch-none cursor-grab active:cursor-grabbing"
    >
      {cardContent}
    </div>
  );
}
