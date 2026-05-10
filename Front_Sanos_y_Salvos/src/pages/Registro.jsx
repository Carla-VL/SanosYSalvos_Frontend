import { useState } from "react";

function Registro({ setPagina }) {
  const [formulario, setFormulario] = useState({
    nombre: "",
    correo: "",
    password: "",
    confirmarPassword: "",
  });

  const [errores, setErrores] = useState({});
  const [mensaje, setMensaje] = useState("");

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

    if (!formulario.nombre.trim()) {
      nuevosErrores.nombre = "El nombre es obligatorio.";
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

  function manejarRegistro(evento) {
    evento.preventDefault();

    const validaciones = validarFormulario();
    setErrores(validaciones);
    setMensaje("");

    if (Object.keys(validaciones).length > 0) {
      return;
    }

    console.log("Datos listos para enviar al BFF:", {
      nombre: formulario.nombre,
      correo: formulario.correo,
      password: formulario.password,
    });

    setMensaje("Datos validados correctamente. Pendiente conexión con BFF.");

    setFormulario({
      nombre: "",
      correo: "",
      password: "",
      confirmarPassword: "",
    });
  }

  return (
    <section className="container py-5 reveal">
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
            name="nombre"
            value={formulario.nombre}
            onChange={manejarCambio}
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
          />
          {errores.confirmarPassword && (
            <small className="text-danger">{errores.confirmarPassword}</small>
          )}
        </div>

        <button className="btn btn-success" type="submit">
          Crear cuenta
        </button>

        {mensaje && <div className="alert alert-success mt-3">{mensaje}</div>}

        <p className="mt-3 mb-0 text-center">
          ¿Ya tienes cuenta?{" "}
          <button
            type="button"
            className="btn btn-link p-0 text-success fw-bold"
            onClick={() => setPagina("login")}
          >
            Iniciar sesión
          </button>
        </p>
      </form>
    </section>
  );
}

export default Registro;