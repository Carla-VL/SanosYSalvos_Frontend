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
    {
      id: 3,
      nombreMascota: "Max",
      tipoMascota: "Perro",
      color: "Café",
      ubicacion: "Ñuñoa",
      tipoReporte: "PERDIDA",
      descripcion: "Fue visto por última vez cerca de una avenida principal.",
      contacto: "+56 9 8765 4321",
    },
  ];

  return (
    <section className="container py-5">
      <div className="text-center mb-5 seccion-encabezado">
        <p className="text-success fw-bold">Reportes</p>
        <h1>Reportes de mascotas</h1>

        <p>
          En esta sección se muestran reportes ingresados por usuarios,
          ciudadanos o instituciones colaboradoras.
        </p>
      </div>

      <div className="row g-4">
        {reportes.map((reporte) => (
          <div className="col-md-4" key={reporte.id}>
            <ReporteCard reporte={reporte} />
          </div>
        ))}
      </div>
    </section>
  );
}

export default Reportes;