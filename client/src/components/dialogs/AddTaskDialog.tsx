// React Imports
import { Dispatch, SetStateAction } from "react";

// Zod Imports
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

// React Hook Form Imports
import { useForm } from "react-hook-form";
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
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { Button } from "../ui/button";

const addTaskSchema = z.object({
  title: z
    .string()
    .min(1, { message: "Please don't leave the title blank" })
    .max(20, { message: "Title should be of max 20 character" }),
  description: z.string(),
});

export default function AddTaskDialog({
  open,
  setOpen,
}: {
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
}) {
  const addTaskForm = useForm<z.infer<typeof addTaskSchema>>({
    resolver: zodResolver(addTaskSchema),
    defaultValues: {
      title: "", // {task.title}
      description: "", // {task.description}
    },
  });

  // TODO:
  function addTask(values: z.infer<typeof addTaskSchema>) {
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
          <Form {...addTaskForm}>
            <form onSubmit={addTaskForm.handleSubmit(addTask)}>
              <div className="flex flex-col gap-2">
                <Label className="text-sm text-muted-foreground">Title</Label>
                <FormField
                  control={addTaskForm.control}
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
                  control={addTaskForm.control}
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
                  <Button type="submit">Add</Button>
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
