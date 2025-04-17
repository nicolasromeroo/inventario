// import React, { useState } from "react";

// const Login = () => {
//   const [formData, setFormData] = useState({
//     username: "",
//     password: "",
//   });

//   const [error, setError] = useState(null);
//   const [success, setSuccess] = useState(null);

//   const handleChange = (e) => {
//     setFormData({
//       ...formData,
//       [e.target.name]: e.target.value,
//     });
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     console.log("Datos enviados al servidor:", formData); 

//     try {
//       const response = await fetch("http://localhost:8080/api/login", {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify({
//           username: formData.username,
//           password: formData.password,
//         }),
//         credentials: "include", 
//       });

//       const data = await response.json();

//       if (!response.ok) {
//         throw new Error(data.message || "Error al iniciar sesión");
//       }

//       // Si todo va bien
//       setSuccess("Inicio de sesión exitoso, redirigiendo...");
//       setTimeout(() => {
//         window.location.href = "/profile"; 
//       }, 2000);

//     } catch (error) {
//       setError(error.message); 
//     }
//   };

//   return (
//     <div>
//       <h2>Iniciar Sesión</h2>
//       <form onSubmit={handleSubmit}>
//         <div>
//           <label>Usuario</label>
//           <input
//             type="text"
//             name="username"
//             placeholder="Nombre de usuario"
//             value={formData.username}
//             onChange={handleChange}
//             required
//           />
//         </div>
//         <div>
//           <label>Contraseña</label>
//           <input
//             type="password"
//             name="password"
//             placeholder="Contraseña"
//             value={formData.password}
//             onChange={handleChange}
//             required
//           />
//         </div>
//         <button type="submit">Iniciar Sesión</button>
//       </form>

//       {error && <p style={{ color: "red" }}>{error}</p>}
//       {success && <p style={{ color: "green" }}>{success}</p>}
//     </div>
//   );
// };

// export default Login;

import { useState } from "react";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (password === "admin123") {
      navigate("/articulos");
    } else {
      alert("Contraseña incorrecta");
    }
  };

  return (
    <div className="container mt-5">
      <h2>Acceso al Sistema</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="password"
          className="form-control"
          placeholder="Ingrese la contraseña"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button type="submit" className="btn btn-primary mt-3">Ingresar</button>
      </form>
    </div>
  );
};

export default Login;
