import dotenv from "dotenv";
dotenv.config();

export default {
    port: process.env.PORT || 8080,
    mongodb_url: process.env.MONGODB_URL,
    persistence: process.env.PERSISTENCE,
    sign: process.env.SIGN,
    jwt_secret: process.env.JWT_SECRET
  };