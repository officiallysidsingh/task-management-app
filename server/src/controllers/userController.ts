// Type Imports
import type { NextFunction, Request, Response } from "express";

// Schema Imports
import { User } from "../models/userModel";

// Package Imports
import bcrypt from "bcrypt"

// Register a user
// POST /api/user/register
// Public access
export const registerUser = async(req: Request, res: Response, next: NextFunction) => {
  try {
    const { firstName, lastName, email, password } = req.body;
    
    // Check if all the required fields exist
    if (!firstName || !email || !password) {
      res.status(400);
      throw new Error("Please fill all the fields")
    }

    // Check if user with same email already exists
    const userExists = await User.findOne({ email });
    if (userExists) {
      res.status(400);
      throw new Error("User with same email already exists");
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user in MongoDB
    const user = await User.create({
      firstName,
      lastName,
      email,
      password: hashedPassword
    });

    if (user) {
      res.status(201).json({ message: "User registered successfully" });
    } else {
      res.status(400);
      throw new Error("Invalid user data")
    }
  } catch (error) {
    next(error)
  }
}