/*import mongoose from "mongoose";
export default async function connectDb(URL) {
  try {
    console.log("Database is connected");
    return await mongoose.connect(URL);
  } catch (error) {
    console.log(`Error ${error.message}`);
  }
}*/

import mongoose from "mongoose";
import config from "./env.js";

export default async function connectDb() {
  try {
    await mongoose.connect(config.mongodb_url);
    console.log("✅ Database is connected");
  } catch (error) {
    console.error(`❌ Error: ${error.message}`);
    process.exit(1); // Salir si no hay conexión a la DB
  }
}
