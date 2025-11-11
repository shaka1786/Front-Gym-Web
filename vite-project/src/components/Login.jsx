import { useState } from "react";
import axios from "axios";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [diasRestantes, setDiasRestantes] = useState(null);
  const [fechaVencimiento, setFechaVencimiento] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post("/api/auth/login", {
        correo_electronico: email,
        password,
      });

      const { token, fecha_vencimiento, dias_restantes } = res.data;

      // Guardar token y datos en localStorage
      localStorage.setItem("token", token);
      localStorage.setItem("fecha_vencimiento", fecha_vencimiento);
      localStorage.setItem("dias_restantes", dias_restantes);

      // Mostrar los datos
      setFechaVencimiento(fecha_vencimiento);
      setDiasRestantes(dias_restantes);
      setError("");

      // Redirigir si quieres (por ejemplo, a dashboard)
      // window.location.href = "/admin/register";
    } catch (err) {
      setError(err.response?.data?.message || "Error en login");
    }
  };

  return (
    <div style={{ textAlign: "center", marginTop: "50px" }}>
      <form onSubmit={handleSubmit}>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Correo"
          required
        />
        <br />
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Contraseña"
          required
        />
        <br />
        <button type="submit">Iniciar sesión</button>
      </form>

      {error && <p style={{ color: "red" }}>{error}</p>}

      {diasRestantes !== null && (
        <div style={{ marginTop: "20px" }}>
          <p>📅 Fecha de vencimiento: {new Date(fechaVencimiento).toLocaleDateString()}</p>
          <p>⏳ Días restantes: {diasRestantes}</p>
        </div>
      )}
    </div>
  );
};

export default Login;
