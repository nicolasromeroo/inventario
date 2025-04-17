
// CONSIGNA MOCKS

// src/routes/mocks.router.js
import express from 'express';
import { generateMockUsers } from '../utils/mockingUsers.js';

const router = express.Router();

// Endpoint para generar usuarios mockeados
router.get('/mockingusers', generateMockUsers);

export default router;
