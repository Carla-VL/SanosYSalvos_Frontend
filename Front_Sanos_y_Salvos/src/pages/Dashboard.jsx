import { obtenerUsuarioActual } from "../services/api";

function Dashboard({ setPagina }) {
  const usuario = obtenerUsuarioActual();

  if (!usuario) {
    return (
      <section className="dashboard-page">
        <div className="dashboard-card">
          <p className="seccion-subtitulo">Acceso requerido</p>
          <h1>No hay sesión iniciada</h1>
          <p>Para ingresar al dashboard, primero debes iniciar sesión.</p>

          <button
            className="dashboard-boton"
            type="button"
            onClick={() => setPagina("login")}
          >
            Ir a iniciar sesión
          </button>
        </div>
      </section>
    );
  }

  return (
    <section className="dashboard-page">
      <div className="dashboard-header">
        <p className="seccion-subtitulo">Panel principal</p>
        <h1>Bienvenido/a, {usuario.nombre || "Usuario"}</h1>
        <p>
          Desde este panel puedes acceder rápidamente a las funciones principales
          de Sanos y Salvos.
        </p>
      </div>

      <div className="dashboard-grid">
        <article className="dashboard-card">
          <div className="dashboard-icono">
            <i className="bi bi-person-circle"></i>
          </div>

          <h2>Mi perfil</h2>
          <p>Revisa tus datos de usuario y administra tus mascotas registradas.</p>

          <button
            className="dashboard-boton"
            type="button"
            onClick={() => setPagina("perfil")}
          >
            Ver perfil
          </button>
        </article>

        <article className="dashboard-card">
          <div className="dashboard-icono">
            <i className="bi bi-plus-circle"></i>
          </div>

          <h2>Reportar mascota</h2>
          <p>Publica una mascota perdida o encontrada dentro de la plataforma.</p>

          <button
            className="dashboard-boton"
            type="button"
            onClick={() => setPagina("reportar")}
          >
            Crear reporte
          </button>
        </article>

        <article className="dashboard-card">
          <div className="dashboard-icono">
            <i className="bi bi-card-list"></i>
          </div>

          <h2>Reportes</h2>
          <p>Revisa las mascotas reportadas como perdidas o encontradas.</p>

          <button
            className="dashboard-boton"
            type="button"
            onClick={() => setPagina("reportes")}
          >
            Ver reportes
          </button>
        </article>

        <article className="dashboard-card">
          <div className="dashboard-icono">
            <i className="bi bi-heart-fill"></i>
          </div>

          <h2>Adopción</h2>
          <p>Conoce mascotas disponibles en fundaciones, rescates o refugios.</p>

          <button
            className="dashboard-boton"
            type="button"
            onClick={() => setPagina("adopcion")}
          >
            Ver adopciones
          </button>
        </article>
      </div>
    </section>
  );
}

export default Dashboard;