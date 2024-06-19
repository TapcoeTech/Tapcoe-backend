import express from "express";
import { hostEvent, saveEventRequest } from "../controller/User.js";
import {  isAuthenticated } from "../middleware/auth.js";



export const userRouter = express.Router();
userRouter.route("/hostEvent").post(hostEvent);
userRouter.route("/saveEventReq").post(isAuthenticated,saveEventRequest);