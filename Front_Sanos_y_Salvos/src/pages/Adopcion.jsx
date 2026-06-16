import { useEffect, useState } from "react";
import { obtenerMascotasAdopcion } from "../services/api";

function Adopcion() {
  const [mascotas, setMascotas] = useState([]);
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    cargarMascotasAdopcion();
  }, []);

  async function cargarMascotasAdopcion() {
    try {
      const datos = await obtenerMascotasAdopcion();
      setMascotas(datos);
    } catch (error) {
      console.error("Error al cargar mascotas en adopción:", error);
    } finally {
      setCargando(false);
    }
  }

  if (cargando) {
    return (
      <section className="adopcion-page">
        <p className="seccion-subtitulo">Adopción responsable</p>
        <h1>Adopción de mascotas</h1>
        <p>Cargando mascotas disponibles...</p>
      </section>
    );
  }

  return (
    <section className="adopcion-page">
      <div className="adopcion-header">
        <p className="seccion-subtitulo">Adopción responsable</p>

        <h1>Adopción de mascotas</h1>

        <p>
          Aquí puedes conocer mascotas registradas por veterinarias y centros de
          cuidado. La adopción no se realiza directamente por la página; solo
          mostramos la información de contacto para iniciar el proceso.
        </p>
      </div>

      {mascotas.length === 0 ? (
        <div className="adopcion-vacio">
          <h2>No hay mascotas disponibles por ahora</h2>
          <p>
            Cuando una veterinaria registre una mascota en adopción, aparecerá
            en este apartado.
          </p>
        </div>
      ) : (
        <div className="adopcion-lista">
          {mascotas.map((mascota) => (
            <article className="adopcion-card" key={mascota.id}>
              {mascota.foto ? (
                <img
                  src={mascota.foto}
                  alt={mascota.nombre}
                  className="adopcion-imagen"
                />
              ) : (
                <div className="adopcion-imagen adopcion-imagen-placeholder">
                  🐾
                </div>
              )}

              <div className="adopcion-info">
                <div className="adopcion-titulo">
                  <h2>{mascota.nombre}</h2>
                  <span>{mascota.estado || "DISPONIBLE"}</span>
                </div>

                <p>
                  <strong>Especie:</strong>{" "}
                  {mascota.especie || "No especificada"}
                </p>

                <p>
                  <strong>Raza:</strong>{" "}
                  {mascota.raza || "No especificada"}
                </p>

                <p>
                  <strong>Edad:</strong>{" "}
                  {mascota.edad || "No especificada"}
                </p>

                <p>
                  <strong>Ubicación:</strong>{" "}
                  {mascota.ubicacion || "No especificada"}
                </p>

                <p>
                  <strong>Veterinaria:</strong>{" "}
                  {mascota.veterinaria || "No especificada"}
                </p>

                <p>
                  <strong>Contacto:</strong>{" "}
                  {mascota.contacto || "No especificado"}
                </p>

                <p className="adopcion-descripcion">
                  {mascota.descripcion || "Sin descripción disponible."}
                </p>

                <button className="btn-adopcion" type="button">
                  Ver información de contacto
                </button>
              </div>
            </article>
          ))}
        </div>
      )}
    </section>
  );
}

export default Adopcion;

