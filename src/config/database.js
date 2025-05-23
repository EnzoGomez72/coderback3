import mongoose from "mongoose";
import config from "./env.js";

export default async function connectDb() {
  try {
    await mongoose.connect(config.mongodb_url);
    console.log("✅ Database is connected");
  } catch (error) {
    console.error(`❌ Error: ${error.message}`);
    process.exit(1); 
  }
}
