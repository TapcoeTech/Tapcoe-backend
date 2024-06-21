import express from "express";
import { addParticipantWithImageUrl, hostEvent, likeEvent, liveEvent } from "../controller/User.js";
import {  isAuthenticated } from "../middleware/auth.js";



export const userRouter = express.Router();
userRouter.route("/hostEvent").post(isAuthenticated,hostEvent);
userRouter.route("/addParticipant").post(addParticipantWithImageUrl);
userRouter.route("/liveEvent").post(liveEvent);
userRouter.route("/likeEvent").post(likeEvent)