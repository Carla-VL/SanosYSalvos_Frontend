function Servicios({ setPagina }) {
  return (
    <section className="servicios-section reveal">
      <div className="container">
        <div className="text-center mb-5">
          <p className="text-success fw-bold">Funciones principales</p>
          <h2>¿Cómo ayuda Sanos y Salvos?</h2>

          <p>
            La plataforma permite reportar, buscar y colaborar en la recuperación
            de mascotas perdidas.
          </p>
        </div>

        <div className="row g-4">
          <div className="col-md-4">
            <div className="servicio-card">
              <div className="servicio-icono">🐶</div>

              <h4>Reportar mascota</h4>

              <p>
                Permite registrar una mascota perdida o encontrada con datos
                como ubicación, color, descripción y contacto.
              </p>

              <button
                className="servicio-boton"
                onClick={() => setPagina("reportar")}
              >
                →
              </button>
            </div>
          </div>

          <div className="col-md-4">
            <div className="servicio-card">
              <div className="servicio-icono">🔎</div>

              <h4>Buscar mascotas</h4>

              <p>
                Ayuda a revisar mascotas registradas y reportes disponibles en
                la plataforma.
              </p>

              <button
                className="servicio-boton"
                onClick={() => setPagina("mascotas")}
              >
                →
              </button>
            </div>
          </div>

          <div className="col-md-4">
            <div className="servicio-card">
              <div className="servicio-icono">🤝</div>

              <h4>Colaborar</h4>

              <p>
                Facilita la colaboración entre ciudadanos, refugios, clínicas
                veterinarias y municipalidades.
              </p>

              <button
                className="servicio-boton"
                onClick={() => setPagina("reportes")}
              >
                →
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Servicios;