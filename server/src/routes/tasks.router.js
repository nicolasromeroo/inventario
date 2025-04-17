
// task.router.js
import { Router } from 'express';
import { createTask, deleteTask, editTask, getTask, getUserTasks } from '../controllers/task.controller.js';
import isAuthenticated from '../middleware/isAuthenticated.middleware.js';

const router = Router();

router.post('/tasks', isAuthenticated, createTask);
router.get('/tasks', isAuthenticated, getUserTasks);
router.get('/tasks/:taskId', isAuthenticated, getTask);
router.put('/tasks/:taskId', isAuthenticated, editTask);
router.delete('/tasks/:taskId', isAuthenticated, deleteTask);

export default router;


// CONSIGNA MOCKS

// import express from 'express';
// import { completeTask, generateMockTasks, getTasks } from '../controllers/Task.controller.js';

// const router = express.Router();

// router.get('/mockingtasks', generateMockTasks);
// router.get("/", getTasks)
// router.put("/:taskId/complete", completeTask)

// export default router;
