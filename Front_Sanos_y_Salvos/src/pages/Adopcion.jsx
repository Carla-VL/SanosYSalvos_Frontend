import { useEffect, useState } from "react";
import { obtenerMascotasAdopcion } from "../services/api";

function Adopcion() {
  const [mascotas, setMascotas] = useState([]);
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
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

    cargarMascotasAdopcion();
  }, []);

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
          Aquí puedes conocer mascotas que se encuentran en fundaciones,
          rescates o lugares de cuidado. La adopción no se realiza directamente
          por la página; solo mostramos información para saber dónde está cada
          mascota.
        </p>
      </div>

      <div className="adopcion-lista">
        {mascotas.map((mascota) => (
          <article className="adopcion-card" key={mascota.id}>
            <img
              src={mascota.imagen}
              alt={mascota.nombre}
              className="adopcion-imagen"
            />

            <div className="adopcion-info">
              <div className="adopcion-titulo">
                <h2>{mascota.nombre}</h2>
                <span>{mascota.estado}</span>
              </div>

              <p>
                <strong>Tipo:</strong> {mascota.tipo}
              </p>

              <p>
                <strong>Edad:</strong> {mascota.edad}
              </p>

              <p>
                <strong>Ubicación:</strong> {mascota.ubicacion}
              </p>

              <p>
                <strong>Lugar:</strong> {mascota.lugar}
              </p>

              <p className="adopcion-descripcion">{mascota.descripcion}</p>

              <button className="btn-adopcion" type="button">
                Ver información del lugar
              </button>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}

export default Adopcion;