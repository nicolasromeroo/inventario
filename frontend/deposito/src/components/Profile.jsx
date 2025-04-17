import React, { useState, useEffect } from "react";
import TaskList from "./TaskList.jsx";
import Cookies from "js-cookie";
import TaskForm from "./TaskForm.jsx";

const Profile = () => {
  const [tasks, setTasks] = useState([]);
  const [userData, setUserData] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const token = Cookies.get("token");
        if (!token) throw new Error("Token de autenticación no encontrado.");

        const response = await fetch("http://localhost:8080/api/profile", {
          headers: { Authorization: `Bearer ${token}` },
          credentials: "include",
        });

        if (!response.ok) throw new Error("No se pudo cargar el perfil.");

        const data = await response.json();
        setUserData(data);

        const tasksResponse = await fetch(`http://localhost:8080/api/tasks?userId=${data.id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (!tasksResponse.ok) throw new Error("No se pudo obtener las tareas.");

        const tasksData = await tasksResponse.json();
        setTasks(Array.isArray(tasksData) ? tasksData : []);
      } catch (error) {
        setError(error.message);
      }
    };

    fetchUserProfile();
  }, []);

  if (error) return <p style={{ color: "red" }}>{error}</p>;
  if (!userData) return <p>Cargando...</p>;

  const completedTasks = tasks.filter((task) => task.completed);
  const performance = tasks.length ? (completedTasks.length / tasks.length) * 100 : 0;

  const onAddTask = (newTask) => {
    setTasks([...tasks, newTask]);
  };

  return (
    <div>
      <h2>Perfil de Usuario</h2>
      <p><strong>ID:</strong> {userData.id}</p>
      <p><strong>Usuario:</strong> {userData.username}</p>
      <p><strong>Completadas:</strong> {completedTasks.length}/{tasks.length}</p>
      <p><strong>Rendimiento:</strong> {performance.toFixed(2)}%</p>

      <TaskForm onAddTask={onAddTask} userId={userData.id} />

      <TaskList tasks={tasks} setTasks={setTasks} userId={userData.id} />
    </div>
  );
};

export default Profile;
