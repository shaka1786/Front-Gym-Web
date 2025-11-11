import { useState, useEffect } from "react";
import api from "../api";

// ✅ Función que decodifica el token JWT
export const decodeJwt = (token) => {
  try {
    const parts = String(token || "").split(".");
    const payload = parts[1];
    if (!payload) return null;

    let base64 = payload.replace(/-/g, "+").replace(/_/g, "/");
    const pad = base64.length % 4;
    if (pad) base64 += "=".repeat(4 - pad);

    const json = decodeURIComponent(
      atob(base64)
        .split("")
        .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
        .join("")
    );
    return JSON.parse(json);
  } catch (err) {
    console.error("decodeJwt error:", err);
    return null;
  }
};

export const useAuth = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // 🚀 Obtiene datos actualizados del usuario (si existe token)
  async function fetchUser() {
    try {
      const res = await api.get("/me"); // debe devolver los datos del usuario actual
      setUser(res.data);
      localStorage.setItem("user", JSON.stringify(res.data)); // 🔥 Guarda copia local
    } catch (err) {
      console.error("fetchUser error:", err);
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      setUser(null);
    } finally {
      setLoading(false);
    }
  }

  // 🧠 Efecto inicial: revisa si hay token y usuario guardado
  useEffect(() => {
    const token = localStorage.getItem("token");
    const storedUser = localStorage.getItem("user");

    if (storedUser) {
      setUser(JSON.parse(storedUser)); // ⚡ carga usuario local
      setLoading(false);
    }

    if (!token) {
      setLoading(false);
      return;
    }

    const decoded = decodeJwt(token);

    // Si el token es válido, intenta refrescar datos desde el backend
    if (decoded) {
      fetchUser();
    } else {
      // Token inválido → limpiar
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      setUser(null);
      setLoading(false);
    }
  }, []);

  // 🔐 Login que guarda token + usuario
const login = async (correo, password) => {
  try {
    const res = await api.post("/login", {
      correo_electronico: correo,
      password,
    });

    console.log("🧠 Respuesta completa del backend:", res.data);

    const { token, user } = res.data;

    if (!user) {
      alert("⚠️ El backend no devolvió el objeto 'user'. Revisa la consola del backend.");
      return;
    }

    // ✅ Guarda token y usuario completo en localStorage
    localStorage.setItem("token", token);
    localStorage.setItem("user", JSON.stringify(user));

    // ✅ Actualiza estado del usuario en React
    setUser(user);

  } catch (error) {
    console.error("Error en login:", error.response?.data || error.message);
    alert("Error al iniciar sesión. Revisa tus credenciales o el backend.");
  }
};


  // 🧾 Registro (opcional)
  const register = async (data) => {
    await api.post("/register", data);
  };

  // 🚪 Logout
  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
    window.location.href = "/gym";
  };

  return { user, loading, login, register, logout };
};
