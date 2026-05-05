import ReporteCard from "../components/ReporteCard";

function Reportes() {
  const reportes = [
    {
      id: 1,
      nombreMascota: "Luna",
      tipoMascota: "Perro",
      color: "Blanco con café",
      ubicacion: "Maipú",
      tipoReporte: "PERDIDA",
      descripcion: "Se perdió cerca de una plaza. Usa collar rojo.",
      contacto: "contacto@correo.cl",
    },
    {
      id: 2,
      nombreMascota: "Sin identificar",
      tipoMascota: "Gato",
      color: "Gris",
      ubicacion: "Santiago Centro",
      tipoReporte: "ENCONTRADA",
      descripcion: "Fue visto cerca de una clínica veterinaria.",
      contacto: "+56 9 1234 5678",
    },
  ];

  return (
    <section className="container mt-4">
      <h1 className="text-success">Reportes de mascotas</h1>

      <p>Aquí se muestran los reportes ingresados en la plataforma.</p>

      <div className="row g-3">
        {reportes.map((reporte) => (
          <div className="col-md-6" key={reporte.id}>
            <ReporteCard reporte={reporte} />
          </div>
        ))}
      </div>
    </section>
  );
}

export default Reportes;