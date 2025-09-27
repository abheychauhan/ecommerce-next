import mongoose from "mongoose";

const MONGO_URI = process.env.MONGO_URI;

if (!MONGO_URI) {
  throw new Error("Please define the MONGO_URI environment variable inside .env.local");
}

let isConnected = false;

export async function connectDB() {
  if (isConnected) {
    console.log("=> Using existing database connection");
    return;
  }

  try {
    await mongoose.connect(MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    isConnected = true;
    console.log("=> Connected to database");
  } catch (error) {
    console.error("=> Failed to connect to database");
    console.error(error);
    throw error; // important: propagate error to avoid API hanging
  }
}
