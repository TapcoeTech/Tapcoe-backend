import express from "express";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";
import { userRouter } from "./routes/User.js";
import session from "express-session";
import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import cors from 'cors';
import jwt from "jsonwebtoken";
import User from "./models/User.js";
dotenv.config();

export const app = express();
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ extended: true, limit: "50mb" }));
app.use(express.text({ type: "text/html" }));
app.use(cookieParser());

app.use(
    cors({
      origin: '*',
      credentials: true,
    })
  );
  app.use(
    session({
      secret: "ehfbhgbfhgbirheuurwbfiofeufvfvduf", // Change this to a strong and secure secret
      resave: true,
      saveUninitialized: true,
    })
  );
  app.use(passport.initialize());
  app.use(passport.session());
  passport.use(new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: 'https://tapcoe-backend.onrender.com/api/v1/auth/google/callback',
      proxy: true,
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        // Check if the user already exists in the database
        let user = await User.findOne({ email: profile.emails[0].value});
  
        // if(user)
        // {
          
        //     res.redirect(`http://localhost:6100/`);
        
        // }
  
        // If user doesn't exist, create a new user entry
        if (!user) {
          user = new User({
            googleToken: profile.id,
            name: profile.displayName,
            email: profile.emails[0].value,
            profileImg:profile.photos[0].value
          });
         
          await user.save();
          
        }
     
      
  
        // Pass user data to the next middleware
        done(null, user);
      } catch (error) {
        console.error('Error:', error);
        done(error, null);
      }
    }
  ));
  passport.serializeUser((user, done) => {
    done(null, user);
  });
  
  passport.deserializeUser(async (id, done) => {
    try {
      const user = await User.findById(id._id);
      
      done(null, user);
    } catch (error) {
      done(error, null);
    }
  });

  // Google login route
app.get(
    "/api/v1/auth/google",
    passport.authenticate("google", { scope: ["profile", "email"] })
  );
  
  // Google callback route
  app.get(
    "/api/v1/auth/google/callback",
    passport.authenticate("google", { failureRedirect: "/auth/fail" }),
    async (req, res) => {
      try {
        // Check if user exists in the session
        if (req.user) {
          // Generate JWT token
          const token = jwt.sign({ _id: req.user._id }, process.env.JWT_SECRET);
          // Redirect to frontend with token, email, and name
          const redirectURL = `https://tapcoe-2ish.vercel.app/?token=${token}&email=${req.user.email}&name=${req.user.name}&profilePic=${req.user.profileImg}&_id=${req.user._id}`;
          res.redirect(redirectURL);
        } else {
          // User doesn't exist in session
          res.redirect("/auth/fail");
  
        }
      } catch (error) {
        console.error("Error:", error);
        res.redirect("/auth/fail");
      }
    }
  );

  app.use("/api/v1", userRouter);

app.get("*", (req, res) => {
  res.send('Server Running')
});