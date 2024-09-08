// Type Imports
import type { NextFunction, Request, Response } from "express";
import { AuthRequest } from "../types/authRequest";

// Schema Imports
import { User } from "../models/userModel";

// Package Imports
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"

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

// Login a user
// POST /api/user/login
// Public access
export const loginUser = async(req: Request, res: Response, next: NextFunction) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      res.status(400);
      throw new Error("Please fill all the fields");
    }

    //Identify if user present in db
    const user = await User.findOne({ email });

    //compare password with hashed password
    if (user && (await bcrypt.compare(password, user.password))) {
      const accessToken = jwt.sign(
        {
          user: {
            email: user.email,
            id: user.id,
          },
        },
        process.env.ACCESS_TOKEN_SECRET!,
        { expiresIn: "15m" }
      );
      res.status(200).json({ accessToken });
    } else {
      res.status(401);
      throw new Error("Invalid email or password");
    }
  } catch (error) {
    next(error)
  }
}

// Current user information
// GET /api/users/current
// private
export const currentUser = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const user = await User.findById(req?.user?.id, { password: 0, updatedAt: 0 })

    if (!user) {
      res.status(404)
      throw new Error("User not found")
    }
    res.status(200).json(user);
  } catch (error) {
    next(error)
  }
};