import { Request, Response } from "express";
import {
  createTodo,
  deleteTodo,
  getTodo,
  getTodos,
  updateTodo,
} from "../service/todo.service";
import { CreateTodo, UpdateTodo } from "../types/todo";

export const getTodoHandler = async (req: Request, res: Response) => {
  const id = req.params.id;
  const data = await getTodo(id);
  res.status(200).json(data);
};
export const createTodoHandler = async (req: Request, res: Response) => {
  const body = req.body as CreateTodo;
  const data = await createTodo(body);
  res.status(200).json(data);
};
export const deleteTodoHandler = async (req: Request, res: Response) => {
  const id = req.params.id;
  const data = await deleteTodo(id);
  res.status(200).json(data);
};
export const updateTodoHandler = async (req: Request, res: Response) => {
  const id = req.params.id;
  const body = req.body as UpdateTodo;
  const data = await updateTodo(id, body);
  res.status(200).json(data);
};
export const getTodosHandler = async (req: Request, res: Response) => {
  const data = await getTodos();
  res.status(200).json(data);
};
