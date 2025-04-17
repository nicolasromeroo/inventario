import React, { useState } from 'react';
import axios from 'axios';
import Cookies from 'js-cookie';
import "../assets/styles/styles.css";

const TaskForm = ({ onAddTask, userId }) => {
    const [task, setTask] = useState({ title: '', category: '', priority: '' });
    const [error, setError] = useState(null);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setTask({
            ...task,
            [name]: name === "priority" ? Number(value) : value,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);

        const token = Cookies.get("token");
        if (!token) {
            setError("No hay sesión activa.");
            return;
        }

        try {
            const res = await axios.post('http://localhost:8080/api/tasks', {
                ...task,
                userId: userId,
            }, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            onAddTask(res.data);
            setTask({ title: '', category: '', priority: '' });
        } catch (error) {
            console.error("Error al agregar la tarea:", error);
            setError("No se pudo agregar la tarea. Inténtalo de nuevo.");
        }
    };


    return (
        <form onSubmit={handleSubmit} className="task-form">
            <label>
                Tarea:
                <input
                    name="title"
                    placeholder="Ej. Comprar leche"
                    value={task.title}
                    onChange={handleChange}
                    required
                />
            </label>

            <label>
                Categoría:
                <input
                    name="category"
                    placeholder="Ej. Compras"
                    value={task.category}
                    onChange={handleChange}
                    required
                />
            </label>

            <label>
                Prioridad (%):
                <input
                    name="priority"
                    type="number"
                    placeholder="Ej. 50"
                    value={task.priority}
                    onChange={handleChange}
                    min="1" max="100"
                    required
                />
            </label>

            <button type="submit" disabled={!task.title || !task.category || !task.priority}>
                Agregar
            </button>

            {error && <p className="error-message">{error}</p>}
        </form>
    );
};

export default TaskForm;
