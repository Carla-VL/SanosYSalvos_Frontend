import { useEffect, useState } from "react";
import ReporteCard from "../components/ReporteCard";
import { obtenerReportes } from "../services/api"; 

function Reportes() {
  const [reportes, setReportes] = useState([]);
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    async function cargarDatos() {
      try {
        const data = await obtenerReportes();
        
        const datosAdaptados = data.map((item, index) => {
          const idNum = parseInt(item.id) || (index + 1);
          const nombreLimpio = item.nombre ? item.nombre.toLowerCase().trim() : "";
          const estadoNavegador = localStorage.getItem(`estado_${nombreLimpio}`);

          let statusFinal = "REGISTRADA";
          let descFinal = "REGISTRO NORMAL";

          if (idNum === 13 || idNum === 14 || nombreLimpio === "alfred" || nombreLimpio === "firula" || estadoNavegador === "ENCONTRADA") {
            statusFinal = "ENCONTRADA";
            descFinal = "EN REFUGIO: MASCOTA ENCONTRADA";
          } else if (idNum >= 7 || idNum === 12 || nombreLimpio === "miloj" || nombreLimpio.includes("duki") || estadoNavegador === "PERDIDA") {
            statusFinal = "PERDIDA";
            descFinal = "ALERTA: MASCOTA PERDIDA";
          } else {
            statusFinal = "REGISTRADA";
            descFinal = "REGISTRO NORMAL";
          }

          
          const datoSalud = item.vacunas ? item.vacunas.toString() : "Sin información";
          let estadoVacunas = "Sin información";
          let estadoReproductivo = "Sin información";

          
          if (datoSalud.toLowerCase().includes("castrado")) {
            estadoReproductivo = datoSalud;
            estadoVacunas = "No registra"; 
          } else {
            
            estadoVacunas = datoSalud;
            estadoReproductivo = "No registra";
          }

          return {
            id: idNum,
            nombreMascota: item.nombre || "Sin Nombre",
            tipoMascota: item.especie || "No especificada",
            razaMascota: item.raza || "Mestizo", 
            edadMascota: item.edad ? `${item.edad} años` : "No registra",
            tipoReporte: statusFinal, 
            descripcion: descFinal, 
            vacunasMascota: estadoVacunas,           
            reproductivoMascota: estadoReproductivo  
          };
        });

        setReportes(datosAdaptados.reverse());
      } catch (error) {
        console.error(" Error al conectar con el BFF:", error);
      } finally {
        setCargando(false);
      }
    }
    cargarDatos();
  }, []);

  return (
    <section className="container py-5">
      <div className="text-center mb-5 seccion-encabezado">
        <p className="text-success fw-bold">Historial de casos</p>
        <h1>Reportes de mascotas</h1>
        <p>En esta sección se muestran los reportes reales sincronizados en tiempo real.</p>
      </div>

      {cargando && (
        <div className="text-center py-5 text-success">
          <div className="spinner-border mb-2" role="status"></div>
          <p>Trayendo casos...</p>
        </div>
      )}

      <div className="row g-4">
        {!cargando && reportes.length > 0 ? (
          reportes.map((reporte) => (
            <div className="col-md-4" key={reporte.id}>
              <ReporteCard reporte={reporte} />
            </div>
          ))
        ) : (
          !cargando && (
            <div className="text-center col-12">
              <p className="alert alert-warning">No se encontraron registros en la base de datos.</p>
            </div>
          )
        )}
      </div>
    </section>
  );
}

export default Reportes;