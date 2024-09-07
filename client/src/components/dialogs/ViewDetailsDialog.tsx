// React Imports
import { Dispatch, SetStateAction } from "react";

// ShadCN Imports
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../ui/dialog";

export default function ViewDetailsDialog({
  taskId,
  open,
  setOpen,
}: {
  taskId: string;
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
}) {
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="font-bold">Task Details</DialogTitle>
        </DialogHeader>
        <div className="flex flex-col gap-3">
          <div>
            <h4 className="font-semibold text-lg">
              Title: Task 6
              {/* TODO
            {task.title} */}
            </h4>
          </div>
          <div className="flex flex-col gap-2">
            <h4 className="text-base">
              Description: Description 6{/* {task.description} */}
            </h4>
            <h4 className="text-muted-foreground text-xs">
              Created at: 2024-09-04
              {/* {new Date(task.createdAt).toLocaleString()} */}
            </h4>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
