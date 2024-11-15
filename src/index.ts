import mongoose from "mongoose";
import app from "./app";

app.listen(3000, () => {
  mongoose
    .connect("mongodb://localhost:27017/test-todo")
    .then(() => {
      console.log("Connected to MongoDB");
    })
    .catch((err) => {
      console.error("Error connecting to MongoDB:", err);
      process.exit(1);
    });
  console.log("Server is running on port 3000");
});
