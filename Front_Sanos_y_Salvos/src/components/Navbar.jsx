function Navbar({ setPagina, pagina }) {
  function claseBoton(nombrePagina) {
    return pagina === nombrePagina
      ? "btn btn-success btn-sm nav-boton"
      : "btn btn-outline-success btn-sm nav-boton";
  }

  return (
    <nav className="navbar navbar-expand-lg bg-white navbar-light shadow-sm sticky-top">
      <div className="container">
        <button
          className="navbar-brand fw-bold text-success fs-4 btn btn-link text-decoration-none p-0"
          onClick={() => setPagina("inicio")}
        >
          🐾 Sanos y Salvos
        </button>

        <div className="d-flex gap-2 flex-wrap">
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