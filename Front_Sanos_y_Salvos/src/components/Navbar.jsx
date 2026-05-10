function Navbar({ setPagina, pagina }) {
  function claseBoton(nombrePagina) {
    return pagina === nombrePagina
      ? "nav-link-custom nav-link-activo"
      : "nav-link-custom";
  }

  return (
    <nav className="navbar-principal">
      <div className="container navbar-contenido">
        <button
          className="navbar-logo"
          onClick={() => setPagina("inicio")}
        >
          <span className="logo-icono">
            <i className="flaticon-pawprint"></i>
          </span>
          <span>Sanos y Salvos</span>
        </button>

        <div className="navbar-menu">
          <button
            className={claseBoton("inicio")}
            onClick={() => setPagina("inicio")}
          >
            Inicio
          </button>

          <button
            className={claseBoton("mascotas")}
            onClick={() => setPagina("mascotas")}
          >
            Mascotas
          </button>

          <button
            className={claseBoton("reportar")}
            onClick={() => setPagina("reportar")}
          >
            Reportar
          </button>

          <button
            className={claseBoton("reportes")}
            onClick={() => setPagina("reportes")}
          >
            Reportes
          </button>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;