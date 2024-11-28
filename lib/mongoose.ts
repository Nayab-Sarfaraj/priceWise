import mongoose from "mongoose";

let isConnected = false;

export const connectToDB = async () => {
  mongoose.set("strictQuery", true);

  if (!process.env.MONGODB_URI) {
    return console.log("mongodb uri not found");
  }

  if (isConnected)
    return console.log("using the already established connection");
  try {
    console.log(process.env.MONGODB_URI);
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("connected to database ");
    isConnected = true;
  } catch (error) {
    console.log("error while connecting to mongodb");
    console.log(error);
  }
};
