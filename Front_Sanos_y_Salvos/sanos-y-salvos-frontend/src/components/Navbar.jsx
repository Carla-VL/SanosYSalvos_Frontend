function Navbar({ setPagina }) {
  return (
    <nav className="navbar navbar-expand-lg bg-success navbar-dark">
      <div className="container">
        <span className="navbar-brand fw-bold">Sanos y Salvos</span>

        <div className="d-flex gap-2">
          <button
            className="btn btn-light btn-sm"
            onClick={() => setPagina("inicio")}
          >
            Inicio
          </button>

          <button
            className="btn btn-light btn-sm"
            onClick={() => setPagina("mascotas")}
          >
            Mascotas
          </button>

          <button
            className="btn btn-light btn-sm"
            onClick={() => setPagina("reportar")}
          >
            Reportar
          </button>

          <button
            className="btn btn-light btn-sm"
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