import { useEffect, useState } from 'react';
import MascotaCard from "../components/MascotaCard";
import { obtenerMascotas } from '../services/api';

function Mascotas() {
  const [mascotas, setMascotas] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [errorPeticion, setErrorPeticion] = useState(null);

  useEffect(() => {
    async function cargarDatos() {
      console.log(" [DEBUG] Intentando conectar con el BFF en el puerto 8085...");
      try {
        const data = await obtenerMascotas();
        console.log(" [DEBUG] Datos recibidos con éxito desde el BFF:", data);
        setMascotas(data);
      } catch (error) {
        console.error(" [DEBUG] La petición al BFF falló:", error);
        setErrorPeticion(error.message);
      } finally {
        setCargando(false);
      }
    }
    cargarDatos();
  }, []);

  return (
    
    <section className="container py-5"> 
      <div className="text-center mb-5 seccion-encabezado">
        <p className="text-success fw-bold">Mascotas</p>
        <h1>Mascotas registradas</h1>
        <p>
          Aquí se muestran las mascotas reales rescatadas desde tu base de datos a través del BFF.
        </p>
      </div>

      {}
      {cargando && (
        <div className="text-center py-5 text-success">
          <h4>⏳ Conectando con el BFF... Buscando peluditos...</h4>
        </div>
      )}

      {}
      {errorPeticion && (
        <div className="alert alert-danger text-center mx-auto" style={{maxWidth: '500px'}}>
          <strong>¡Ups! Algo salió mal:</strong> {errorPeticion} <br />
          <small>Revisa si el micro de Mascotas (8080) y el BFF (8085) están encendidos.</small>
        </div>
      )}

      {}
      {!cargando && !errorPeticion && (
        <div className="row g-4">
          {mascotas.length === 0 ? (
            <div className="text-center col-12">
              <p className="alert alert-warning">El backend respondió, pero no tienes ninguna mascota registrada en la base de datos.</p>
            </div>
          ) : (
            mascotas.map((mascota, index) => (
              <div className="col-md-4" key={mascota.id || index}>
                <MascotaCard mascota={mascota} />
              </div>
            ))
          )}
        </div>
      )}
    </section>
  );
}

export default Mascotas;