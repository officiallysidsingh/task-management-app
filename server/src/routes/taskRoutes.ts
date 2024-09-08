// Express Imports
import express from "express";

// Controller Imports
import { getTasks } from "../controllers/taskController";

// Middleware Imports
import validateToken from "../middleware/validateTokenHandler";

// Create router
export const router = express.Router();

// Auth Middleware
router.use(validateToken);

router.route("/").get(getTasks);
