// React Imports
import { Dispatch, SetStateAction, useEffect } from "react";

// Zod Imports
import { z } from "zod";

// ShadCN Imports
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "../ui/alert-dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "../ui/form";
import { Input } from "../ui/input";
import { Button } from "../ui/button";

// React Hook Form Imports
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Label } from "../ui/label";

// Type Imports
import { Task } from "@/interfaces/taskBoard";
import axiosInstance from "@/config/axiosInstance";

// Axios Imports
import ApiErrorResponse from "@/interfaces/axiosError";
import { AxiosError } from "axios";

// Toast Imports
import { toast } from "sonner";

const editTaskSchema = z.object({
  title: z
    .string()
    .min(1, { message: "Please don't leave the title blank" })
    .max(20, { message: "Title should be of max 20 character" }),
  description: z.string(),
});

export default function EditTaskDialog({
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
  const editTaskForm = useForm<z.infer<typeof editTaskSchema>>({
    resolver: zodResolver(editTaskSchema),
    defaultValues: {
      title: "",
      description: "",
    },
  });

  const { reset } = editTaskForm;

  useEffect(() => {
    axiosInstance
      .get(`/tasks/${taskId}`)
      .then((response) =>
        reset({
          title: response?.data?.title || "",
          description: response?.data?.description || "",
        })
      )
      .catch((error: AxiosError<ApiErrorResponse>) => {
        if (error?.response?.status !== 500) {
          toast.error(error?.response?.data?.message);
        } else {
          toast.error("Error! Something Went Wrong!");
        }
      });
  }, [taskId]);

  // TODO:
  function editTask(values: z.infer<typeof editTaskSchema>) {
    axiosInstance
      .put(`/tasks/${taskId}`, values)
      .then((response) => {
        // Toast
        toast.success("Task edited successfully!");

        reset({
          title: "",
          description: "",
        });

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

    // Close the dialog box
    setOpen(false);
  }

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogContent className="sm:max-w-[425px]">
        <AlertDialogHeader>
          <AlertDialogTitle className="font-bold">Edit Task</AlertDialogTitle>
        </AlertDialogHeader>
        <div className="flex flex-col gap-3">
          <Form {...editTaskForm}>
            <form onSubmit={editTaskForm.handleSubmit(editTask)}>
              <div className="flex flex-col gap-2">
                <Label className="text-sm text-muted-foreground">Title</Label>
                <FormField
                  control={editTaskForm.control}
                  name="title"
                  render={({ field }) => (
                    <FormItem className="w-full">
                      <FormControl>
                        <Input placeholder="Title" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <Label className="text-sm text-muted-foreground">
                  Description
                </Label>
                <FormField
                  control={editTaskForm.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem className="w-full">
                      <FormControl>
                        <Input placeholder="Description" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <AlertDialogFooter className="gap-y-4">
                  <Button type="submit">Save</Button>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                </AlertDialogFooter>
              </div>
            </form>
          </Form>
        </div>
      </AlertDialogContent>
    </AlertDialog>
  );
}
