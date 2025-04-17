import React, { useEffect, useState } from 'react';

const TaskManager = () => {
    const [tasks, setTasks] = useState([]);

    useEffect(() => {
        const fetchTasks = async () => {
            const token = localStorage.getItem('token');
            const response = await fetch('http://localhost:8080/api/tasks', {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });
            const data = await response.json();
            setTasks(data);
        };

        fetchTasks();
    }, []);

    return (
        <div>
            <h2>Mis Tareas</h2>
            <ul>
                {tasks.map(task => (
                    <li key={task._id}>{task.title} - {task.category} ({task.priority})</li>
                ))}
            </ul>
        </div>
    );
};

export default TaskManager;

// CONSIGNA MOCKS

// import React, { useEffect, useState } from "react";
// import axios from "axios";
// import "../assets/styles/taskManager.css"

// const API_URL = "http://localhost:8080"; // Ajusta la URL si es diferente

// const TaskManager = () => {
//   const [tasks, setTasks] = useState([]);
//   const [loading, setLoading] = useState(false);
//   const [count, setCount] = useState(5); // Número de tareas a generar

//   // Obtener tareas
//   const fetchTasks = async () => {
//     setLoading(true);
//     try {
//       const response = await axios.get(`${API_URL}/tasks`);
//       setTasks(response.data);
//     } catch (error) {
//       console.error("Error obteniendo tareas:", error);
//     }
//     setLoading(false);
//   };

//   // Generar tareas mock
//   const handleGenerateTasks = async () => {
//     setLoading(true);
//     try {
//       await axios.get(`${API_URL}/tasks/mockingtasks?count=${count}`);
//       fetchTasks();
//     } catch (error) {
//       console.error("Error generando tareas:", error);
//     }
//     setLoading(false);
//   };

//   // Completar tarea
//   const handleCompleteTask = async (taskId) => {
//     setLoading(true);
//     try {
//       await axios.put(`${API_URL}/tasks/${taskId}/complete`, {
//         userId: "123", // Puedes manejar el usuario autenticado
//         username: "Usuario Demo",
//       });
//       fetchTasks();
//     } catch (error) {
//       console.error("Error completando tarea:", error);
//     }
//     setLoading(false);
//   };

//   useEffect(() => {
//     fetchTasks();
//   }, []);

//   return (
//     <div className="container">
//       <h2>Gestión de Tareas</h2>

//       {/* Botón para generar tareas */}
//       <div>
//         <input
//           type="number"
//           value={count}
//           onChange={(e) => setCount(e.target.value)}
//           min="1"
//         />
//         <button onClick={handleGenerateTasks} disabled={loading}>
//           Generar Tareas
//         </button>
//       </div>

//       {/* Lista de tareas */}
//       {loading ? (
//         <p>Cargando...</p>
//       ) : (
//         <ul>
//           {tasks.map((task) => (
//             <li key={task._id}>
//               <strong>{task.name}</strong> - Prioridad: {task.priority}
//               {task.completedBy ? (
//                 <span> ✅ Completada por {task.completedBy}</span>
//               ) : (
//                 <button onClick={() => handleCompleteTask(task._id)}>
//                   Completar
//                 </button>
//               )}
//             </li>
//           ))}
//         </ul>
//       )}
//     </div>
//   );
// };

// export default TaskManager;

// import React, { useEffect, useState } from "react";
// import axios from "axios";
// import "../assets/styles/taskManager.css";

// // Aquí deberías obtener el `userId` del estado o del localStorage, dependiendo de tu implementación de autenticación.
// const userId = "123"; // Simulación de un `userId`, reemplázalo por tu lógica de autenticación
// const API_URL = "http://localhost:8080"; // Ajusta la URL si es diferente

// const TaskManager = () => {
//   const [tasks, setTasks] = useState([]);
//   const [loading, setLoading] = useState(false);
//   const [count, setCount] = useState(5); // Número de tareas a generar

//   // Obtener las tareas asociadas al usuario
//   const fetchTasks = async () => {
//     setLoading(true);
//     try {
//       const response = await axios.get(`${API_URL}/tasks/user/${userId}`); // Obtener tareas de un usuario específico
//       setTasks(response.data);
//     } catch (error) {
//       console.error("Error obteniendo tareas:", error);
//     }
//     setLoading(false);
//   };

//   // Generar tareas mock para el usuario
//   const handleGenerateTasks = async () => {
//     setLoading(true);
//     try {
//       await axios.get(`${API_URL}/tasks/mockingtasks?count=${count}&userId=${userId}`); // Generar tareas para un usuario específico
//       fetchTasks();
//     } catch (error) {
//       console.error("Error generando tareas:", error);
//     }
//     setLoading(false);
//   };

//   // Completar tarea
//   const handleCompleteTask = async (taskId) => {
//     setLoading(true);
//     try {
//       await axios.put(`${API_URL}/tasks/${taskId}/complete`, {
//         userId: userId, // Pasamos el `userId` en la solicitud
//         username: "Usuario Demo", // Asegúrate de tener el nombre del usuario actual
//       });
//       fetchTasks();
//     } catch (error) {
//       console.error("Error completando tarea:", error);
//     }
//     setLoading(false);
//   };

//   useEffect(() => {
//     fetchTasks();
//   }, []);

//   return (
//     <div className="container">
//       <h2>Gestión de Tareas</h2>

//       {/* Botón para generar tareas */}
//       <div>
//         <input
//           type="number"
//           value={count}
//           onChange={(e) => setCount(e.target.value)}
//           min="1"
//         />
//         <button onClick={handleGenerateTasks} disabled={loading}>
//           Generar Tareas
//         </button>
//       </div>

//       {/* Lista de tareas */}
//       {loading ? (
//         <p>Cargando...</p>
//       ) : (
//         <ul>
//           {tasks.map((task) => (
//             <li key={task._id}>
//               <strong>{task.name}</strong> - Prioridad: {task.priority}
//               {task.completedBy ? (
//                 <span> ✅ Completada por {task.completedBy}</span>
//               ) : (
//                 <button onClick={() => handleCompleteTask(task._id)}>
//                   Completar
//                 </button>
//               )}
//             </li>
//           ))}
//         </ul>
//       )}
//     </div>
//   );
// };

// export default TaskManager;
