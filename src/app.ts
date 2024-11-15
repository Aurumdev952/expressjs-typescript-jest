import express from "express";
import createHttpError from "http-errors";
import morgan from "morgan";
import router from "./routes/todo.routes";

const app: express.Application = express();

app.use(express.json());
app.use(morgan("dev"));

app.use("/api", router);
app.all("*", async (req, res, next) => {
  next(createHttpError.NotFound("Route not found"));
});

app.use((err, req, res, next) => {
  res
    .status(err?.status ?? 500)
    .json({ message: err?.message, stack: err.stack });
});

export default app;
