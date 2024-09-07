import express from "express";
import type{ Request, Response } from "express";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 8000;

app.get('/', (req: Request, res: Response) => {
  res.json({message: "Hello, World!"});
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});