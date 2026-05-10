function MascotaCard({ mascota }) {
  const claseEstado =
    mascota.estado === "Perdida"
      ? "badge bg-warning text-dark estado-badge"
      : "badge bg-success estado-badge";

  return (
    <div className="card h-100 shadow-sm border-0">
      <img
        src={mascota.imagen}
        className="card-img-top card-img-mascota"
        alt={mascota.nombre}
      />

      <div className="card-body">
        <div className="d-flex justify-content-between align-items-center mb-2">
          <h5 className="card-title text-success mb-0">{mascota.nombre}</h5>
          <span className={claseEstado}>{mascota.estado}</span>
        </div>

        <p className="card-text mb-1">
          <strong>Tipo:</strong> {mascota.tipo}
        </p>

        <p className="card-text mb-1">
          <strong>Raza:</strong> {mascota.raza}
        </p>

        <p className="card-text mb-1">
          <strong>Color:</strong> {mascota.color}
        </p>

        <p className="card-text mb-1">
          <strong>Ubicación:</strong> {mascota.ubicacion}
        </p>
      </div>
    </div>
  );
}

export default MascotaCard;