function Navbar({ setPagina }) {
  return (
    <nav className="navbar navbar-expand-lg bg-white navbar-light shadow-sm">
      <div className="container">
        <span className="navbar-brand fw-bold text-success fs-4">
          🐾 Sanos y Salvos
        </span>

        <div className="d-flex gap-2 flex-wrap">
          <button
            className="btn btn-outline-success btn-sm"
            onClick={() => setPagina("inicio")}
          >
            Inicio
          </button>

          <button
            className="btn btn-outline-success btn-sm"
            onClick={() => setPagina("mascotas")}
          >
            Mascotas
          </button>

          <button
            className="btn btn-success btn-sm"
            onClick={() => setPagina("reportar")}
          >
            Reportar
          </button>

          <button
            className="btn btn-outline-success btn-sm"
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