function ReporteCard({ reporte }) {
  if (!reporte) return null;

  const claseBadge = reporte.tipoReporte === "ENCONTRADA" ? "bg-success" : 
                     reporte.tipoReporte === "PERDIDA" ? "bg-warning text-dark" : "bg-secondary";
                     
  const textStatusClass = reporte.tipoReporte === "ENCONTRADA" ? "text-success fw-bold" : 
                          reporte.tipoReporte === "PERDIDA" ? "text-danger fw-bold" : "text-muted";

  return (
    <div className="card h-100 shadow-sm border-0 card-reporte">
      <div className="card-body">
        <div className="d-flex justify-content-between align-items-center mb-3">
          <h5 className="card-title fw-bold text-success mb-0">{reporte.nombreMascota}</h5>
          <span className={`badge ${claseBadge}`}>{reporte.tipoReporte}</span>
        </div>

        <div className="card-text text-muted small">
          <p className="mb-1">
            <strong>Tipo:</strong> <span className="text-dark">{reporte.tipoMascota}</span>
          </p>
          <p className="mb-1">
            <strong>Raza:</strong> <span className="text-dark">{reporte.razaMascota}</span>
          </p>
          <p className="mb-1">
            <strong>Edad:</strong> <span className="text-dark">{reporte.edadMascota}</span>
          </p>
          
          {}
          <p className="mb-1">
            <strong>Reproductivo:</strong> <span className="text-dark">{reporte.reproductivoMascota}</span>
          </p>
          
          {}
          <p className="mb-1">
            <strong>Vacunas:</strong> <span className="text-dark">{reporte.vacunasMascota}</span>
          </p>
          
          <p className="mb-0 mt-2">
            <strong>Estado Reporte:</strong> <span className={textStatusClass}>{reporte.descripcion}</span>
          </p>
        </div>

        <div className="mt-3 pt-3 border-top d-flex justify-content-between align-items-center">
          <span className="text-muted small">ID Registro:</span>
          <span className="badge bg-light text-dark">#{reporte.id}</span>
        </div>
      </div>
    </div>
  );
}

export default ReporteCard;