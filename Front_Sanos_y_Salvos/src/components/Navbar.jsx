import { useState } from "react";

function Navbar({ setPagina, pagina }) {
  const [menuAbierto, setMenuAbierto] = useState(false);

  const usuarioLogueado = !!localStorage.getItem("token");
  const usuario = JSON.parse(localStorage.getItem("usuario")) || {};
  const rol = usuario?.rol || "USER";
  const esAdmin = usuarioLogueado && rol === "ADMIN";

  function claseBoton(nombrePagina) {
    return pagina === nombrePagina
      ? "nav-link-custom nav-link-activo"
      : "nav-link-custom";
  }

  function cambiarPagina(nombrePagina) {
    setPagina(nombrePagina);
    setMenuAbierto(false);

    setTimeout(() => {
      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });
    }, 50);
  }

  return (
    <nav className="navbar-principal">
      <div className="container navbar-contenido">
        <button
          className="navbar-logo"
          type="button"
          onClick={() => cambiarPagina("inicio")}
          aria-label="Ir al inicio"
        >
          <span className="logo-icono">
            <i className="bi bi-heart-pulse-fill"></i>
          </span>
          <span>Sanos y Salvos</span>
        </button>

        <button
          className="navbar-toggle"
          type="button"
          onClick={() => setMenuAbierto(!menuAbierto)}
          aria-label="Abrir menú"
        >
          <i className={menuAbierto ? "bi bi-x-lg" : "bi bi-list"}></i>
        </button>

        <div className={menuAbierto ? "navbar-menu abierto" : "navbar-menu"}>
          <button
            className={claseBoton("inicio")}
            type="button"
            onClick={() => cambiarPagina("inicio")}
          >
            Inicio
          </button>

          <button
            className={claseBoton("mascotas")}
            type="button"
            onClick={() => cambiarPagina("mascotas")}
          >
            Mascotas
          </button>

          <button
            className={claseBoton("reportar")}
            type="button"
            onClick={() => cambiarPagina("reportar")}
          >
            Reportar
          </button>

          <button
            className={claseBoton("reportes")}
            type="button"
            onClick={() => cambiarPagina("reportes")}
          >
            Reportes
          </button>

          <button
            className={claseBoton("mapa")}
            type="button"
            onClick={() => cambiarPagina("mapa")}
          >
            Mapa
          </button>

          <button
            className={claseBoton("adopcion")}
            type="button"
            onClick={() => cambiarPagina("adopcion")}
          >
            Adopción
          </button>

          {usuarioLogueado ? (
            <>
              

              <button
                className={claseBoton("perfil")}
                type="button"
                onClick={() => cambiarPagina("perfil")}
              >
                Perfil
              </button>
            </>
          ) : (
            <>
              <button
                className={claseBoton("login")}
                type="button"
                onClick={() => cambiarPagina("login")}
              >
                Iniciar sesión
              </button>

              <button
                className={claseBoton("registro")}
                type="button"
                onClick={() => cambiarPagina("registro")}
              >
                Registrarse
              </button>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}

export default Navbar;