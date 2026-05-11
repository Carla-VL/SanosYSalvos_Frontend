function MascotaCard({ mascota }) {

  const estadoMascota = mascota.estado || "Al día";

  const claseEstado =
    estadoMascota === "Perdida"
      ? "badge bg-warning text-dark estado-badge"
      : "badge bg-success estado-badge";

  const imagenMascota = mascota.imagen || "https://images.unsplash.com/photo-1543466835-00a7907e9de1?q=80&w=500";

  return (
    <div className="card h-100 shadow-sm border-0">
      <img
        src={imagenMascota}
        className="card-img-top card-img-mascota"
        alt={mascota.nombre}
        style={{ height: "200px", objectFit: "cover" }} 
      />

      <div className="card-body">
        <div className="d-flex justify-content-between align-items-center mb-2">
          <h5 className="card-title text-success mb-0">{mascota.nombre}</h5>
          <span className={claseEstado}>{estadoMascota}</span>
        </div>

        {}
        <p className="card-text mb-1">
          <strong>Especie:</strong> {mascota.especie}
        </p>

        <p className="card-text mb-1">
          <strong>Raza:</strong> {mascota.raza}
        </p>

        {}
        <p className="card-text mb-1">
          <strong>Edad:</strong> {mascota.edad ? `${mascota.edad} años` : "No especificada"}
        </p>

        {}
        <p className="card-text mb-1">
          <strong>Vacunas:</strong> {mascota.vacunas}
        </p>
      </div>
    </div>
  );
}

export default MascotaCard;