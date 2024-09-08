// Express Imports
import express from "express";

// Controller Imports
import { getTasks, getTask } from "../controllers/taskController";

// Middleware Imports
import validateToken from "../middleware/validateTokenHandler";

// Create router
export const router = express.Router();

// Auth Middleware
router.use(validateToken);

router.route("/").get(getTasks);

router.route("/:id").get(getTask);
