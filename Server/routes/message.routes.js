import express from "express";
import {
  getAllUsers,
  getMessages,
  sendMessages,
} from "../controllers/message.controller.js";
import { isAuthenticated } from "../middlewares/auth.middleware.js";

const messageRouter = express.Router();

messageRouter.get("/users", isAuthenticated, getAllUsers);
messageRouter.get("/:id", isAuthenticated, getMessages);
messageRouter.post("/send/:id", isAuthenticated, sendMessages);

export default messageRouter;
