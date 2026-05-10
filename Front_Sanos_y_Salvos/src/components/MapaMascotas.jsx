import { useEffect, useRef } from "react";
import mapboxgl from "mapbox-gl";

function MapaMascotas() {
  const mapaContenedor = useRef(null);
  const mapa = useRef(null);

  const mascotasUbicaciones = [
    {
      nombre: "Luna",
      estado: "Perdida",
      ubicacion: "Maipú",
      coordenadas: [-70.7654, -33.5107],
    },
    {
      nombre: "Milo",
      estado: "Encontrada",
      ubicacion: "Santiago Centro",
      coordenadas: [-70.6483, -33.4489],
    },
    {
      nombre: "Toby",
      estado: "Perdida",
      ubicacion: "La Florida",
      coordenadas: [-70.5982, -33.5227],
    },
  ];

  useEffect(() => {
    if (mapa.current) return;

    const token = import.meta.env.VITE_MAPBOX_TOKEN;

    if (!token) {
      console.error("Falta configurar VITE_MAPBOX_TOKEN en el archivo .env");
      return;
    }

    mapboxgl.accessToken = token;

    mapa.current = new mapboxgl.Map({
      container: mapaContenedor.current,
      style: "mapbox://styles/mapbox/streets-v12",
      center: [-70.6693, -33.4489],
      zoom: 10,
    });

    mapa.current.addControl(new mapboxgl.NavigationControl(), "top-right");

    mascotasUbicaciones.forEach((mascota) => {
      const popup = new mapboxgl.Popup({ offset: 25 }).setHTML(`
        <strong>${mascota.nombre}</strong><br/>
        Estado: ${mascota.estado}<br/>
        Ubicación: ${mascota.ubicacion}
      `);

      new mapboxgl.Marker({
        color: mascota.estado === "Perdida" ? "#ffc107" : "#00b956",
      })
        .setLngLat(mascota.coordenadas)
        .setPopup(popup)
        .addTo(mapa.current);
    });

    return () => {
      mapa.current.remove();
    };
  }, []);

  return (
    <section className="container py-5 reveal">
      <div className="text-center mb-5 seccion-encabezado">
        <p className="text-success fw-bold">Mapa de reportes</p>
        <h1>Ubicación referencial de mascotas</h1>
        <p>
          Este mapa muestra puntos referenciales de mascotas perdidas o
          encontradas. Más adelante estos datos podrán venir desde el BFF.
        </p>
      </div>

      <div className="mapa-card">
        <div ref={mapaContenedor} className="mapa-contenedor"></div>
      </div>
    </section>
  );
}

export default MapaMascotas;