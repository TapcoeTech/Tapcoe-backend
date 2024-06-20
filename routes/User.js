import express from "express";
import { hostEvent } from "../controller/User.js";
import {  isAuthenticated } from "../middleware/auth.js";



export const userRouter = express.Router();
userRouter.route("/hostEvent").post(isAuthenticated,hostEvent);
// userRouter.route("/saveEventReq").post(saveEventRequest);