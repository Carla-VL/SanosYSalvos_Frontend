import { useState } from "react";
import { registrarUsuario } from "../services/api"; 

function Registro({ setPagina }) {
  const [formulario, setFormulario] = useState({
    nombrecompleto: "",
    correo: "",
    password: "",
    confirmarPassword: "",
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
    console.log(" Enviando datos al microservicio de Usuarios");

    try {
      const datosParaEnviar = {
        nombrecompleto: formulario.nombre,
        email: formulario.correo,
        username: formulario.correo, // Usamos el correo como username
        password: formulario.password
      };

      const respuesta = await registrarUsuario(datosParaEnviar);
      console.log(" Servidor respondió:", respuesta);

      setMensaje("¡Cuenta creada con éxito! Llevándote al inicio de sesión...");

      setFormulario({
        nombre: "",
        correo: "",
        password: "",
        confirmarPassword: "",
      });

      setTimeout(() => {
        setPagina("login");
      }, 2000);

    } catch (error) {
      console.error("❌ Error en el Registro:", error);
      setErrores({ global: "No se pudo crear la cuenta. Revisa si el microservicio (8083) está arriba." });
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
          Completa tus datos para crear una cuenta en la plataforma Sanos y Salvos.
        </p>
      </div>

      <form
        className="card shadow-sm border-0 p-4 formulario-reporte"
        onSubmit={manejarRegistro}
      >
        <div className="mb-3">
          <label className="form-label">Nombre completo</label>
          <input
            className="form-control"
            type="text"
            name="nombrecompleto"
            value={formulario.nombre}
            onChange={manejarCambio}
            disabled={cargando}
          />
          {errores.nombre && <small className="text-danger">{errores.nombre}</small>}
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
          {errores.correo && <small className="text-danger">{errores.correo}</small>}
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

        {/* Error general del servidor */}
        {errores.global && <div className="alert alert-danger p-2 mb-3">{errores.global}</div>}

        <button className="btn btn-success w-100" type="submit" disabled={cargando}>
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