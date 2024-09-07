// React Imports
import { useState } from "react";

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
import Board from "@/components/taskBoard/Board";
import TaskCard from "@/components/taskBoard/TaskCard";

// Dnd Kit Imports
import { arrayMove, SortableContext } from "@dnd-kit/sortable";
import {
  DndContext,
  DragEndEvent,
  DragOverEvent,
  DragOverlay,
  DragStartEvent,
  MouseSensor,
  rectIntersection,
  TouchSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";

interface Task {
  id: string;
  title: string;
  description: string;
  status: "todo" | "in progress" | "done";
  createdAt: string;
}

const initialTasks: Task[] = [
  {
    id: "1",
    title: "Task 1",
    description: "Description 1",
    status: "todo",
    createdAt: "2024-09-07",
  },
  {
    id: "2",
    title: "Task 2",
    description: "Description 2",
    status: "in progress",
    createdAt: "2024-09-06",
  },
  {
    id: "3",
    title: "Task 3",
    description: "Description 3",
    status: "done",
    createdAt: "2024-09-05",
  },
  {
    id: "4",
    title: "Task 4",
    description: "Description 4",
    status: "todo",
    createdAt: "2024-09-04",
  },
];

export default function HomePage() {
  const [sortType, setSortType] = useState("recent");

  const [tasks, setTasks] = useState<Task[]>(initialTasks);
  const [activeTask, setActiveTask] = useState<Task | null>(null);

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

    // Handling drops over boards
    if (["todo", "in progress", "done"].includes(overId)) {
      if (activeTask && activeTask.status !== overId) {
        setTasks((tasks) =>
          tasks.map((task) =>
            task.id === activeTask.id
              ? { ...task, status: overId as Task["status"] }
              : task
          )
        );
      }
      return;
    }

    // Handling drops over other tasks
    const overTask = tasks.find((task) => task.id === overId);

    if (!activeTask || !overTask) return;

    setTasks((currentTasks) => {
      const activeIndex = currentTasks.findIndex((t) => t.id === active.id);
      const overIndex = currentTasks.findIndex((t) => t.id === overId);

      if (activeTask.status !== overTask.status) {
        // Move to a different board
        const newTasks = currentTasks.map((t) =>
          t.id === activeTask.id ? { ...t, status: overTask.status } : t
        );
        return arrayMove(newTasks, activeIndex, overIndex);
      }

      // Reorder within the same board
      return arrayMove(currentTasks, activeIndex, overIndex);
    });
  };

  const handleDragEnd = (event: DragEndEvent) => {
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
          <Button className="w-full md:w-40">Add Task</Button>
        </div>
        <div className="w-full flex flex-col md:flex-row justify-between shadow-md rounded-md gap-y-4 p-4 border border-muted">
          <div className="w-2/3 md:w-2/5 flex justify-center items-center gap-2">
            <p>Search:</p>
            <Input type="text" placeholder="Search..." />
          </div>
          <div className="w-1/2 md:w-1/5 flex justify-center items-center gap-2">
            <p className="whitespace-nowrap">Sort By:</p>
            <Select onValueChange={changeSortType}>
              <SelectTrigger>
                <SelectValue placeholder="Select" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="recent">Recent</SelectItem>
                <SelectItem value="dark">Dark</SelectItem>
                <SelectItem value="system">System</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        <div className="grid md:grid-cols-3 gap-y-6 md:gap-x-6">
          <SortableContext items={todoTasks.map((t) => t.id)}>
            <Board id="todo" containerType="TODO" tasks={todoTasks} />
          </SortableContext>
          <SortableContext items={inProgressTasks.map((t) => t.id)}>
            <Board
              id="in progress"
              containerType="IN PROGRESS"
              tasks={inProgressTasks}
            />
          </SortableContext>
          <SortableContext items={doneTasks.map((t) => t.id)}>
            <Board id="done" containerType="DONE" tasks={doneTasks} />
          </SortableContext>
        </div>
      </div>
      <DragOverlay>
        {activeTask ? <TaskCard {...activeTask} isDragging={true} /> : null}
      </DragOverlay>
    </DndContext>
  );
}
