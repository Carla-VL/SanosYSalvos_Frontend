import { useState } from "react";
import { login } from "../services/api"; // Importamos tu función real

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

  async function manejarLogin(evento) {
    evento.preventDefault();

    const validaciones = validarFormulario();
    setErrores(validaciones);
    setMensaje("");

    if (Object.keys(validaciones).length > 0) {
      return;
    }

    setCargando(true);
    console.log(" Enviando credenciales al microservicio de Auth (8081)...");

    try {
     
      const data = await login(formulario.correo, formulario.password);
      
      if (data && data.token) {
        setMensaje("¡Acceso concedido! Entrando a Sanos y Salvos... ");
        
        
        setTimeout(() => {
          setPagina("inicio"); 
        }, 1500);
      } else {
       
        setErrores({ global: "Correo o contraseña incorrectos." });
      }

    } catch (error) {
      console.error(" Error conectando al Login:", error);
      setErrores({ global: "El servidor de autenticación (8081) no responde." });
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

      <form className="card shadow-sm border-0 p-4 formulario-reporte" onSubmit={manejarLogin}>
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
            disabled={cargando}
          />
          {errores.password && <small className="text-danger">{errores.password}</small>}
        </div>

        {errores.global && <div className="alert alert-danger p-2 mb-3">{errores.global}</div>}

        <button className="btn btn-success w-100 mb-3" type="submit" disabled={cargando}>
          {cargando ? "Validando..." : "Iniciar sesión"}
        </button>

        {mensaje && <div className="alert alert-success mt-3">{mensaje}</div>}

        <p className="mt-3 mb-0 text-center">
          ¿No tienes cuenta?{" "}
          <button type="button" className="btn btn-link p-0 text-success fw-bold" onClick={() => setPagina("registro")}>
            Registrarse
          </button>
        </p>
      </form>
    </section>
  );
}

export default Login;