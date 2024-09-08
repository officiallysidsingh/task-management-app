// React Imports
import { Dispatch, SetStateAction, useState } from "react";

// ShadCN Imports
import { Button } from "../ui/button";

// Dnd Kit Imports
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

// Component Imports
import DeleteTaskDialog from "../dialogs/DeleteTaskDialog";
import EditTaskDialog from "../dialogs/EditTaskDialog";
import ViewTaskDetailsDialog from "../dialogs/ViewTaskDetailsDialog";

// Type Imports
import { Task } from "@/interfaces/taskBoard";

export default function TaskCard({
  id,
  title,
  description,
  createdAt,
  isDragging,
  setTasks,
}: {
  id: string;
  title: string;
  description: string;
  createdAt: Date;
  isDragging?: boolean;
  setTasks: Dispatch<SetStateAction<Task[]>>;
}) {
  const [openDelete, setOpenDelete] = useState(false);
  const [openEdit, setOpenEdit] = useState(false);
  const [openViewDetails, setOpenViewDetails] = useState(false);

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

  // For deleting task
  const handleDeleteTask = () => {
    setOpenDelete(true);
  };

  // For editing task
  const handleEditTask = () => {
    setOpenEdit(true);
  };

  // For viewing task
  const handleViewTaskDetails = () => {
    setOpenViewDetails(true);
  };

  const cardContent = (
    <>
      <div>
        <h1 className="text-lg font-bold">{title}</h1>
        <p className="text-base">{description}</p>
      </div>
      <div>
        <p className="text-sm">
          Created at:{" "}
          {new Date(createdAt).toLocaleString("en-GB", {
            day: "2-digit",
            month: "2-digit",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit",
            hour12: false, // For 24-hour format
          })}
        </p>
        {!isDragging && (
          <>
            {/* Action Buttons */}
            <div className="flex justify-end gap-2">
              <Button
                size="sm"
                className="bg-red-500 hover:bg-red-400"
                onClick={handleDeleteTask}
              >
                Delete
              </Button>
              <Button
                size="sm"
                className="bg-primary/75 hover:bg-primary/65"
                onClick={handleEditTask}
              >
                Edit
              </Button>
              <Button size="sm" onClick={handleViewTaskDetails}>
                View Details
              </Button>
            </div>

            {/* Modals */}
            <div>
              {openDelete && (
                <DeleteTaskDialog
                  taskId={id}
                  open={openDelete}
                  setOpen={setOpenDelete}
                  setTasks={setTasks}
                />
              )}
              {openEdit && (
                <EditTaskDialog
                  taskId={id}
                  open={openEdit}
                  setOpen={setOpenEdit}
                  setTasks={setTasks}
                />
              )}
              {openViewDetails && (
                <ViewTaskDetailsDialog
                  taskId={id}
                  open={openViewDetails}
                  setOpen={setOpenViewDetails}
                />
              )}
            </div>
          </>
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
