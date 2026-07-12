import { useEffect, useState } from "react";
import {
  obtenerUsuarioActual,
  cerrarSesionUsuario,
  obtenerMisMascotas,
  agregarMiMascota,
  eliminarMiMascota,
  registrarMascotaAdopcion,
  obtenerMascotasAdopcionVeterinaria,
  marcarMascotaAdoptada,
} from "../services/api";

function Perfil({ setPagina }) {
  const [usuario, setUsuario] = useState(null);
  const [mascotas, setMascotas] = useState([]);
  const [mascotasAdopcionVet, setMascotasAdopcionVet] = useState([]);

  const [formulario, setFormulario] = useState({
    nombre: "",
    tipo: "",
    raza: "",
    edad: "",
    descripcion: "",
  });

  const [formularioAdopcion, setFormularioAdopcion] = useState({
    nombre: "",
    especie: "",
    raza: "",
    edad: "",
    ubicacion: "",
    contacto: "",
    descripcion: "",
    foto: "",
  });

  const [mensajeAdopcion, setMensajeAdopcion] = useState("");
  const [cargandoAdopcion, setCargandoAdopcion] = useState(false);
  const [cargandoListadoVet, setCargandoListadoVet] = useState(false);

  const DASHBOARD_ADMIN_URL =
    import.meta.env.VITE_DASHBOARD_ADMIN_URL ||
    "https://sanosysalvos-admin-dashboard.netlify.app";
    useEffect(() => {
      
    const usuarioGuardado = obtenerUsuarioActual();
    
    // Validamos qué rol tiene realmente
    const rolLocalStorage = localStorage.getItem("rol");
    const rolUsuario = (
      usuarioGuardado?.rol ||
      rolLocalStorage ||
      "USER"
    ).toUpperCase();

    // Actualizamos el estado del usuario asegurándonos que el rol esté correcto
    if (usuarioGuardado) {
      setUsuario({ ...usuarioGuardado, rol: rolUsuario });
    }

    cargarMascotas();

    if (rolUsuario === "VETERINARIO" || rolUsuario === "VETERINARIA") {
      if (usuarioGuardado?.correo) {
        cargarMascotasAdopcionVeterinaria(usuarioGuardado.correo);
      }
    }
  }, []);

  async function cargarMascotas() {
    const datos = await obtenerMisMascotas();
    setMascotas(datos);
  }

  async function cargarMascotasAdopcionVeterinaria(correoVeterinaria) {
    try {
      setCargandoListadoVet(true);
      const datos = await obtenerMascotasAdopcionVeterinaria(correoVeterinaria);
      setMascotasAdopcionVet(datos);
    } catch (error) {
      console.error(
        "Error cargando mascotas en adopción de la veterinaria:",
        error
      );
    } finally {
      setCargandoListadoVet(false);
    }
  }

  function manejarCambio(evento) {
    setFormulario({
      ...formulario,
      [evento.target.name]: evento.target.value,
    });
  }

  function manejarCambioAdopcion(evento) {
    setFormularioAdopcion({
      ...formularioAdopcion,
      [evento.target.name]: evento.target.value,
    });
  }

  function manejarFotoAdopcion(evento) {
    const archivo = evento.target.files[0];

    if (!archivo) {
      setFormularioAdopcion({
        ...formularioAdopcion,
        foto: "",
      });
      return;
    }

    const reader = new FileReader();

    reader.onloadend = () => {
      setFormularioAdopcion({
        ...formularioAdopcion,
        foto: reader.result,
      });
    };

    reader.readAsDataURL(archivo);
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

  async function manejarRegistrarAdopcion(evento) {
    evento.preventDefault();

    if (
      !formularioAdopcion.nombre.trim() ||
      !formularioAdopcion.especie.trim() ||
      !formularioAdopcion.descripcion.trim()
    ) {
      alert("Debes ingresar al menos nombre, especie y descripción.");
      return;
    }

    const datosParaEnviar = {
      nombre: formularioAdopcion.nombre,
      especie: formularioAdopcion.especie,
      raza: formularioAdopcion.raza,
      edad: Number(formularioAdopcion.edad) || 0,
      ubicacion: formularioAdopcion.ubicacion,
      contacto: formularioAdopcion.contacto || usuario?.correo || "",
      veterinaria: usuario?.nombre || "Veterinaria",
      descripcion: formularioAdopcion.descripcion,
      foto: formularioAdopcion.foto,
      estado: "DISPONIBLE",
    };

    try {
      setCargandoAdopcion(true);
      setMensajeAdopcion("");

      await registrarMascotaAdopcion(datosParaEnviar);

      setFormularioAdopcion({
        nombre: "",
        especie: "",
        raza: "",
        edad: "",
        ubicacion: "",
        contacto: "",
        descripcion: "",
        foto: "",
      });

      setMensajeAdopcion(
        "Mascota registrada correctamente en el apartado de adopción."
      );

      if (usuario?.correo) {
        await cargarMascotasAdopcionVeterinaria(usuario.correo);
      }
    } catch (error) {
      console.error("Error registrando mascota en adopción:", error);
      alert("No se pudo registrar la mascota en adopción.");
    } finally {
      setCargandoAdopcion(false);
    }
  }

  async function manejarMarcarAdoptada(id) {
    const confirmar = confirm("¿Confirmas que esta mascota ya fue adoptada?");

    if (!confirmar) {
      return;
    }

    try {
      await marcarMascotaAdoptada(id);

      if (usuario?.correo) {
        await cargarMascotasAdopcionVeterinaria(usuario.correo);
      }

      alert("Mascota marcada como adoptada.");
    } catch (error) {
      console.error("Error marcando mascota como adoptada:", error);
      alert("No se pudo marcar la mascota como adoptada.");
    }
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

  const esAdmin = usuario.rol === "ADMIN";
  const esVeterinaria = usuario.rol === "VETERINARIO" || usuario.rol === "VETERINARIA";

  function mostrarRol() {
    if (esAdmin) return "Administrador";
    if (esVeterinaria) return "Veterinaria";
    return "Usuario";
  }

  return (
    <section className="perfil-page">
      <div className="perfil-card">
        <p className="seccion-subtitulo">
          {esAdmin
            ? "Cuenta administrador"
            : esVeterinaria
            ? "Cuenta veterinaria"
            : "Mi cuenta"}
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
            <strong>Rol:</strong> {mostrarRol()}
          </p>
        </div>

        {/* El botón del dashboard ahora es EXCLUSIVO del ADMIN */}
        {esAdmin && (
          <button
            className="perfil-boton mb-3"
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

      {esVeterinaria && (
        <div className="perfil-card perfil-adopcion-card">
          <p className="seccion-subtitulo">Gestión veterinaria</p>
          <h2>Registrar mascota en adopción</h2>

          <p className="perfil-texto">
            Completa este formulario para agregar una mascota al apartado de
            adopción.
          </p>

          <form
            className="perfil-formulario"
            onSubmit={manejarRegistrarAdopcion}
          >
            <input
              type="text"
              name="nombre"
              placeholder="Nombre de la mascota"
              value={formularioAdopcion.nombre}
              onChange={manejarCambioAdopcion}
              disabled={cargandoAdopcion}
            />

            <input
              type="text"
              name="especie"
              placeholder="Especie: perro, gato, etc."
              value={formularioAdopcion.especie}
              onChange={manejarCambioAdopcion}
              disabled={cargandoAdopcion}
            />

            <input
              type="text"
              name="raza"
              placeholder="Raza o mestizo"
              value={formularioAdopcion.raza}
              onChange={manejarCambioAdopcion}
              disabled={cargandoAdopcion}
            />

            <input
              type="text"
              name="edad"
              placeholder="Edad aproximada"
              value={formularioAdopcion.edad}
              onChange={manejarCambioAdopcion}
              disabled={cargandoAdopcion}
            />

            <input
              type="text"
              name="ubicacion"
              placeholder="Ubicación"
              value={formularioAdopcion.ubicacion}
              onChange={manejarCambioAdopcion}
              disabled={cargandoAdopcion}
            />

            <input
              type="text"
              name="contacto"
              placeholder="Contacto de la veterinaria"
              value={formularioAdopcion.contacto}
              onChange={manejarCambioAdopcion}
              disabled={cargandoAdopcion}
            />

            <textarea
              name="descripcion"
              placeholder="Descripción de la mascota en adopción"
              value={formularioAdopcion.descripcion}
              onChange={manejarCambioAdopcion}
              disabled={cargandoAdopcion}
            ></textarea>

            <div className="perfil-campo-foto">
              <label>Foto de la mascota</label>

              <input
                type="file"
                accept="image/*"
                onChange={manejarFotoAdopcion}
                disabled={cargandoAdopcion}
              />

              {formularioAdopcion.foto && (
                <img
                  src={formularioAdopcion.foto}
                  alt="Vista previa mascota en adopción"
                  className="preview-foto-mascota"
                />
              )}
            </div>

            <button
              className="perfil-boton"
              type="submit"
              disabled={cargandoAdopcion}
            >
              {cargandoAdopcion
                ? "Registrando..."
                : "Registrar en adopción"}
            </button>
          </form>

          {mensajeAdopcion && (
            <div className="alert alert-success mt-3">{mensajeAdopcion}</div>
          )}

          <div className="mis-mascotas-lista mt-4">
            <h3>Mascotas que tengo en adopción</h3>

            {cargandoListadoVet ? (
              <p className="perfil-texto">Cargando mascotas publicadas...</p>
            ) : mascotasAdopcionVet.length === 0 ? (
              <p className="perfil-texto">
                Aún no tienes mascotas publicadas en adopción.
              </p>
            ) : (
              mascotasAdopcionVet.map((mascota) => (
                <article className="mi-mascota-card" key={mascota.id}>
                  <div>
                    <h3>{mascota.nombre}</h3>

                    <p>
                      <strong>Especie:</strong>{" "}
                      {mascota.especie || "No especificada"}
                    </p>

                    <p>
                      <strong>Raza:</strong>{" "}
                      {mascota.raza || "No especificada"}
                    </p>

                    <p>
                      <strong>Edad:</strong>{" "}
                      {mascota.edad || "No especificada"}
                    </p>

                    <p>
                      <strong>Estado:</strong>{" "}
                      {mascota.estado || "DISPONIBLE"}
                    </p>

                    {mascota.descripcion && (
                      <p className="perfil-texto">{mascota.descripcion}</p>
                    )}
                  </div>

                  <button
                    className="perfil-boton-eliminar"
                    type="button"
                    onClick={() => manejarMarcarAdoptada(mascota.id)}
                  >
                    Marcar adoptada
                  </button>
                </article>
              ))
            )}
          </div>
        </div>
      )}

      {!esVeterinaria && (
        <div className="perfil-card">
          <p className="seccion-subtitulo">Mascotas registradas</p>
          <h2>Mis mascotas</h2>

          <p className="perfil-texto">
            Aquí puedes registrar tus mascotas para tenerlas asociadas a tu
            perfil. Más adelante esta información podrá conectarse con el BFF y
            la base de datos.
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
      )}
    </section>
  );
}

export default Perfil;