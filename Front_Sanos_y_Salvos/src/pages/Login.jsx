import { useState } from "react";

function Login({ setPagina }) {
  const [formulario, setFormulario] = useState({
    correo: "",
    password: "",
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

    if (!formulario.correo.trim()) {
      nuevosErrores.correo = "El correo es obligatorio.";
    } else if (!correoValido.test(formulario.correo)) {
      nuevosErrores.correo = "Ingresa un correo válido.";
    }

    if (!formulario.password) {
      nuevosErrores.password = "La contraseña es obligatoria.";
    }

    return nuevosErrores;
  }

  function manejarLogin(evento) {
    evento.preventDefault();

    const validaciones = validarFormulario();
    setErrores(validaciones);
    setMensaje("");

    if (Object.keys(validaciones).length > 0) {
      return;
    }

    console.log("Credenciales listas para enviar al BFF:", formulario);

    setMensaje("Datos validados correctamente. Pendiente conexión con BFF.");

    setFormulario({
      correo: "",
      password: "",
    });
  }

  return (
    <section className="container py-5 reveal">
      <div className="text-center mb-5 seccion-encabezado">
        <p className="text-success fw-bold">Acceso de usuario</p>
        <h1>Iniciar sesión</h1>
        <p>
          Ingresa tus datos para acceder a la plataforma Sanos y Salvos.
        </p>
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
          />
          {errores.password && (
            <small className="text-danger">{errores.password}</small>
          )}
        </div>

        <button className="btn btn-success" type="submit">
          Iniciar sesión
        </button>

        {mensaje && <div className="alert alert-success mt-3">{mensaje}</div>}

        <p className="mt-3 mb-0 text-center">
          ¿No tienes cuenta?{" "}
          <button
            type="button"
            className="btn btn-link p-0 text-success fw-bold"
            onClick={() => setPagina("registro")}
          >
            Registrarse
          </button>
        </p>
      </form>
    </section>
  );
}

export default Login;