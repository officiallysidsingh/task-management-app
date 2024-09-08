// React Imports
import { Dispatch, SetStateAction, useEffect, useState } from "react";

// ShadCN Imports
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "../ui/alert-dialog";

// Type Imports
import { Task } from "@/interfaces/taskBoard";
import ApiErrorResponse from "@/interfaces/axiosError";

// Axios Imports
import axiosInstance from "@/config/axiosInstance";
import { AxiosError } from "axios";

// Toast Imports
import { toast } from "sonner";

export default function DeleteTaskDialog({
  taskId,
  open,
  setOpen,
  setTasks,
}: {
  taskId: string;
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
  setTasks: Dispatch<SetStateAction<Task[]>>;
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

  const handleDeleteTask = () => {
    axiosInstance
      .delete(`/tasks/${taskId}`)
      .then(() => {
        toast.success("Task deleted successfully!");

        // Refetch tasks
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
      })
      .catch((error: AxiosError<ApiErrorResponse>) => {
        if (error?.response?.status !== 500) {
          toast.error(error?.response?.data?.message);
        } else {
          toast.error("Error! Something Went Wrong!");
        }
      });
  };

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>
            Are you absolutely sure you want to delete this task?
          </AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone.
            <br />
            This will permanently delete your task. "{task?.title}"
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={handleDeleteTask}>
            Continue
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
