// Type Imports
import type { Response, NextFunction } from "express";
import { AuthRequest } from "../types/authRequest";

// Schema Imports
import { Task } from "../models/taskModel";

// Get all tasks
// POST /api/task
// Private access
export const getTasks = async (req: AuthRequest, res: Response) => {
  const tasks = await Task.find({ user_id: req?.user?.id });
  res.status(200).json(tasks);
};

// Get task by id
// POST /api/task/:id
// Private access
export const getTask = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const task = await Task.findById(req.params.id);

    if (!task) {
      res.status(404);
      throw new Error("Task not found!");
    }
    res.status(200).json(task);
  } catch (error) {
    next(error);
  }
};
