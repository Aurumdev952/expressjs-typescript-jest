jest.mock("../../src/models/todo", () => ({
  findById: jest.fn(),
  find: jest.fn(),
  create: jest.fn(),
  findByIdAndUpdate: jest.fn(),
  deleteOne: jest.fn(),
}));

import createHttpError from "http-errors";
import todoModel from "../../src/models/todo";
import * as todoService from "../../src/service/todo.service";
describe("getTodo", () => {
  it("should return the todo if found", async () => {
    const mockTodo = { _id: "1", title: "Test Todo" };
    (todoModel.findById as jest.Mock).mockResolvedValue(mockTodo);

    const result = await todoService.getTodo("1");
    expect(todoModel.findById).toHaveBeenCalledWith("1");
    expect(result).toEqual(mockTodo);
  });

  it("should throw NotFound error if todo is not found", async () => {
    (todoModel.findById as jest.Mock).mockResolvedValue(null);

    await expect(todoService.getTodo("1")).rejects.toThrow(
      createHttpError.NotFound("Todo not found")
    );
    expect(todoModel.findById).toHaveBeenCalledWith("1");
  });
});

describe("getTodos", () => {
  it("should return all todos", async () => {
    const mockTodos = [{ _id: "1", title: "Test Todo" }];
    (todoModel.find as jest.Mock).mockResolvedValue(mockTodos);

    const result = await todoService.getTodos();
    expect(todoModel.find).toHaveBeenCalled();
    expect(result).toEqual(mockTodos);
  });
});

describe("createTodo", () => {
  it("should create a new todo", async () => {
    const mockData = {
      completed: false,
      dueDate: "2023-01-03",
      description: "test description",
      title: "test title",
    };
    const mockTodo = { _id: "1", ...mockData, dueDate: new Date("2024-12-31") };

    (todoModel.create as jest.Mock).mockResolvedValue(mockTodo);

    const result = await todoService.createTodo(mockData);
    expect(todoModel.create).toHaveBeenCalledWith({
      ...mockData,
      dueDate: new Date(mockData.dueDate),
    });
    expect(result).toEqual(mockTodo);
  });
});

describe("updateTodo", () => {
  it("should update an existing todo and return it", async () => {
    const mockData = { title: "Updated Todo", dueDate: "2024-12-31" };
    const mockTodo = { _id: "1", ...mockData, dueDate: new Date("2024-12-31") };

    (todoModel.findByIdAndUpdate as jest.Mock).mockResolvedValue(mockTodo);

    const result = await todoService.updateTodo("1", mockData);
    expect(todoModel.findByIdAndUpdate).toHaveBeenCalledWith(
      "1",
      { ...mockData, dueDate: new Date(mockData.dueDate) },
      { new: true }
    );
    expect(result).toEqual(mockTodo);
  });

  it("should throw NotFound error if todo is not found", async () => {
    (todoModel.findByIdAndUpdate as jest.Mock).mockResolvedValue(null);

    await expect(
      todoService.updateTodo("1", { title: "Nonexistent Todo" })
    ).rejects.toThrow(createHttpError.NotFound("Todo not found"));
    expect(todoModel.findByIdAndUpdate).toHaveBeenCalled();
  });
});

describe("deleteTodo", () => {
  it("should delete the todo and return it", async () => {
    const mockTodo = { id: "1", title: "Test Todo", deleteOne: jest.fn() };

    (todoModel.findById as jest.Mock).mockResolvedValue(mockTodo);

    const result = await todoService.deleteTodo("1");
    expect(todoModel.findById).toHaveBeenCalledWith("1");
    expect(mockTodo.deleteOne).toHaveBeenCalled();
    expect(result).toEqual(mockTodo);
  });

  it("should throw NotFound error if todo is not found", async () => {
    (todoModel.findById as jest.Mock).mockResolvedValue(null);

    await expect(todoService.deleteTodo("1")).rejects.toThrow(
      createHttpError.NotFound("Todo not found")
    );
    expect(todoModel.findById).toHaveBeenCalledWith("1");
  });
});
