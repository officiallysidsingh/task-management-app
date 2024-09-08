// Express Imports
import express from "express";

// Controller Imports
import {
  registerUser,
  loginUser,
  currentUser,
} from "../controllers/userController";

// Middleware Imports
import { validateToken } from "../middleware/validateTokenHandler";

// Create router
export const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.get("/current", validateToken, currentUser);
