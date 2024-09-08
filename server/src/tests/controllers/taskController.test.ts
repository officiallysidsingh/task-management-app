import {
  getTasks,
  getTask,
  addTask,
  updateTask,
  deleteTask,
} from "../../controllers/taskController";
import { Task } from "../../models/taskModel";

// Mock the Task model
jest.mock("../../models/taskModel");

describe("Task Controllers", () => {
  let req: any, res: any, next: any;

  beforeEach(() => {
    req = {};
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    next = jest.fn();
  });

  describe("getTasks", () => {
    beforeEach(() => {
      req.user = { id: "mockUserId" };
    });

    it("should return tasks for the authenticated user", async () => {
      const mockTasks = [
        { title: "Test Task", description: "Test Description" },
      ];
      (Task.find as jest.Mock).mockResolvedValue(mockTasks);

      await getTasks(req, res);

      expect(Task.find).toHaveBeenCalledWith(
        { user_id: "mockUserId" },
        expect.any(Object)
      );
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(mockTasks);
    });
  });

  describe("getTask", () => {
    beforeEach(() => {
      req.params = { id: "mockTaskId" };
    });

    it("should return a task when it exists", async () => {
      const mockTask = { title: "Test Task", description: "Test Description" };
      (Task.findById as jest.Mock).mockResolvedValue(mockTask);

      await getTask(req, res, next);

      expect(Task.findById).toHaveBeenCalledWith("mockTaskId");
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(mockTask);
    });

    it("should call next with an error if task is not found", async () => {
      (Task.findById as jest.Mock).mockResolvedValue(null);

      await getTask(req, res, next);

      expect(Task.findById).toHaveBeenCalledWith("mockTaskId");
      expect(res.status).toHaveBeenCalledWith(404);
      expect(next).toHaveBeenCalledWith(expect.any(Error));
    });
  });

  describe("addTask", () => {
    beforeEach(() => {
      req.user = { id: "mockUserId" };
      req.body = { title: "Test Task", description: "Test Description" };
    });

    it("should create and return a new task", async () => {
      const mockTask = { title: "Test Task", description: "Test Description" };
      (Task.create as jest.Mock).mockResolvedValue(mockTask);

      await addTask(req, res, next);

      expect(Task.create).toHaveBeenCalledWith({
        title: "Test Task",
        description: "Test Description",
        status: "todo",
        user_id: "mockUserId",
      });
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith(mockTask);
    });

    it("should throw an error if title is missing", async () => {
      req.body.title = "";
      await addTask(req, res, next);

      expect(res.status).toHaveBeenCalledWith(401);
      expect(next).toHaveBeenCalledWith(expect.any(Error));
    });
  });

  describe("updateTask", () => {
    beforeEach(() => {
      req.params = { id: "mockTaskId" };
      req.body = { title: "Updated Task" };
      req.user = { id: "mockUserId" };
    });

    it("should update and return the task if it exists and belongs to the user", async () => {
      const mockTask = {
        _id: "mockTaskId",
        user_id: "mockUserId",
        title: "Old Task",
      };
      (Task.findById as jest.Mock).mockResolvedValue(mockTask);
      (Task.findByIdAndUpdate as jest.Mock).mockResolvedValue({
        _id: "mockTaskId",
        title: "Updated Task",
      });

      await updateTask(req, res, next);

      expect(Task.findById).toHaveBeenCalledWith("mockTaskId");
      expect(Task.findByIdAndUpdate).toHaveBeenCalledWith(
        "mockTaskId",
        req.body
      );
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        _id: "mockTaskId",
        title: "Updated Task",
      });
    });

    it("should return 403 if the task belongs to another user", async () => {
      const mockTask = { _id: "mockTaskId", user_id: "differentUserId" };
      (Task.findById as jest.Mock).mockResolvedValue(mockTask);

      await updateTask(req, res, next);

      expect(res.status).toHaveBeenCalledWith(403);
      expect(next).toHaveBeenCalledWith(expect.any(Error));
    });
  });

  describe("deleteTask", () => {
    beforeEach(() => {
      req.params = { id: "mockTaskId" };
      req.user = { id: "mockUserId" };
    });

    it("should delete the task if it exists and belongs to the user", async () => {
      const mockTask = { _id: "mockTaskId", user_id: "mockUserId" };
      (Task.findById as jest.Mock).mockResolvedValue(mockTask);
      (Task.findByIdAndDelete as jest.Mock).mockResolvedValue(mockTask);

      await deleteTask(req, res, next);

      expect(Task.findById).toHaveBeenCalledWith("mockTaskId");
      expect(Task.findByIdAndDelete).toHaveBeenCalledWith("mockTaskId");
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        message: "Task deleted successfully!",
      });
    });

    it("should return 403 if the task belongs to another user", async () => {
      const mockTask = { _id: "mockTaskId", user_id: "differentUserId" };
      (Task.findById as jest.Mock).mockResolvedValue(mockTask);

      await deleteTask(req, res, next);

      expect(res.status).toHaveBeenCalledWith(403);
      expect(next).toHaveBeenCalledWith(expect.any(Error));
    });
  });
});
