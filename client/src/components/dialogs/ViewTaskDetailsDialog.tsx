// React Imports
import { Dispatch, SetStateAction, useEffect, useState } from "react";

// ShadCN Imports
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../ui/dialog";

// Axios Imports
import axiosInstance from "@/config/axiosInstance";
import { AxiosError } from "axios";

// Type Imports
import { Task } from "@/interfaces/taskBoard";
import ApiErrorResponse from "@/interfaces/axiosError";

// Toast Imports
import { toast } from "sonner";

export default function ViewTaskDetailsDialog({
  taskId,
  open,
  setOpen,
}: {
  taskId: string;
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
}) {
  const [task, setTask] = useState<Task>();

  useEffect(() => {
    axiosInstance
      .get(`/tasks/${taskId}`)
      .then((response) => setTask(response?.data))
      .catch((error: AxiosError<ApiErrorResponse>) => {
        if (error?.response?.status !== 500) {
          toast.error(error?.response?.data?.message);
        } else {
          toast.error("Error! Something Went Wrong!");
        }
      });
  }, [taskId]);
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="font-bold">Task Details</DialogTitle>
        </DialogHeader>
        <div className="flex flex-col gap-3">
          <div>
            <h4 className="font-semibold text-lg">Title: {task?.title}</h4>
          </div>
          <div className="flex flex-col gap-2">
            <h4 className="text-base">Description: {task?.description}</h4>
            <h4 className="text-muted-foreground text-xs">
              Created at:{" "}
              {new Date(task?.createdAt!).toLocaleString("en-GB", {
                day: "2-digit",
                month: "2-digit",
                year: "numeric",
                hour: "2-digit",
                minute: "2-digit",
                hour12: false, // For 24-hour format
              })}
            </h4>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
