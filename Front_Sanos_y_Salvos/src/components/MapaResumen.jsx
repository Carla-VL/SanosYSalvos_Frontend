import { useEffect, useRef } from "react";
import mapboxgl from "mapbox-gl";

function MapaResumen({ setPagina }) {
  const mapaContenedor = useRef(null);
  const mapa = useRef(null);

  const reportesResumen = [
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
    const token = import.meta.env.VITE_MAPBOX_TOKEN;

    if (!token) {
      console.error("Falta configurar VITE_MAPBOX_TOKEN en el archivo .env");
      return;
    }

    if (!mapaContenedor.current) {
      return;
    }

    mapboxgl.accessToken = token;

    mapa.current = new mapboxgl.Map({
      container: mapaContenedor.current,
      style: "mapbox://styles/mapbox/streets-v12",
      center: [-70.6693, -33.4489],
      zoom: 9.5,
      interactive: true,
    });

    mapa.current.addControl(new mapboxgl.NavigationControl(), "top-right");

    reportesResumen.forEach((reporte) => {
      const popup = new mapboxgl.Popup({ offset: 25 }).setHTML(`
        <strong>${reporte.nombre}</strong><br/>
        Estado: ${reporte.estado}<br/>
        Ubicación: ${reporte.ubicacion}
      `);

      new mapboxgl.Marker({
        color: reporte.estado === "Perdida" ? "#ff6b35" : "#7c3aed",
      })
        .setLngLat(reporte.coordenadas)
        .setPopup(popup)
        .addTo(mapa.current);
    });

    mapa.current.on("load", () => {
      mapa.current.resize();
    });

    return () => {
      if (mapa.current) {
        mapa.current.remove();
        mapa.current = null;
      }
    };
  }, []);

  return (
    <section className="container py-5 reveal">
      <div className="row align-items-center">
        <div className="col-lg-5 mb-4 mb-lg-0">
          <p className="text-success fw-bold">Mapa de reportes</p>

          <h2>Ubicaciones referenciales de mascotas</h2>

          <p>
            Visualiza en el mapa algunos reportes de mascotas perdidas o
            encontradas registrados de forma referencial en la plataforma.
          </p>

          <p>
            Más adelante, estos puntos podrán ser cargados desde el Backend For
            Frontend con información real de los reportes.
          </p>

          <button
            className="btn btn-success"
            onClick={() => setPagina("mapa")}
          >
            Ver mapa completo
          </button>
        </div>

        <div className="col-lg-7">
            <div className="mapa-resumen-card">
            <div className="mapa-leyenda">
                <span>
                <i className="punto-leyenda punto-perdida"></i>
                Mascota perdida
                </span>

                <span>
                <i className="punto-leyenda punto-encontrada"></i>
                Mascota encontrada
                </span>
            </div>

            <div ref={mapaContenedor} className="mapa-resumen"></div>
            </div>
        </div>
      </div>
    </section>
  );
}

export default MapaResumen;