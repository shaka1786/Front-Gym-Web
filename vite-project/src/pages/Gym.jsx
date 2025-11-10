import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import img1 from "../assets/image1.PNG";
import img2 from "../assets/image2.PNG";
import img3 from "../assets/image3.PNG";
import { useAuth } from "../hooks/useAuth";
import api from "../api";

export default function Gym() {
  const { user, login, logout } = useAuth();
  const [loginData, setLoginData] = useState({ correo: "", password: "" });
  const [error, setError] = useState("");
  const [tiposMembresia, setTiposMembresia] = useState([]);
  const [selectedPago, setSelectedPago] = useState("");

  useEffect(() => {
    if (user) fetchTiposMembresia();
  }, [user]);

  const fetchTiposMembresia = async () => {
    try {
      const res = await api.get("/tipoMembresia");
      setTiposMembresia(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleLoginChange = (e) => {
    setLoginData({ ...loginData, [e.target.name]: e.target.value });
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      await login(loginData.correo, loginData.password);
      setError("");
    } catch (err) {
      setError(err.response?.data?.message || "Error en login");
    }
  };

  const handlePago = async () => {
    if (!selectedPago) return;
    try {
      await api.post("/pagos", {
        id_usuario: user.id,
        id_pago: selectedPago,
        descripcion: "Pago membresía",
      });
      alert("✅ Pago realizado con éxito");
    } catch {
      setError("Error al realizar el pago");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 text-white flex flex-col items-center py-10">
      {/* Header */}
      <h1 className="text-5xl font-bold text-center text-emerald-400 mb-8">
        🏋️‍♂️ Campus FIT
      </h1>

      {/* Imagen principal */}
      <div className="flex gap-6 mb-10">
        <img src={img1} alt="Gym 1" className="w-64 h-40 rounded-xl shadow-lg object-cover" />
        <img src={img2} alt="Gym 2" className="w-64 h-40 rounded-xl shadow-lg object-cover" />
        <img src={img3} alt="Gym 3" className="w-64 h-40 rounded-xl shadow-lg object-cover" />
      </div>

      {/* Contenedor principal */}
      <div className="bg-gray-900/80 rounded-2xl shadow-xl p-8 w-full max-w-md text-center backdrop-blur">
        <h2 className="text-2xl font-semibold mb-2">Bienvenido al entorno de bienestar</h2>
        <p className="text-gray-400 mb-6">
          Tu salud es parte esencial de tu formación. ¡Actívate y disfruta del gimnasio de tu universidad!
        </p>

        {/* Si no está logueado */}
        {!user ? (
          <form onSubmit={handleLogin} className="flex flex-col gap-4">
            <input
              name="correo"
              type="email"
              placeholder="Correo electrónico"
              value={loginData.correo}
              onChange={handleLoginChange}
              className="p-3 rounded-lg bg-gray-800 text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
            <input
              name="password"
              type="password"
              placeholder="Contraseña"
              value={loginData.password}
              onChange={handleLoginChange}
              className="p-3 rounded-lg bg-gray-800 text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
            <button
              type="submit"
              className="bg-emerald-500 hover:bg-emerald-600 text-white font-semibold py-2 rounded-lg transition-all"
            >
              Iniciar sesión
            </button>
            {error && <p className="text-red-400">{error}</p>}
          </form>
        ) : (
          <>
            {/* Usuario autenticado */}
            <div className="mb-4">
              <p className="text-lg">
                Bienvenido,{" "}
                <span className="font-semibold text-emerald-400">
                  {user.nombre}
                </span>{" "}
                ({user.rol})
              </p>
              <button
                onClick={logout}
                className="mt-3 text-sm text-red-400 hover:text-red-500 underline"
              >
                Cerrar sesión
              </button>
            </div>

            {/* Pagos */}
            <h3 className="text-xl font-semibold mb-2">
              Realizar Pago de Membresía
            </h3>
            <select
              value={selectedPago}
              onChange={(e) => setSelectedPago(e.target.value)}
              className="w-full p-3 mb-3 rounded-lg bg-gray-800 text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
            >
              <option value="">Selecciona una membresía</option>
              {tiposMembresia.map((tipo) => (
                <option key={tipo.id} value={tipo.id}>
                  {tipo.tiempo} días — ${tipo.valor}
                </option>
              ))}
            </select>
            <button
              onClick={handlePago}
              className="bg-emerald-500 hover:bg-emerald-600 w-full py-2 rounded-lg font-semibold transition-all"
            >
              Pagar
            </button>

            {/* Admin */}
            {user.rol === "Admin" && (
              <div className="mt-6 flex flex-col gap-3">
                <Link
                  to="/admin"
                  className="text-blue-400 hover:text-blue-500 underline"
                >
                  Ir al panel de administración
                </Link>
                <Link to="/admin/register">
                  <button className="bg-blue-500 hover:bg-blue-600 w-full py-2 rounded-lg font-semibold">
                    Registrar nuevo usuario
                  </button>
                </Link>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
