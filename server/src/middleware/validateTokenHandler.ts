// Type Imports
import { NextFunction, Request, Response } from "express";
import type { JwtPayload } from "jsonwebtoken";
import { AuthRequest } from "../types/authRequest";

// JWT Imports
import jwt from "jsonwebtoken";

export const validateToken = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  let token;
  let authHeader = req.headers["x-access-token"] || req.headers.authorization;

  try {
    if (
      authHeader &&
      typeof authHeader === "string" &&
      authHeader.startsWith("Bearer")
    ) {
      // Get the auth token
      token = authHeader.split(" ")[1];

      // Verify the auth token
      jwt.verify(token, process.env.ACCESS_TOKEN_SECRET!, (err, decoded) => {
        if (err || !decoded) {
          res.status(401);
          throw new Error("Unauthorized User");
        }
        req.user = (decoded as JwtPayload).user;
        next();
      });
      if (!token) {
        res.status(401);
        throw new Error("Unauthorized User");
      }
    } else {
      res.status(401);
      throw new Error("Unauthorized User");
    }
  } catch (error) {
    next(error);
  }
};

export default validateToken;
