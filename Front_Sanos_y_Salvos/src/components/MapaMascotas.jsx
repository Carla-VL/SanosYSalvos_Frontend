import { useEffect, useRef, useState } from "react";
import mapboxgl from "mapbox-gl";

function MapaMascotas() {
  const mapaContenedor = useRef(null);
  const mapa = useRef(null);
  const [vistaMapa, setVistaMapa] = useState("calles");

  const estilosMapa = {
    calles: "mapbox://styles/mapbox/streets-v12",
    satelite: "mapbox://styles/mapbox/satellite-streets-v12",
    relieve: "mapbox://styles/mapbox/outdoors-v12",
  };

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

  function agregarRelieve() {
    if (!mapa.current) return;

    if (!mapa.current.getSource("mapbox-dem")) {
      mapa.current.addSource("mapbox-dem", {
        type: "raster-dem",
        url: "mapbox://mapbox.mapbox-terrain-dem-v1",
        tileSize: 512,
        maxzoom: 14,
      });
    }

    mapa.current.setTerrain({
      source: "mapbox-dem",
      exaggeration: 1.3,
    });

    mapa.current.setFog({
      color: "rgb(245, 247, 250)",
      "high-color": "rgb(210, 230, 255)",
      "horizon-blend": 0.2,
    });
  }

  function quitarRelieve() {
    if (!mapa.current) return;

    mapa.current.setTerrain(null);
    mapa.current.setFog(null);
  }

  function agregarMarcadores() {
    mascotasUbicaciones.forEach((mascota) => {
      const popup = new mapboxgl.Popup({ offset: 25 }).setHTML(`
        <strong>${mascota.nombre}</strong><br/>
        Estado: ${mascota.estado}<br/>
        Ubicación: ${mascota.ubicacion}
      `);

      new mapboxgl.Marker({
        color: mascota.estado === "Perdida" ? "#ff6b35" : "#7c3aed",
      })
        .setLngLat(mascota.coordenadas)
        .setPopup(popup)
        .addTo(mapa.current);
    });
  }

  function cambiarVista(tipoVista) {
    setVistaMapa(tipoVista);

    if (!mapa.current) return;

    mapa.current.setStyle(estilosMapa[tipoVista]);

    mapa.current.once("style.load", () => {
      if (tipoVista === "relieve") {
        mapa.current.setPitch(55);
        mapa.current.setBearing(-20);
        agregarRelieve();
      } else {
        mapa.current.setPitch(0);
        mapa.current.setBearing(0);
        quitarRelieve();
      }

      mapa.current.resize();
    });
  }

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
      style: estilosMapa.calles,
      center: [-70.6693, -33.4489],
      zoom: 10,
    });

    mapa.current.addControl(new mapboxgl.NavigationControl(), "top-right");

    mapa.current.on("load", () => {
      agregarMarcadores();
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
      <div className="text-center mb-5 seccion-encabezado">
        <p className="text-success fw-bold">Mapa de reportes</p>
        <h1>Ubicación referencial de mascotas</h1>
        <p>
          Este mapa muestra puntos referenciales de mascotas perdidas o
          encontradas. Más adelante estos datos podrán venir desde el BFF.
        </p>
      </div>

      <div className="mapa-card">
        <div className="mapa-controles">
          <button
            className={
              vistaMapa === "calles"
                ? "mapa-control activo"
                : "mapa-control"
            }
            onClick={() => cambiarVista("calles")}
          >
            Calles
          </button>

          <button
            className={
              vistaMapa === "satelite"
                ? "mapa-control activo"
                : "mapa-control"
            }
            onClick={() => cambiarVista("satelite")}
          >
            Satélite
          </button>

          <button
            className={
              vistaMapa === "relieve"
                ? "mapa-control activo"
                : "mapa-control"
            }
            onClick={() => cambiarVista("relieve")}
          >
            Relieve
          </button>
        </div>

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

        <div ref={mapaContenedor} className="mapa-contenedor"></div>
      </div>
    </section>
  );
}

export default MapaMascotas;