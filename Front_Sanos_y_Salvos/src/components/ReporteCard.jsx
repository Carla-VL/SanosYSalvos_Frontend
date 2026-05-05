function ReporteCard({ reporte }) {
  return (
    <div className="card h-100">
      <div className="card-body">
        <h5 className="card-title text-success">{reporte.nombreMascota}</h5>

        <p className="card-text mb-1">
          <strong>Tipo:</strong> {reporte.tipoMascota}
        </p>
        <p className="card-text mb-1">
          <strong>Reporte:</strong> {reporte.tipoReporte}
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
        <p className="card-text mb-1">
          <strong>Contacto:</strong> {reporte.contacto}
        </p>
      </div>
    </div>
  );
}

export default ReporteCard;