import {
  registerUser,
  loginUser,
  currentUser,
  googleLogin,
} from "../../src/controllers/userController";
import { User } from "../../src/models/userModel";
import { Auth } from "../../src/models/authModel";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { OAuth2Client } from "google-auth-library";

// Mock dependencies
jest.mock("../../src/models/userModel");
jest.mock("../../src/models/authModel");
jest.mock("bcrypt");
jest.mock("jsonwebtoken");
jest.mock("google-auth-library", () => {
  return {
    OAuth2Client: jest.fn(() => ({
      verifyIdToken: jest.fn(),
    })),
  };
});

describe("User Controller", () => {
  let req: any;
  let res: any;
  let next: any;
  let mockOAuth2Client: any;

  beforeEach(() => {
    req = { body: {}, params: {}, user: {} };
    res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
    next = jest.fn();

    // Initialize mocked OAuth2Client
    mockOAuth2Client = new OAuth2Client();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe("registerUser", () => {
    it("should throw error if required fields are missing", async () => {
      req.body = { firstName: "", email: "", password: "" };
      await registerUser(req, res, next);
      expect(res.status).toHaveBeenCalledWith(400);
      expect(next).toHaveBeenCalledWith(
        new Error("Please fill all the fields")
      );
    });

    it("should throw error if user already exists", async () => {
      (User.findOne as jest.Mock).mockResolvedValue({
        email: "test@example.com",
      });
      req.body = {
        firstName: "Test",
        email: "test@example.com",
        password: "password",
      };
      await registerUser(req, res, next);
      expect(res.status).toHaveBeenCalledWith(400);
      expect(next).toHaveBeenCalledWith(
        new Error("User with same email already exists")
      );
    });

    it("should register a new user and return success", async () => {
      (User.findOne as jest.Mock).mockResolvedValue(null);
      (User.create as jest.Mock).mockResolvedValue({ id: "user-id" });
      (Auth.create as jest.Mock).mockResolvedValue({});

      req.body = {
        firstName: "Test",
        email: "test@example.com",
        password: "password",
      };
      await registerUser(req, res, next);
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith({
        message: "User registered successfully",
      });
    });
  });

  describe("loginUser", () => {
    it("should throw error if email or password is missing", async () => {
      req.body = { email: "", password: "" };
      await loginUser(req, res, next);
      expect(res.status).toHaveBeenCalledWith(400);
      expect(next).toHaveBeenCalledWith(
        new Error("Please fill all the fields")
      );
    });

    it("should throw error if auth is not found", async () => {
      (User.findOne as jest.Mock).mockResolvedValueOnce({ id: "userId" });
      (Auth.findOne as jest.Mock).mockResolvedValueOnce(null);
      req.body = { email: "test@example.com", password: "password" };
      await loginUser(req, res, next);
      expect(next).toHaveBeenCalledWith(
        new Error("Use Signin By Google Option")
      );
    });

    it("should return accessToken if login is successful", async () => {
      (User.findOne as jest.Mock).mockResolvedValue({
        id: "user-id",
        email: "test@example.com",
      });
      (Auth.findOne as jest.Mock).mockResolvedValue({
        password: "hashedPassword",
      });
      (bcrypt.compare as jest.Mock).mockResolvedValue(true);
      (jwt.sign as jest.Mock).mockReturnValue("accessToken");

      req.body = { email: "test@example.com", password: "password" };
      await loginUser(req, res, next);
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({ accessToken: "accessToken" });
    });
  });

  describe("currentUser", () => {
    it("should throw error if user is not found", async () => {
      (User.findById as jest.Mock).mockResolvedValue(null);
      req.user = { id: "user-id" };
      await currentUser(req, res, next);
      expect(next).toHaveBeenCalledWith(new Error("User not found"));
    });

    it("should return user data if user is found", async () => {
      (User.findById as jest.Mock).mockResolvedValue({
        id: "user-id",
        email: "test@example.com",
      });
      req.user = { id: "user-id" };
      await currentUser(req, res, next);
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        id: "user-id",
        email: "test@example.com",
      });
    });
  });
});
