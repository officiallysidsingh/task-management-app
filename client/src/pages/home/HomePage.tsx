// React Imports
import { useEffect, useState } from "react";

// ShadCN Imports
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

// Component Imports
import AddTaskDialog from "@/components/dialogs/AddTaskDialog";
import Board from "@/components/taskBoard/Board";
import TaskCard from "@/components/taskBoard/TaskCard";

// Dnd Kit Imports
import { arrayMove, SortableContext } from "@dnd-kit/sortable";
import {
  DndContext,
  DragOverEvent,
  DragOverlay,
  DragStartEvent,
  MouseSensor,
  rectIntersection,
  TouchSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";

// Type Imports
import { Task } from "@/interfaces/taskBoard";
import ApiErrorResponse from "@/interfaces/axiosError";

// Axios Imports
import axiosInstance from "@/config/axiosInstance";
import { AxiosError } from "axios";

// Toast Imports
import { toast } from "sonner";

export default function HomePage() {
  const [openAdd, setOpenAdd] = useState(false);
  const [sortType, setSortType] = useState("recent");

  const [tasks, setTasks] = useState<Task[]>([]);
  const [activeTask, setActiveTask] = useState<Task | null>(null);

  // For fetching all tasks
  useEffect(() => {
    axiosInstance
      .get("/tasks")
      .then((response) => {
        setTasks(response?.data);
      })
      .catch((error: AxiosError<ApiErrorResponse>) => {
        if (error?.response?.status !== 500) {
          toast.error(error?.response?.data?.message);
        } else {
          toast.error("Error! Something Went Wrong!");
        }
      });
  }, []);

  // For adding task
  const handleAddTask = () => {
    setOpenAdd(true);
  };

  const changeSortType = (value: string) => {
    setSortType(value);
  };

  const sensors = useSensors(
    useSensor(MouseSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
    useSensor(TouchSensor, {
      activationConstraint: {
        delay: 250,
        tolerance: 5,
      },
    })
  );

  const handleDragStart = (event: DragStartEvent) => {
    const { active } = event;
    const task = tasks.find((task) => task.id === active.id);
    setActiveTask(task || null);
  };

  const handleDragOver = (event: DragOverEvent) => {
    const { active, over } = event;

    if (!over) return;

    const activeTask = tasks.find((task) => task.id === active.id);
    const overId = String(over.id);

    if (!activeTask) return;

    // If overId is a list (e.g., "todo", "in progress", "done"), update status
    if (["todo", "in progress", "done"].includes(overId)) {
      if (activeTask.status !== overId) {
        setTasks((tasks) =>
          tasks.map((task) =>
            task.id === activeTask.id
              ? { ...task, status: overId as Task["status"] }
              : task
          )
        );

        // Call the API to update task status
        axiosInstance
          .put(`/tasks/${activeTask.id}`, { status: overId })
          .catch((error: AxiosError<ApiErrorResponse>) => {
            if (error?.response?.status !== 500) {
              toast.error(error?.response?.data?.message);
            } else {
              toast.error("Error! Something went wrong!");
            }

            // Refetch tasks in case of error
            axiosInstance
              .get("/tasks")
              .then((response) => {
                setTasks(response?.data);
              })
              .catch((error: AxiosError<ApiErrorResponse>) => {
                if (error?.response?.status !== 500) {
                  toast.error(error?.response?.data?.message);
                } else {
                  toast.error("Error! Something Went Wrong!");
                }
              });
          });
      }
    } else {
      // If overId is another task, reorder within the list
      const overTask = tasks.find((task) => task.id === overId);

      if (!overTask) return;

      // If the tasks are in the same list, reorder them
      if (activeTask.status === overTask.status) {
        setTasks((currentTasks) => {
          const activeIndex = currentTasks.findIndex((t) => t.id === active.id);
          const overIndex = currentTasks.findIndex((t) => t.id === overId);
          return arrayMove(currentTasks, activeIndex, overIndex);
        });
      } else {
        // Move task to the new list and reorder
        setTasks((currentTasks) => {
          const activeIndex = currentTasks.findIndex((t) => t.id === active.id);
          const overIndex = currentTasks.findIndex((t) => t.id === overId);
          const updatedTasks = currentTasks.map((t) =>
            t.id === activeTask.id ? { ...t, status: overTask.status } : t
          );
          return arrayMove(updatedTasks, activeIndex, overIndex);
        });

        // Call the API to update task status
        axiosInstance
          .put(`/tasks/${activeTask.id}`, { status: overTask.status })
          .catch((error: AxiosError<ApiErrorResponse>) => {
            if (error?.response?.status !== 500) {
              toast.error(error?.response?.data?.message);
            } else {
              toast.error("Error! Something went wrong!");
            }

            // Refetch tasks in case of error
            axiosInstance
              .get("/tasks")
              .then((response) => {
                setTasks(response?.data);
              })
              .catch((error: AxiosError<ApiErrorResponse>) => {
                if (error?.response?.status !== 500) {
                  toast.error(error?.response?.data?.message);
                } else {
                  toast.error("Error! Something Went Wrong!");
                }
              });
          });
      }
    }
  };

  const handleDragEnd = () => {
    // Reset activeTask state
    setActiveTask(null);
  };

  const handleDragCancel = () => {
    setActiveTask(null);
  };

  const todoTasks = tasks.filter((task) => task.status === "todo");
  const inProgressTasks = tasks.filter((task) => task.status === "in progress");
  const doneTasks = tasks.filter((task) => task.status === "done");

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={rectIntersection}
      onDragStart={handleDragStart}
      onDragOver={handleDragOver}
      onDragEnd={handleDragEnd}
      onDragCancel={handleDragCancel}
    >
      <div className="flex flex-col p-5 gap-4">
        <div className="w-full">
          {/* Action Button */}
          <Button className="w-full md:w-40" onClick={handleAddTask}>
            Add Task
          </Button>

          {/* Modal */}
          {openAdd && (
            <AddTaskDialog
              open={openAdd}
              setOpen={setOpenAdd}
              setTasks={setTasks}
            />
          )}
        </div>
        <div className="w-full flex flex-col md:flex-row justify-between shadow-md rounded-md gap-y-4 p-4 border border-muted">
          <div className="w-2/3 md:w-2/5 flex justify-center items-center gap-2">
            <p>Search:</p>
            <Input type="text" placeholder="Search..." />
          </div>
          <div className="w-1/2 md:w-1/5 flex justify-center items-center gap-2">
            <p className="whitespace-nowrap">Sort By:</p>
            <Select value={sortType} onValueChange={changeSortType}>
              <SelectTrigger>
                <SelectValue placeholder="Select" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="recent">Recent</SelectItem>
                <SelectItem value="due">Due Date</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        <div className="grid md:grid-cols-3 gap-y-6 md:gap-x-6">
          <SortableContext items={todoTasks.map((t) => t.id)}>
            <Board
              id="todo"
              containerType="TODO"
              tasks={todoTasks}
              setTasks={setTasks}
            />
          </SortableContext>
          <SortableContext items={inProgressTasks.map((t) => t.id)}>
            <Board
              id="in progress"
              containerType="IN PROGRESS"
              tasks={inProgressTasks}
              setTasks={setTasks}
            />
          </SortableContext>
          <SortableContext items={doneTasks.map((t) => t.id)}>
            <Board
              id="done"
              containerType="DONE"
              tasks={doneTasks}
              setTasks={setTasks}
            />
          </SortableContext>
        </div>
      </div>
      <DragOverlay>
        {activeTask ? (
          <TaskCard {...activeTask} isDragging={true} setTasks={setTasks} />
        ) : null}
      </DragOverlay>
    </DndContext>
  );
}
