import { useState } from "react";
import { registrarUsuario } from "../services/api";

function Registro({ setPagina }) {
  const [formulario, setFormulario] = useState({
    nombrecompleto: "",
    correo: "",
    password: "",
    confirmarPassword: "",
    rol: "USER",
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

  function seleccionarRol(rolSeleccionado) {
    setFormulario({
      ...formulario,
      rol: rolSeleccionado,
    });
  }

  function validarFormulario() {
    const nuevosErrores = {};
    const correoValido = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const tieneMayuscula = /[A-Z]/;
    const tieneNumero = /[0-9]/;

    if (!formulario.nombrecompleto.trim()) {
      nuevosErrores.nombrecompleto = "El nombre es obligatorio.";
    }

    if (!formulario.correo.trim()) {
      nuevosErrores.correo = "El correo es obligatorio.";
    } else if (!correoValido.test(formulario.correo)) {
      nuevosErrores.correo = "Ingresa un correo válido.";
    }

    if (!formulario.password) {
      nuevosErrores.password = "La contraseña es obligatoria.";
    } else if (formulario.password.length < 8) {
      nuevosErrores.password = "La contraseña debe tener al menos 8 caracteres.";
    } else if (!tieneMayuscula.test(formulario.password)) {
      nuevosErrores.password = "Debe contener al menos una mayúscula.";
    } else if (!tieneNumero.test(formulario.password)) {
      nuevosErrores.password = "Debe contener al menos un número.";
    }

    if (!formulario.confirmarPassword) {
      nuevosErrores.confirmarPassword = "Debes confirmar la contraseña.";
    } else if (formulario.confirmarPassword !== formulario.password) {
      nuevosErrores.confirmarPassword = "Las contraseñas no coinciden.";
    }

    if (!formulario.rol) {
      nuevosErrores.rol = "Debes seleccionar un tipo de cuenta.";
    }

    return nuevosErrores;
  }

  async function manejarRegistro(evento) {
    evento.preventDefault();

    const validaciones = validarFormulario();
    setErrores(validaciones);
    setMensaje("");

    if (Object.keys(validaciones).length > 0) {
      return;
    }

    setCargando(true);

    try {
      const datosParaEnviar = {
        nombrecompleto: formulario.nombrecompleto,
        email: formulario.correo,
        username: formulario.correo,
        password: formulario.password,
        rol: formulario.rol,
        role: formulario.rol,
      };

      const respuesta = await registrarUsuario(datosParaEnviar);
      console.log("Servidor respondió:", respuesta);

      setMensaje("¡Cuenta creada con éxito! Ahora inicia sesión.");

      setFormulario({
        nombrecompleto: "",
        correo: "",
        password: "",
        confirmarPassword: "",
        rol: "USER",
      });

      setTimeout(() => {
        setPagina("login");

        window.scrollTo({
          top: 0,
          behavior: "smooth",
        });
      }, 1500);
    } catch (error) {
      console.error("Error en el registro:", error);

      setErrores({
        global:
          error.message ||
          "No se pudo crear la cuenta. Revisa si el microservicio de usuarios está activo.",
      });
    } finally {
      setCargando(false);
    }
  }

  return (
    <section className="container py-5">
      <div className="text-center mb-5 seccion-encabezado">
        <p className="text-success fw-bold">Crear cuenta</p>
        <h1>Registrarse</h1>
        <p>
          Completa tus datos para crear una cuenta en la plataforma Sanos y
          Salvos.
        </p>
      </div>

      <form
        className="card shadow-sm border-0 p-4 formulario-reporte"
        onSubmit={manejarRegistro}
      >
        <div className="mb-3">
          <label className="form-label">Tipo de cuenta</label>

          <div className="tipo-cuenta-botones">
            <button
              type="button"
              className={`btn-tipo-cuenta ${
                formulario.rol === "USER" ? "activo" : ""
              }`}
              onClick={() => seleccionarRol("USER")}
              disabled={cargando}
            >
              Usuario normal
            </button>

            <button
              type="button"
              className={`btn-tipo-cuenta ${
                formulario.rol === "VETERINARIA" ? "activo" : ""
              }`}
              onClick={() => seleccionarRol("VETERINARIA")}
              disabled={cargando}
            >
              Veterinaria
            </button>
          </div>

          {errores.rol && (
            <small className="text-danger">{errores.rol}</small>
          )}
        </div>

        <div className="mb-3">
          <label className="form-label">
            {formulario.rol === "VETERINARIA"
              ? "Nombre de la veterinaria"
              : "Nombre completo"}
          </label>

          <input
            className="form-control"
            type="text"
            name="nombrecompleto"
            value={formulario.nombrecompleto}
            onChange={manejarCambio}
            disabled={cargando}
            placeholder={
              formulario.rol === "VETERINARIA"
                ? "Ej: Veterinaria San José"
                : "Ej: Nombre Apellido"
            }
          />

          {errores.nombrecompleto && (
            <small className="text-danger">{errores.nombrecompleto}</small>
          )}
        </div>

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
            placeholder="Mínimo 8 caracteres, una mayúscula y un número"
            disabled={cargando}
          />

          {errores.password && (
            <small className="text-danger">{errores.password}</small>
          )}
        </div>

        <div className="mb-3">
          <label className="form-label">Confirmar contraseña</label>

          <input
            className="form-control"
            type="password"
            name="confirmarPassword"
            value={formulario.confirmarPassword}
            onChange={manejarCambio}
            disabled={cargando}
          />

          {errores.confirmarPassword && (
            <small className="text-danger">{errores.confirmarPassword}</small>
          )}
        </div>

        {formulario.rol === "VETERINARIA" && (
          <div className="alert alert-info p-2 mb-3">
            Esta cuenta tendrá acceso para agregar animales en adopción.
          </div>
        )}

        {errores.global && (
          <div className="alert alert-danger p-2 mb-3">{errores.global}</div>
        )}

        <button
          className="btn btn-success w-100"
          type="submit"
          disabled={cargando}
        >
          {cargando ? "Registrando..." : "Crear cuenta"}
        </button>

        {mensaje && <div className="alert alert-success mt-3">{mensaje}</div>}

        <p className="mt-3 mb-0 text-center">
          ¿Ya tienes cuenta?{" "}
          <button
            type="button"
            className="btn btn-link p-0 text-success fw-bold"
            onClick={() => setPagina("login")}
            disabled={cargando}
          >
            Iniciar sesión
          </button>
        </p>
      </form>
    </section>
  );
}

export default Registro;