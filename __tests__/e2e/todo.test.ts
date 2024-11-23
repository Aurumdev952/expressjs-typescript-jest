import { MongoDBContainer } from "@testcontainers/mongodb";
import "jest";
import mongoose from "mongoose";
import request from "supertest";
import app from "../../src/app";
import { CreateTodo } from "../../src/types/todo";

describe("Todo API Endpoints", () => {
  let mongodbContainer: any;
  let todoId: string;

  beforeAll(async () => {
    mongodbContainer = await new MongoDBContainer().start();
    await mongoose.connect(mongodbContainer.getConnectionString(), {
      directConnection: true,
    });
    console.log("Connected to MongoDB");
  });

  afterAll(async () => {
    await mongoose.connection.close();
    await mongoose.disconnect();
    await mongodbContainer?.stop();
  });

  const newTodo: CreateTodo = {
    completed: false,
    dueDate: "2023-01-03",
    description: "test description",
    title: "test title",
  };

  it("should create a new todo", async () => {
    const response = await request(app)
      .post("/api")
      .set("Accept", "application/json")
      .send(newTodo);

    expect(response.status).toBe(200);
    expect(response.headers["content-type"]).toMatch(/json/);
    expect(response.body).toHaveProperty("_id");

    todoId = response.body._id;

    expect(response.body.title).toBe(newTodo.title);
    expect(response.body.completed).toBe(newTodo.completed);
    expect(response.body.description).toBe(newTodo.description);
  });

  it("should get the todo", async () => {
    expect(todoId).toBeDefined();

    const response = await request(app).get(`/api/${todoId}`);

    expect(response.status).toBe(200);
    expect(response.body.title).toBe(newTodo.title);
  });

  it("should get all todos", async () => {
    const response = await request(app)
      .get("/api")
      .set("Accept", "application/json");

    expect(response.status).toBe(200);
    expect(response.headers["content-type"]).toMatch(/json/);
    expect(Array.isArray(response.body)).toBeTruthy();
    expect(response.body.length).toBe(1);
    expect(response.body[0]._id).toBe(todoId);
  });

  it("should update a todo", async () => {
    expect(todoId).toBeDefined();

    const updatedTitle = "test title updated";
    const response = await request(app).put(`/api/${todoId}`).send({
      title: updatedTitle,
    });

    expect(response.status).toBe(200);
    expect(response.body.title).toBe(updatedTitle);
  });

  it("should delete a todo", async () => {
    expect(todoId).toBeDefined();

    const deleteResponse = await request(app).delete(`/api/${todoId}`);
    expect(deleteResponse.status).toBe(200);

    const checkResponse = await request(app).get(`/api/${todoId}`);
    expect(checkResponse.status).toBe(404);
  });
});
