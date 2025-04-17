import dotenv from "dotenv";

dotenv.config();

export default {
  PORT: process.env.PORT,
  MONGO_URL: process.env.MONGO_URL,
  JWT_KEY: process.env.JWT_KEY,
  SECRET_KEY: process.env.SECRET_KEY
};