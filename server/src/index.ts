// Express Imports
import express from "express";

// Type Imports
import type { Express, Request, Response } from "express";

// Config Imports
import dotenv from "dotenv";
import { connectDB } from "./config/dbConnection";

// Middleware Imports
import cors from "cors";
import { errorHandler } from "./middleware/errorHandler";

// Router Imports
import { router as userRouter } from "./routes/userRoutes";
import { router as taskRouter } from "./routes/taskRoutes";

// Load environment variables
dotenv.config();

// Connect to MongoDB
connectDB();

// Define express app
const app: Express = express();

// Get PORT Variable from env
const PORT = process.env.PORT || 8000;

// Middlewares
app.use(cors());
app.use(express.json());

// Routes
// Health Check Route
app.get("/", (req: Request, res: Response) => {
  res.json({ message: "Hello, World!" });
});

// User Route
app.use("/api/user", userRouter);

// CRUD Routes for Tasks
app.use("/api/tasks", taskRouter);

// Error Handling
app.use(errorHandler);

// Start the server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
