// Express Imports
import express from "express";

// Controller Imports
import {
  getTasks,
  getTask,
  addTask,
  updateTask,
} from "../controllers/taskController";

// Middleware Imports
import validateToken from "../middleware/validateTokenHandler";

// Create router
export const router = express.Router();

// Auth Middleware
router.use(validateToken);

router.route("/").get(getTasks).post(addTask);

router.route("/:id").get(getTask).put(updateTask);
