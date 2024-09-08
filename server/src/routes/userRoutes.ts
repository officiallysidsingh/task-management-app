// Express Imports
import express from "express";

// Controller Imports
import {
  registerUser,
  loginUser,
  currentUser,
  googleLogin,
} from "../controllers/userController";

// Middleware Imports
import { validateToken } from "../middleware/validateTokenHandler";

// Create router
export const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.post("/login/google", googleLogin);
router.get("/current", validateToken, currentUser);
