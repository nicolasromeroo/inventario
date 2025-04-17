
// server.js
import express from 'express';
import envsConfig from "./src/config/envs.config.js";
import cors from 'cors';
import cookieParser from "cookie-parser";
import authRoutes from "./src/routes/auth.router.js";
import taskRoutes from './src/routes/tasks.router.js';
import { connectMongoDB } from './src/db/connect.js';
import { verifyToken } from './src/utils/jwt.js';
import swaggerJSDoc from 'swagger-jsdoc';
import swaggerUiExpress from "swagger-ui-express"
import { __dirname } from './src/path.js';
import userRouter from './src/routes/users.router.js';

connectMongoDB();
const app = express();

const swaggerOptions = {
  definition: {
    openapi: "3.1.0",
    info: {
      title: "Título de la doc",
      description: "Descripción de la doc",
    },
    components: {
      securitySchemes: {
        BearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT"
        }
      }
    }
  },
  apis: [`${__dirname}/docs/**/*.yaml`]
}

const specs = swaggerJSDoc(swaggerOptions)

app.use(cors({
  origin: "http://localhost:5173",
  credentials: true,
}));
app.use(express.json());
app.use(cookieParser(envsConfig.SECRET_KEY));

app.use("/api", authRoutes);
app.use('/api', taskRoutes);
app.use("/api/users", verifyToken, userRouter)
app.use("/api-docs", swaggerUiExpress.serve, swaggerUiExpress.setup(specs))

app.listen(process.env.PORT, () => {
  console.log(`Servidor corriendo con éxito`);
});

export default app;

// CONSIGNA MOCKS

// import mocksRouter from "./src/routes/mocks.router.js"

// app.use("/api/tasks", createTask)

// app.use('/api/mocks', mocksRouter); // consigna mocks
// app.get("/tasks/mockingtasks", async (req, res) => {
//   const { count, userId } = req.query;
//   try {
//     const tasks = await generateTasks(count, userId);
//     res.status(201).json(tasks);
//   } catch (error) {
//     res.status(500).json({ error: "Error generando tareas" });
//   }
// });
