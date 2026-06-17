import { useState } from "react";
import { login } from "../services/api";

function Login({ setPagina }) {
  const [formulario, setFormulario] = useState({
    correo: "",
    password: "",
  });

  const [errores, setErrores] = useState({});
  const [mensaje, setMensaje] = useState("");
  const [cargando, setCargando] = useState(false);

  function manejarCambio(evento) {
    setFormulario({
      ...formulario,
      [evento.target.name]: evento.target.value,
    });
  }

  function validarFormulario() {
    const nuevosErrores = {};

    if (!formulario.correo.trim()) {
      nuevosErrores.correo = "El correo es obligatorio.";
    }

    if (!formulario.password) {
      nuevosErrores.password = "La contraseña es obligatoria.";
    }

    return nuevosErrores;
  }

  function obtenerPayloadToken(token) {
    try {
      if (!token || !token.includes(".")) {
        return null;
      }

      const payloadBase64 = token.split(".")[1];

      const payloadCorregido = payloadBase64
        .replace(/-/g, "+")
        .replace(/_/g, "/");

      const payloadJson = decodeURIComponent(
        atob(payloadCorregido)
          .split("")
          .map((caracter) => {
            return "%" + ("00" + caracter.charCodeAt(0).toString(16)).slice(-2);
          })
          .join("")
      );

      return JSON.parse(payloadJson);
    } catch (error) {
      console.error("No se pudo leer el payload del token:", error);
      return null;
    }
  }

  function normalizarRol(rol) {
    if (!rol) return null;

    let rolLimpio = "";

    if (Array.isArray(rol)) {
      rolLimpio = rol[0] || "";
    } else {
      rolLimpio = String(rol);
    }

    rolLimpio = rolLimpio
      .replace("ROLE_", "")
      .replace("[", "")
      .replace("]", "")
      .trim()
      .toUpperCase();

    if (rolLimpio === "VETERINARIA") {
      return "VETERINARIO";
    }

    return rolLimpio;
  }

  function obtenerRolDesdeData(data, token) {
    const payloadToken = obtenerPayloadToken(token);

    console.log("DATA QUE DEVUELVE LOGIN:", data);
    console.log("PAYLOAD DEL TOKEN:", payloadToken);

    const rolEncontrado =
      data?.rol ||
      data?.role ||
      data?.roles ||
      data?.authorities ||
      data?.usuario?.rol ||
      data?.usuario?.role ||
      data?.usuario?.roles ||
      payloadToken?.rol ||
      payloadToken?.role ||
      payloadToken?.roles ||
      payloadToken?.authorities;

    return normalizarRol(rolEncontrado);
  }

  async function manejarLogin(evento) {
    evento.preventDefault();

    const validaciones = validarFormulario();
    setErrores(validaciones);
    setMensaje("");

    if (Object.keys(validaciones).length > 0) {
      return;
    }

    setCargando(true);
    console.log("Enviando credenciales al microservicio de Auth...");

    try {
      const usernameGenerado = formulario.correo
        .split("@")[0]
        .replace(/[^a-zA-Z0-9]/g, "");

      const data = await login(usernameGenerado, formulario.password);

      const token = data?.token || data?.jwt || data?.accessToken;

      if (!token) {
        setErrores({
          global: data?.mensaje || "Correo o contraseña incorrectos.",
        });
        return;
      }

      const rol = obtenerRolDesdeData(data, token);

      if (!rol) {
        setErrores({
          global:
            "El login no está devolviendo el rol del usuario. Hay que revisar el microservicio Auth.",
        });
        return;
      }

      localStorage.setItem("token", token);
      localStorage.setItem("rol", rol);

      localStorage.setItem(
        "usuario",
        JSON.stringify({
          nombre:
            data?.nombre ||
            data?.nombreCompleto ||
            data?.nombrecompleto ||
            data?.usuario?.nombre ||
            data?.usuario?.nombreCompleto ||
            data?.usuario?.nombrecompleto ||
            formulario.correo.split("@")[0],
          correo:
            data?.correo ||
            data?.email ||
            data?.usuario?.correo ||
            data?.usuario?.email ||
            formulario.correo,
          rol: rol,
        })
      );

      if (rol === "ADMIN") {
        setMensaje("¡Acceso concedido! Entrando al dashboard...");
      } else if (rol === "VETERINARIO") {
        setMensaje("¡Acceso concedido! Entrando al perfil de veterinaria...");
      } else {
        setMensaje("¡Acceso concedido! Entrando a tu perfil...");
      }

      setTimeout(() => {
        setPagina("perfil");

        window.scrollTo({
          top: 0,
          behavior: "smooth",
        });
      }, 1000);
    } catch (error) {
      console.error("Error conectando al Login:", error);

      setErrores({
        global: "Correo o contraseña incorrectos.",
      });
    } finally {
      setCargando(false);
    }
  }

  return (
    <section className="container py-5">
      <div className="text-center mb-5 seccion-encabezado">
        <p className="text-success fw-bold">Acceso de usuario</p>
        <h1>Iniciar sesión</h1>
      </div>

      <form
        className="card shadow-sm border-0 p-4 formulario-reporte"
        onSubmit={manejarLogin}
      >
        <div className="mb-3">
          <label className="form-label">Correo electrónico</label>

          <input
            className="form-control"
            type="email"
            name="correo"
            value={formulario.correo}
            onChange={manejarCambio}
            placeholder="ejemplo@correo.com"
            disabled={cargando}
          />

          {errores.correo && (
            <small className="text-danger">{errores.correo}</small>
          )}
        </div>

        <div className="mb-3">
          <label className="form-label">Contraseña</label>

          <input
            className="form-control"
            type="password"
            name="password"
            value={formulario.password}
            onChange={manejarCambio}
            disabled={cargando}
          />

          {errores.password && (
            <small className="text-danger">{errores.password}</small>
          )}
        </div>

        {errores.global && (
          <div className="alert alert-danger p-2 mb-3">{errores.global}</div>
        )}

        <button
          className="btn btn-success w-100 mb-3"
          type="submit"
          disabled={cargando}
        >
          {cargando ? "Validando..." : "Iniciar sesión"}
        </button>

        {mensaje && <div className="alert alert-success mt-3">{mensaje}</div>}

        <p className="mt-3 mb-0 text-center">
          ¿No tienes cuenta?{" "}
          <button
            type="button"
            className="btn btn-link p-0 text-success fw-bold"
            onClick={() => setPagina("registro")}
            disabled={cargando}
          >
            Registrarse
          </button>
        </p>
      </form>
    </section>
  );
}

export default Login;