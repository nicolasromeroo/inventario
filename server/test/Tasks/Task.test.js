
import request from "supertest";
import app from "../src/server.js";
import Task from "../../src/models/Task.js";
import mongoose from "mongoose";
import { MongoMemoryServer } from "mongodb-memory-server";

let mongoServer;
let token;

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  await mongoose.connect(mongoServer.getUri());

  token = "Bearer test-token";
});

afterAll(async () => {
  await mongoose.disconnect();
  await mongoServer.stop();
});

describe("Task API Endpoints", () => {
  let taskId;

  // crear tarea
  it("POST /tasks - Debería crear una nueva tarea", async () => {
    const newTask = {
      title: "Tarea de prueba",
      category: "Trabajo",
      priority: "Alta",
    };

    const res = await request(app)
      .post("/tasks")
      .set("Authorization", token)
      .send(newTask);

    expect(res.status).toBe(201);
    expect(res.body.title).toBe(newTask.title);
    expect(res.body.category).toBe(newTask.category);
    taskId = res.body._id;
  });

  // obtener TODAS las tareas
  it("GET /tasks - Debería obtener las tareas del usuario", async () => {
    const res = await request(app)
      .get("/tasks")
      .set("Authorization", token);

    expect(res.status).toBe(200);
    expect(res.body.length).toBeGreaterThan(0);
  });

  // obtener tarea por ID
  it("GET /tasks/:taskId - Debería devolver una tarea específica", async () => {
    const res = await request(app)
      .get(`/tasks/${taskId}`)
      .set("Authorization", token);

    expect(res.status).toBe(200);
    expect(res.body._id).toBe(taskId);
  });

  // editar tarea
  it("PUT /tasks/:taskId - Debería actualizar una tarea existente", async () => {
    const updateData = { completed: true };

    const res = await request(app)
      .put(`/tasks/${taskId}`)
      .set("Authorization", token)
      .send(updateData);

    expect(res.status).toBe(200);
    expect(res.body.completed).toBe(true);
  });

  // eliminar tarea
  it("DELETE /tasks/:taskId - Debería eliminar una tarea", async () => {
    const res = await request(app)
      .delete(`/tasks/${taskId}`)
      .set("Authorization", token);

    expect(res.status).toBe(200);
    expect(res.body.message).toBe("Tarea eliminada correctamente");
  });

  // manejo de errores al buscar tarea inexistente
  it("GET /tasks/:taskId - Debería devolver error si no existe la tarea", async () => {
    const invalidId = new mongoose.Types.ObjectId();
    const res = await request(app)
      .get(`/tasks/${invalidId}`)
      .set("Authorization", token);

    expect(res.status).toBe(404);
    expect(res.body.message).toBe("Tarea no encontrada");
  });
});
