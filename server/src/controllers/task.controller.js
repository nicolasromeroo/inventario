// task.controller.js
import Task from "../models/Task.js";
import { Router } from 'express';
import { verifyToken } from '../utils/jwt.js';

const router = Router();

// crear tareas
export const createTask = async (req, res) => {
  const { title, category, priority } = req.body;
  const userId = req.user?.id; 

  if (!title || !category || !priority || !userId) {
    return res.status(400).json({ error: "Faltan datos requeridos para crear la tarea" });
  }

  try {
    const newTask = new Task({
      title,
      category,
      priority,
      completed: false,
      userId, 
      createdAt: new Date(),
    });

    await newTask.save();

    res.status(201).json(newTask);
  } catch (error) {
    res.status(500).json({ error: "Error al crear la tarea" });
  }
};


// obtener tareas 
export const getTask = async (req, res) => {
  const { taskId } = req.params;

  if (!taskId) {
    return res.status(400).json({ error: "Falta el ID de la tarea" });
  }

  try {
    const task = await Task.findById(taskId);
    if (!task) {
      return res.status(404).json({ message: "Tarea no encontrada" });
    }

    res.status(200).json(task);
  } catch (error) {
    console.error("Error al obtener la tarea:", error);
    return res.status(500).json({ message: "Error en el servidor" });
  }
};

// eliminar tarea
export const deleteTask = async (req, res) => {
  const { taskId } = req.params;

  if (!taskId) {
    return res.status(400).json({ message: "Falta el ID de la tarea" });
  }

  try {
    const task = await Task.findByIdAndDelete(taskId);
    if (!task) {
      return res.status(404).json({ message: "Tarea no encontrada" });
    }

    res.status(200).json({ message: "Tarea eliminada correctamente" });
  } catch (error) {
    console.error("Error al eliminar la tarea:", error);
    return res.status(500).json({ message: "Error en el servidor", error: error.message });
  }
};


export const editTask = async (req, res) => {
  const { taskId } = req.params;
  const { completed } = req.body;
  const token = req.headers.authorization?.split(" ")[1];

  if (!token) {
    return res.status(401).json({ message: "Token no proporcionado" });
  }

  try {
    const decodedToken = verifyToken(token);
    if (!decodedToken) {
      return res.status(401).json({ message: "Token inválido o expirado" });
    }

    const task = await Task.findById(taskId);
    if (!task) {
      return res.status(404).json({ message: "Tarea no encontrada" });
    }

    task.completed = completed;
    await task.save();

    res.status(200).json(task);
  } catch (error) {
    console.error("Error al actualizar la tarea:", error);
    return res.status(500).json({ message: "Error en el servidor" });
  }
}

export const getUserTasks = async (req, res) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(400).json({ error: "Usuario no autenticado" });
    }

    const tasks = await Task.find({ userId });

    res.json(tasks);
  } catch (error) {
    console.error("Error al obtener las tareas:", error);
    res.status(500).json({ error: "Error en el servidor" });
  }
};


export default router;

// CONSIGNA MOCKS

// import { taskModel } from "../models/Task.js";
// import { generateTasks } from "../utils/mockingTasks.js";

// // generar tareas
// export const generateMockTasks = async (req, res) => {
//     const { count } = req.query
//     const tasks = generateTasks(Number(count))

//     try {
//         await taskModel.insertMany(tasks)
//         res.status(201).json({ message: `${count} tareas generadas` })
//     } catch (error) {
//         res.status(500).json({ error: "Error generando tareas" })
//     }
// }

// // obtener todas las tareas
// export const getTasks = async (req, res) => {
//     try {
//         const tasks = await taskModel.find()
//         res.status(200).json(tasks)
//     } catch (error) {
//         res.status(500).json({ error: "Error obteniendo tareas." })
//     }
// }

// // completar una tarea
// export const completeTask = async (req, res) => {
//     const { taskId } = req.params
//     const { userId, username } = req.body

//     try {
//         const task = await taskModel.findById(taskId);
//         if (!task) return res.status(404).json({ error: "Tarea no encontrada." });

//         task.completedBy = username;
//         task.completedAt = new Date();

//         await task.save();
//         res.status(200).json({ message: "Tarea completada.", task });

//     } catch (error) {
//         res.status(500).json({ error: "Error completando tarea." })
//     }
// }


