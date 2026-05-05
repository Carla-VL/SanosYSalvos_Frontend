function MascotaCard({ mascota }) {
  return (
    <div className="card h-100">
      <div className="card-body">
        <h5 className="card-title text-success">{mascota.nombre}</h5>

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
          <strong>Estado:</strong> {mascota.estado}
        </p>
        <p className="card-text mb-1">
          <strong>Ubicación:</strong> {mascota.ubicacion}
        </p>
      </div>
    </div>
  );
}

export default MascotaCard;