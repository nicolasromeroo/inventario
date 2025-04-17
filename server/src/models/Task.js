
// Task.js
import mongoose from 'mongoose';

const taskSchema = new mongoose.Schema({
    title: { type: String, required: true },
    category: { type: String, required: true },
    priority: { type: Number, required: true }, 
    completed: { type: Boolean, default: false },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
});

const Task = mongoose.model('Task', taskSchema);

export default Task;

// CONSIGNA MOCKS

// import mongoose from "mongoose";

// const taskCollection = "tasks"

// const taskSchema = new mongoose.Schema({
//     name: { type: String, required: true },
//     createdBy: { type: String, required: true },
//     priority: { type: Number, required: true },
//     completedBy: { type: String, default: null },
//     completedAt: { type: Date, default: null },
//     tasks: { type: Array, default: [] },
//     assignedTo: { type: mongoose.Schema.Types.ObjectId, ref: "users" },
// })

// export const taskModel = mongoose.model(taskCollection, taskSchema)
