function Carrusel({ setPagina }) {
  return (
    <div id="carruselSanos" className="carousel slide" data-bs-ride="carousel">
      <div className="carousel-inner">
        <div className="carousel-item active">
          <img
            src="/template/images/bg_1.jpg"
            className="d-block w-100 carousel-imagen"
            alt="Mascotas"
          />

          <div className="carousel-caption carousel-texto">
            <h1 className="fw-bold">
              Ayudamos a que las mascotas vuelvan a casa
            </h1>

            <p>
              Centralizamos reportes de mascotas perdidas y encontradas para
              facilitar su búsqueda.
            </p>

            <button
              className="btn btn-success me-2"
              onClick={() => setPagina("reportar")}
            >
              Reportar mascota
            </button>

            <button
              className="btn btn-light"
              onClick={() => setPagina("mascotas")}
            >
              Ver mascotas
            </button>
          </div>
        </div>

        <div className="carousel-item">
          <img
            src="/template/images/bg_2.jpg"
            className="d-block w-100 carousel-imagen"
            alt="Búsqueda de mascotas"
          />

          <div className="carousel-caption carousel-texto">
            <h1 className="fw-bold">Reportes organizados en un solo lugar</h1>

            <p>
              Dueños, ciudadanos, refugios, clínicas veterinarias y
              municipalidades pueden colaborar desde una misma plataforma.
            </p>

            <button
              className="btn btn-success"
              onClick={() => setPagina("reportes")}
            >
              Ver reportes
            </button>
          </div>
        </div>

        <div className="carousel-item">
          <img
            src="/template/images/bg_3.jpg"
            className="d-block w-100 carousel-imagen"
            alt="Colaboración"
          />

          <div className="carousel-caption carousel-texto">
            <h1 className="fw-bold">Una red de apoyo para mascotas</h1>

            <p>
              La plataforma permite ordenar la información y apoyar la búsqueda
              de mascotas extraviadas.
            </p>

            <button
              className="btn btn-success"
              onClick={() => setPagina("reportar")}
            >
              Crear reporte
            </button>
          </div>
        </div>
      </div>

      <button
        className="carousel-control-prev"
        type="button"
        data-bs-target="#carruselSanos"
        data-bs-slide="prev"
      >
        <span className="carousel-control-prev-icon"></span>
      </button>

      <button
        className="carousel-control-next"
        type="button"
        data-bs-target="#carruselSanos"
        data-bs-slide="next"
      >
        <span className="carousel-control-next-icon"></span>
      </button>
    </div>
  );
}

export default Carrusel;