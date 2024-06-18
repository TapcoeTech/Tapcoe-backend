import mongoose from "mongoose";
import dotenv from 'dotenv'
dotenv.config()
console.log(process.env.MONGO_URI)
export const connectDatabase = () => {
    
  mongoose
    .connect(process.env.MONGO_URI)
    .then((c) => {
      
      console.log(`Mongodb connect to: ${c.connection.host}`);
    })
    .catch((e) => {
   
      console.log(e);
    });
};