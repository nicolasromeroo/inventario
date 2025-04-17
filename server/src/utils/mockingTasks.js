
// CONSIGNA MOCKS

import { faker } from "@faker-js/faker";
import { userModel } from "../models/User.js";

export const generateTasks = async (count) => {
    const priorities = [20, 50, 80, 10];
    const users = await userModel.find(); 

    return Array.from({ length: count }).map(() => {
        const randomUser = users[Math.floor(Math.random() * users.length)];

        return {
            name: faker.lorem.words(3),
            createdBy: faker.person.fullName(),
            priority: priorities[Math.floor(Math.random() * priorities.length)],
            completedBy: null,
            completedAt: null,
            tasks: [],
            assignedTo: randomUser._id, 
        };
    });
};
