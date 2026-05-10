function ReporteCard({ reporte }) {
  const claseEstado =
    reporte.tipoReporte === "PERDIDA"
      ? "badge bg-warning text-dark estado-badge"
      : "badge bg-success estado-badge";

  return (
    <div className="card card-reporte shadow-sm border-0">
      <div className="card-body">
        <div className="d-flex justify-content-between align-items-center mb-2">
          <h5 className="card-title text-success mb-0">
            {reporte.nombreMascota}
          </h5>

          <span className={claseEstado}>{reporte.tipoReporte}</span>
        </div>

        <p className="card-text mb-1">
          <strong>Tipo:</strong> {reporte.tipoMascota}
        </p>

        <p className="card-text mb-1">
          <strong>Color:</strong> {reporte.color}
        </p>

        <p className="card-text mb-1">
          <strong>Ubicación:</strong> {reporte.ubicacion}
        </p>

        <p className="card-text mb-1">
          <strong>Descripción:</strong> {reporte.descripcion}
        </p>

        <p className="card-text mb-0">
          <strong>Contacto:</strong> {reporte.contacto}
        </p>
      </div>
    </div>
  );
}

export default ReporteCard;