export interface Todo {
  _id: string;
  createdAt: Date;
  updatedAt: Date;
  title: string;
  description: string;
  dueDate: Date;
  completed: boolean;
}

export type CreateTodo = Omit<
  Todo,
  "_id" | "createdAt" | "updatedAt" | "dueDate"
> & {
  dueDate: string;
};

export type UpdateTodo = Partial<Omit<Todo, "dueDate"> & { dueDate: string }>;
