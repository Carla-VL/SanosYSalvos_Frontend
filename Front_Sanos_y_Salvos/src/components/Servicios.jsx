function Servicios({ setPagina }) {
  return (
   <section className="container py-5 reveal">
      <div className="text-center mb-4">
        <p className="text-success fw-bold">Funciones principales</p>
        <h2>¿Cómo ayuda Sanos y Salvos?</h2>

        <p>
          La plataforma permite reportar, buscar y colaborar en la recuperación
          de mascotas perdidas.
        </p>
      </div>

      <div className="row g-4">
        <div className="col-md-4">
          <div className="card h-100 shadow-sm border-0 text-center">
            <div className="card-body">
              <h1>🐶</h1>
              <h5 className="text-success">Reportar mascota</h5>

              <p>
                Permite registrar una mascota perdida o encontrada con datos
                como ubicación, color, descripción y contacto.
              </p>

              <button
                className="btn btn-outline-success btn-sm"
                onClick={() => setPagina("reportar")}
              >
                Ir a reportar
              </button>
            </div>
          </div>
        </div>

        <div className="col-md-4">
          <div className="card h-100 shadow-sm border-0 text-center">
            <div className="card-body">
              <h1>🔎</h1>
              <h5 className="text-success">Buscar mascotas</h5>

              <p>
                Ayuda a revisar mascotas registradas y reportes disponibles en
                la plataforma.
              </p>

              <button
                className="btn btn-outline-success btn-sm"
                onClick={() => setPagina("mascotas")}
              >
                Ver mascotas
              </button>
            </div>
          </div>
        </div>

        <div className="col-md-4">
          <div className="card h-100 shadow-sm border-0 text-center">
            <div className="card-body">
              <h1>🤝</h1>
              <h5 className="text-success">Colaborar</h5>

              <p>
                Facilita la colaboración entre ciudadanos, refugios, clínicas
                veterinarias y municipalidades.
              </p>

              <button
                className="btn btn-outline-success btn-sm"
                onClick={() => setPagina("reportes")}
              >
                Ver reportes
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Servicios;