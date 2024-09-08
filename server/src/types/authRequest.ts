import { Request } from "express";

export interface AuthRequest extends Request {
  user?: { [key: string]: User };
}

interface User {
  id: string;
  email: string;
}
