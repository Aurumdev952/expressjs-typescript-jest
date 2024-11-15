import { Router } from "express";
import expressAsyncHandler from "express-async-handler";
import {
  createTodoHandler,
  deleteTodoHandler,
  getTodoHandler,
  getTodosHandler,
  updateTodoHandler,
} from "../controllers/todo.controller";

const router: Router = Router();

router.get("/:id", expressAsyncHandler(getTodoHandler));
router.get("/", expressAsyncHandler(getTodosHandler));
router.post("/", expressAsyncHandler(createTodoHandler));
router.put("/:id", expressAsyncHandler(updateTodoHandler));
router.delete("/:id", expressAsyncHandler(deleteTodoHandler));

export default router;
