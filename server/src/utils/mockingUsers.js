
// CONSIGNA MOCKS

// src/utils/mockingUsers.js
import { faker } from "@faker-js/faker";
import bcrypt from "bcrypt";
import { userModel } from "../models/User.js"; 

export const generateMockUsers = async (req, res) => {
    const { count = 50 } = req.query; // número de usuarios a generar (por defecto 50)

    const users = Array.from({ length: Number(count) }).map(() => {
        const username = faker.internet.userName();
        const password = bcrypt.hashSync("coder123", 10); 
        const role = Math.random() > 0.5 ? "user" : "admin"; // role aleatorio
        const tasks = []; // array vacío de tareas (en lugar de pets)

        return { username, password, role, tasks };
    });

    try {
        const createdUsers = await userModel.insertMany(users);

        const tasks = await generateTasks(count); 

        tasks.forEach(async (task) => {
            const user = createdUsers.find(user => user._id.toString() === task.assignedTo.toString());
            if (user) {
                user.tasks.push(task); 
                await user.save();
            }
        });

        res.status(201).json({ message: `${count} usuarios generados con tareas` });
    } catch (error) {
        res.status(500).json({ error: "Error generando usuarios" });
    }
};

