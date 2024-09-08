// Type Imports
import type { NextFunction, Request, Response } from "express";
import { AuthRequest } from "../types/authRequest";

// Schema Imports
import { User } from "../models/userModel";
import { Auth } from "../models/authModel";

// Package Imports
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

// Google Auth Imports
import { OAuth2Client } from "google-auth-library";

// Initialize Google OAuth client
const client = new OAuth2Client(
  process.env.GOOGLE_CLIENT_ID,
  process.env.GOOGLE_CLIENT_SECRET
);

// Register a user
// POST /api/user/register
// Public access
export const registerUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { firstName, lastName, email, password } = req.body;

    // Check if all the required fields exist
    if (!firstName || !email || !password) {
      res.status(400);
      throw new Error("Please fill all the fields");
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
    });

    // Create user in auth collection
    const auth = await Auth.create({
      user_id: user.id,
      password: hashedPassword,
    });

    if (user && auth) {
      res.status(201).json({ message: "User registered successfully" });
    } else {
      res.status(400);
      throw new Error("Invalid user data");
    }
  } catch (error) {
    next(error);
  }
};

// Login a user
// POST /api/user/login
// Public access
export const loginUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      res.status(400);
      throw new Error("Please fill all the fields");
    }

    // Check if user present in db
    const user = await User.findOne({ email });

    if (user) {
      // Check user's auth
      const auth = await Auth.findOne({ user_id: user.id });

      if (!auth) {
        res.status(404);
        throw new Error("Use Signin By Google Option");
      }

      //compare password with hashed password
      if (await bcrypt.compare(password, auth.password)) {
        // Create access token
        const accessToken = jwt.sign(
          {
            user: {
              email: user.email,
              id: user.id,
            },
          },
          process.env.ACCESS_TOKEN_SECRET!,
          { expiresIn: "30m" }
        );
        res.status(200).json({ accessToken });
      } else {
        res.status(401);
        throw new Error("Invalid email or password");
      }
    }
  } catch (error) {
    next(error);
  }
};

// Current user information
// GET /api/users/current
// Private access
export const currentUser = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const user = await User.findById(req?.user?.id, {
      updatedAt: 0,
    });

    if (!user) {
      res.status(404);
      throw new Error("User not found");
    }
    res.status(200).json(user);
  } catch (error) {
    next(error);
  }
};

// Google Login
// POST /api/user/login/google
// Public access
export const googleLogin = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { idToken } = req.body;

    if (!idToken) {
      res.status(400);
      throw new Error("Google ID token is required");
    }

    const ticket = await client.verifyIdToken({
      idToken,
      audience: process.env.GOOGLE_CLIENT_ID,
    });

    const payload = ticket.getPayload();
    if (!payload) {
      res.status(400);
      throw new Error("Invalid Google ID token");
    }

    const { email, given_name: firstName, family_name: lastName } = payload;

    // Check if user exists
    let user = await User.findOne({ email });

    if (!user) {
      user = await User.create({
        firstName,
        lastName,
        email,
      });
    }

    // Generate JWT token
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
  } catch (error) {
    next(error);
  }
};
