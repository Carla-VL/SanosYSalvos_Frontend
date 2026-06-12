import { useEffect, useState } from "react";
import {
  obtenerUsuarioActual,
  cerrarSesionUsuario,
  obtenerMisMascotas,
  agregarMiMascota,
  eliminarMiMascota,
} from "../services/api";

function Perfil({ setPagina }) {
  const [usuario, setUsuario] = useState(null);
  const [mascotas, setMascotas] = useState([]);
  const [formulario, setFormulario] = useState({
    nombre: "",
    tipo: "",
    raza: "",
    edad: "",
    descripcion: "",
  });

  const DASHBOARD_ADMIN_URL = "http://localhost:3000/index.html"; 

  useEffect(() => {
    const usuarioGuardado = obtenerUsuarioActual();
    setUsuario(usuarioGuardado);
    cargarMascotas();
  }, []);

  async function cargarMascotas() {
    const datos = await obtenerMisMascotas();
    setMascotas(datos);
  }

  function manejarCambio(evento) {
    setFormulario({
      ...formulario,
      [evento.target.name]: evento.target.value,
    });
  }

  async function manejarAgregarMascota(evento) {
    evento.preventDefault();

    if (!formulario.nombre.trim() || !formulario.tipo.trim()) {
      alert("Debes ingresar al menos el nombre y el tipo de mascota.");
      return;
    }

    await agregarMiMascota(formulario);

    setFormulario({
      nombre: "",
      tipo: "",
      raza: "",
      edad: "",
      descripcion: "",
    });

    cargarMascotas();
  }

  async function manejarEliminarMascota(id) {
    const confirmar = confirm("¿Seguro que quieres quitar esta mascota?");

    if (!confirmar) {
      return;
    }

    await eliminarMiMascota(id);
    cargarMascotas();
  }

  function cerrarSesion() {
    cerrarSesionUsuario();
    setPagina("inicio");

    setTimeout(() => {
      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });
    }, 50);
  }

  function irAlDashboardAdmin() {
    window.location.href = DASHBOARD_ADMIN_URL;
  }

  if (!usuario) {
    return (
      <section className="perfil-page">
        <div className="perfil-card">
          <p className="seccion-subtitulo">Perfil</p>
          <h1>No hay sesión iniciada</h1>
          <p>Para ver tu perfil, primero debes iniciar sesión.</p>

          <button
            className="perfil-boton"
            type="button"
            onClick={() => setPagina("login")}
          >
            Ir a iniciar sesión
          </button>
        </div>
      </section>
    );
  }

  const rolUsuario = (usuario.rol || "USER").toUpperCase();
  const esAdmin = rolUsuario === "ADMIN";

  return (
    <section className="perfil-page">
      <div className="perfil-card">
        <p className="seccion-subtitulo">
          {esAdmin ? "Cuenta administrador" : "Mi cuenta"}
        </p>

        <h1>Mi perfil</h1>

        <div className="perfil-datos">
          <p>
            <strong>Nombre:</strong> {usuario.nombre || "Usuario"}
          </p>

          <p>
            <strong>Correo:</strong> {usuario.correo || "No registrado"}
          </p>

          <p>
            <strong>Rol:</strong>{" "}
            {esAdmin ? "Administrador" : "Usuario"}
          </p>
        </div>

        {esAdmin && (
          <button
            className="perfil-boton"
            type="button"
            onClick={irAlDashboardAdmin}
          >
            Ir al dashboard administrativo
          </button>
        )}

        <button
          className="perfil-boton perfil-boton-secundario"
          type="button"
          onClick={cerrarSesion}
        >
          Cerrar sesión
        </button>
      </div>

      <div className="perfil-card">
        <p className="seccion-subtitulo">Mascotas registradas</p>
        <h2>Mis mascotas</h2>

        <p className="perfil-texto">
          Aquí puedes registrar tus mascotas para tenerlas asociadas a tu perfil.
          Más adelante esta información podrá conectarse con el BFF y la base de
          datos.
        </p>

        <form className="perfil-formulario" onSubmit={manejarAgregarMascota}>
          <input
            type="text"
            name="nombre"
            placeholder="Nombre de la mascota"
            value={formulario.nombre}
            onChange={manejarCambio}
          />

          <input
            type="text"
            name="tipo"
            placeholder="Tipo: perro, gato, etc."
            value={formulario.tipo}
            onChange={manejarCambio}
          />

          <input
            type="text"
            name="raza"
            placeholder="Raza o mestizo"
            value={formulario.raza}
            onChange={manejarCambio}
          />

          <input
            type="text"
            name="edad"
            placeholder="Edad aproximada"
            value={formulario.edad}
            onChange={manejarCambio}
          />

          <textarea
            name="descripcion"
            placeholder="Descripción breve"
            value={formulario.descripcion}
            onChange={manejarCambio}
          ></textarea>

          <button className="perfil-boton" type="submit">
            Añadir mascota
          </button>
        </form>

        <div className="mis-mascotas-lista">
          {mascotas.length === 0 ? (
            <p className="perfil-texto">
              Aún no tienes mascotas registradas en tu perfil.
            </p>
          ) : (
            mascotas.map((mascota) => (
              <article className="mi-mascota-card" key={mascota.id}>
                <div>
                  <h3>{mascota.nombre}</h3>

                  <p>
                    <strong>Tipo:</strong> {mascota.tipo}
                  </p>

                  <p>
                    <strong>Raza:</strong>{" "}
                    {mascota.raza || "No especificada"}
                  </p>

                  <p>
                    <strong>Edad:</strong>{" "}
                    {mascota.edad || "No especificada"}
                  </p>

                  {mascota.descripcion && (
                    <p className="perfil-texto">{mascota.descripcion}</p>
                  )}
                </div>

                <button
                  className="perfil-boton-eliminar"
                  type="button"
                  onClick={() => manejarEliminarMascota(mascota.id)}
                >
                  Quitar
                </button>
              </article>
            ))
          )}
        </div>
      </div>
    </section>
  );
}

export default Perfil;