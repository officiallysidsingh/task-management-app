// Type Imports
import type { Response, NextFunction } from "express";
import type { AuthRequest } from "../types/authRequest";

// Schema Imports
import { Task } from "../models/taskModel";

// Get all tasks
// GET /api/task
// Private access
export const getTasks = async (req: AuthRequest, res: Response) => {
  const tasks = await Task.find({ user_id: req?.user?.id });
  res.status(200).json(tasks);
};

// Get task by id
// GET /api/task/:id
// Private access
export const getTask = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    // Check if task exists
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

// Add new task
// POST /api/task
// Private access
export const addTask = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    // Check if required fields present
    const { title, description } = req.body;
    if (!title) {
      res.status(401);
      throw new Error("Please enter title");
    }

    // Create new task in MongoDB
    const task = await Task.create({
      title,
      description,
      status: "todo",
      user_id: req?.user?.id,
    });

    if (task) {
      res.status(201).json(task);
    }
  } catch (error) {
    next(error);
  }
};

// Update task
// PUT /api/task/:id
// Private access
export const updateTask = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    // Check if task exists
    const taskExists = await Task.findById(req.params.id);
    if (!taskExists) {
      res.status(404);
      throw new Error("Task not found");
    }

    // Check if task is of same user
    if (taskExists?.user_id.toString() !== req?.user?.id.toString()) {
      res.status(403);
      throw new Error(
        "User doesn't have permission to update other user's tasks!"
      );
    }

    // Update task
    const updatedTask = await Task.findByIdAndUpdate(req.params.id, req.body);

    res.status(200).json(updatedTask);
  } catch (error) {
    next(error);
  }
};
