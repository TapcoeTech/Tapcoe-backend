import express from "express";
import { addParticipantWithImageUrl, getAllEventNames, getAllEvents, getAllParticipants, getEventById, getParticipantsById, getSortedParticipants, hostEvent, likeEvent, liveEvent } from "../controller/User.js";
import {  isAuthenticated } from "../middleware/auth.js";



export const userRouter = express.Router();


import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import dotenv from 'dotenv';
import multer from 'multer';
import { v4 as uuidv4 } from 'uuid';

dotenv.config();

const s3Client = new S3Client({
  endpoint: "https://tapcoetech.blr1.digitaloceanspaces.com",
  forcePathStyle: true,
  region: "us-east-1",
  credentials: {
    accessKeyId: process.env.SPACES_ACCESS_KEY,
    secretAccessKey: process.env.SPACES_SECRET_KEY,
  },
});

const upload = multer({ storage: multer.memoryStorage() });

// Assuming userRouter is properly defined
userRouter.post('/upload', upload.single('image'), async (req, res) => {
  try {
    const file = req.file;
    const { eventName } = req.body;

    if (!file || !eventName) {
      return res.status(400).send("No file or event name provided.");
    }

    // Generate UUID for the file
    const uuid = uuidv4();
    const fileKey = `uploads/${uuid}-${file.originalname}`;

    const params = {
      Bucket: "tapcoetech", // Replace with your space name
      Key: fileKey, // Unique key with UUID and original filename
      Body: file.buffer,
      ACL: "public-read", // or "public-read" if you want the file to be publicly accessible
      Metadata: {
        "x-amz-acl": eventName, // Store event name in metadata
      }
    };

    await s3Client.send(new PutObjectCommand(params));
    
    const imageUrl = `https://tapcoetech.blr1.digitaloceanspaces.com/tapcoetech/${fileKey}`;
    // https://tapcoetech.blr1.digitaloceanspaces.com/tapcoetech/uploads/2c4c14cf-852d-481e-9193-ec5426f5cc57-taplg%20(1).png
    
    // Construct the URL for the uploaded image


    res.status(200).json({
      message: "Successfully uploaded object.",
      key: fileKey,
      uuid: uuid,
      eventName: eventName,
      url: imageUrl // Return the URL
    });
  } catch (err) {
    console.error("Error", err);
    res.status(500).send("Error uploading file.");
  }
});

userRouter.route("/hostEvent").post(isAuthenticated,hostEvent);
userRouter.route("/addParticipant").post(addParticipantWithImageUrl);
userRouter.route("/liveEvent").post(liveEvent);
userRouter.route("/likeEvent").post(isAuthenticated,likeEvent)
userRouter.route('/getallEvent').get(getAllEvents)
userRouter.route('/getEventName').get(getAllEventNames)
userRouter.route('/getAllParticipants').get(getAllParticipants);
userRouter.route('/getParticipantsById').post(getParticipantsById);
userRouter.route('/getEventById').post(getEventById)
userRouter.route('/getLeaderBoard').post(getSortedParticipants)  