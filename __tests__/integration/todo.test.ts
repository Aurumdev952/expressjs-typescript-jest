import { MongoDBContainer } from "@testcontainers/mongodb";
import "jest";
import mongoose from "mongoose";
import request from "supertest";
import app from "../../src/app";
import { CreateTodo } from "../../src/types/todo";

/* Connecting to the database before each test. */
let mongodbContainer;
beforeAll(async () => {
  mongodbContainer = await new MongoDBContainer().start();

  await mongoose
    .connect(mongodbContainer.getConnectionString(), { directConnection: true })
    .then(() => {
      console.log("Connected to MongoDB");
    });
});

/* Closing database connection after each test. */
afterAll(async () => {
  await mongoose.connection.close();
  await mongoose.disconnect();
  mongodbContainer?.stop();
});

// beforeAll(async () => {
//   await todoModel.deleteMany();
// });

describe("GET /api", () => {
  it("responds with an array of todos", async () =>
    request(app)
      .get("/api")
      .set("Accept", "application/json")
      .expect("Content-Type", /json/)
      .expect(200)
      .then((response) => {
        expect(response.body).toHaveProperty("length");
        expect(response.body.length).toBe(0);
      }));
});
let id = "";
describe("POST /api", () => {
  const newTodo: CreateTodo = {
    completed: false,
    dueDate: "2023-01-03",
    description: "test description",
    title: "test title",
  };
  it("responds with an inserted object", async () =>
    request(app)
      .post("/api")
      .set("Accept", "application/json")
      .send(newTodo)
      .expect("Content-Type", /json/)
      .expect(200)
      .then((response) => {
        expect(response.body).toHaveProperty("_id");
        id = response.body._id;
        expect(response.body).toHaveProperty("title");
        expect(response.body.title).toBe(newTodo.title);
        expect(response.body).toHaveProperty("completed");
        expect(response.body.completed).toBe(newTodo.completed);
        expect(response.body).toHaveProperty("description");
        expect(response.body.description).toBe(newTodo.description);
      }));
});

describe("GET /api/:id", () => {
  it("should return a todo", async () => {
    const res = await request(app).get(`/api/${id}`);
    expect(res.statusCode).toBe(200);
    expect(res.body.title).toBe("test title");
  });
  it("should error if todo not available", async () => {
    const res = await request(app).get(`/api/673759f937095e608faa19a6`);
    expect(res.statusCode).toBe(404);
  });
});

describe("PUT /api/:id", () => {
  it("should update a todo", async () => {
    const res = await request(app).put(`/api/${id}`).send({
      title: "test title updated",
    });
    expect(res.statusCode).toBe(200);
    expect(res.body.title).toBe("test title updated");
  });
  it("should update a todo with duedate", async () => {
    const res = await request(app).put(`/api/${id}`).send({
      title: "test title updated",
      dueDate: "2023-02-03",
    });
    expect(res.statusCode).toBe(200);
    expect(res.body.title).toBe("test title updated");
  });
  it("should throw error if todo non extistent", async () => {
    const res = await request(app).put(`/api/673759f937095e608faa19a6`).send({
      title: "test title updated",
    });
    expect(res.statusCode).toBe(404);
  });
});

describe("DELETE /api/:id", () => {
  it("should delete a todo", async () => {
    const res = await request(app).delete(`/api/${id}`);
    expect(res.statusCode).toBe(200);
  });
  it("the todo should not be accessible", async () => {
    const res = await request(app).delete(`/api/${id}`);
    expect(res.statusCode).toBe(404);
  });
});
