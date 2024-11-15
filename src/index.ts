import { config } from "dotenv";
import mongoose from "mongoose";
import app from "./app";
config();
const PORT = process.env.PORT || 3000;
const MONGODB_URI = process.env.MONGODB_URI;
app.listen(3000, () => {
  mongoose
    .connect(MONGODB_URI || "mongodb://localhost:27017/test-todo")
    .then(() => {
      console.log("Connected to MongoDB");
    })
    .catch((err) => {
      console.error("Error connecting to MongoDB:", err);
      process.exit(1);
    });
  console.log("Server is running on port 3000");
});
