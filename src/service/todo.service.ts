import createHttpError from "http-errors";
import todoModel from "../models/todo";
import { CreateTodo, UpdateTodo } from "../types/todo";

export const getTodo = async (id: string) => {
  const todo = await todoModel.findById(id);
  if (!todo) {
    throw createHttpError.NotFound("Todo not found");
  }
  return todo;
};
export const getTodos = async () => {
  const todo = await todoModel.find();
  return todo;
};
export const createTodo = async (data: CreateTodo) => {
  const todo = await todoModel.create({
    ...data,
    dueDate: new Date(data.dueDate),
  });
  return todo;
};
export const updateTodo = async (id: string, data: UpdateTodo) => {
  let updatedTodo = data.dueDate
    ? { ...data, dueDate: new Date(data.dueDate) }
    : data;
  const todo = await todoModel.findByIdAndUpdate(id, updatedTodo, {
    new: true,
  });
  if (!todo) {
    throw createHttpError.NotFound("Todo not found");
  }
  return todo;
};
export const deleteTodo = async (id: string) => {
  const todo = await todoModel.findById(id);
  if (!todo) {
    throw createHttpError.NotFound("Todo not found");
  }
  await todo.deleteOne();
  return todo;
};
