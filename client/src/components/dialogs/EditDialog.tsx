// React Imports
import { Dispatch, SetStateAction } from "react";

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

const editTaskSchema = z.object({
  title: z
    .string()
    .min(1, { message: "Please don't leave the title blank" })
    .max(20, { message: "Title should be of max 20 character" }),
  description: z.string(),
});

export default function EditDialog({
  taskId,
  open,
  setOpen,
}: {
  taskId: string;
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
}) {
  const editTaskForm = useForm<z.infer<typeof editTaskSchema>>({
    resolver: zodResolver(editTaskSchema),
    defaultValues: {
      title: "Task 6", // {task.title}
      description: "Description 6", // {task.description}
    },
  });

  // TODO:
  function editTask(values: z.infer<typeof editTaskSchema>) {
    console.log(values);

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
