function Inicio({ setPagina }) {
  return (
    <section className="container mt-4">
      <div className="p-4 bg-light rounded border">
        <h1 className="text-success fw-bold">Sanos y Salvos</h1>

        <p className="mt-3">
          Plataforma para apoyar la localización y recuperación de mascotas
          perdidas o encontradas.
        </p>

        <p>
          El objetivo es centralizar los reportes para que dueños, ciudadanos,
          refugios, clínicas veterinarias y municipalidades puedan colaborar de
          forma más ordenada.
        </p>

        <button
          className="btn btn-success me-2"
          onClick={() => setPagina("reportar")}
        >
          Reportar mascota
        </button>

        <button
          className="btn btn-outline-success"
          onClick={() => setPagina("mascotas")}
        >
          Ver mascotas
        </button>
      </div>
    </section>
  );
}

export default Inicio;