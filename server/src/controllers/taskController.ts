// Type Imports
import type { Response } from "express";
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
