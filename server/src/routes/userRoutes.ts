// Express Imports
import express from "express";

// Controller Imports
import { registerUser } from "../controllers/userController";


// Create router
export const router = express.Router();

router.post("/register", registerUser);
