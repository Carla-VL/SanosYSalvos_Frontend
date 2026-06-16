import { useEffect, useRef, useState } from "react";
import mapboxgl from "mapbox-gl";
import { listarUbicaciones } from "../services/api";

mapboxgl.accessToken = import.meta.env.VITE_MAPBOX_TOKEN;

function MapaMascotas() {
  const mapaContenedor = useRef(null);
  const mapa = useRef(null);
  const marcadores = useRef([]);

  const [vistaMapa, setVistaMapa] = useState("calles");
  const [ubicaciones, setUbicaciones] = useState([]);
  const [mensaje, setMensaje] = useState("");

  const estilosMapa = {
    calles: "mapbox://styles/mapbox/streets-v12",
    satelite: "mapbox://styles/mapbox/satellite-streets-v12",
    relieve: "mapbox://styles/mapbox/outdoors-v12",
  };

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

  function limpiarMarcadores() {
    marcadores.current.forEach((marcador) => marcador.remove());
    marcadores.current = [];
  }

  function agregarMarcadores(listaUbicaciones) {
    if (!mapa.current) return;

    limpiarMarcadores();

    listaUbicaciones.forEach((ubicacion) => {
      if (!ubicacion.latitud || !ubicacion.longitud) return;

      const popup = new mapboxgl.Popup({ offset: 25 }).setHTML(`
        <strong>Mascota ID: ${ubicacion.mascotaId}</strong><br/>
        Comuna: ${ubicacion.comuna || "Sin comuna"}<br/>
        Referencia: ${ubicacion.sectorReferencia || "Sin referencia"}
      `);

      const marcador = new mapboxgl.Marker({
        color: "#ff6b35",
      })
        .setLngLat([Number(ubicacion.longitud), Number(ubicacion.latitud)])
        .setPopup(popup)
        .addTo(mapa.current);

      marcadores.current.push(marcador);
    });
  }

  async function cargarUbicaciones() {
    try {
      setMensaje("");

      const data = await listarUbicaciones();

      console.log("Ubicaciones recibidas desde geolocalización:", data);

      setUbicaciones(data);
      agregarMarcadores(data);

      if (data.length === 0) {
        setMensaje("No hay ubicaciones registradas todavía.");
      }
    } catch (error) {
      console.error("Error cargando ubicaciones:", error);
      setMensaje("No se pudieron cargar las ubicaciones desde geolocalización.");
    }
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

      agregarMarcadores(ubicaciones);
      mapa.current.resize();
    });
  }

  useEffect(() => {
    const token = import.meta.env.VITE_MAPBOX_TOKEN;

    if (!token) {
      console.error("Falta configurar VITE_MAPBOX_TOKEN en el archivo .env");
      setMensaje("Falta configurar el token de Mapbox.");
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
      cargarUbicaciones();
      mapa.current.resize();
    });

    return () => {
      limpiarMarcadores();

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
          Este mapa muestra las ubicaciones registradas desde el microservicio
          de geolocalización.
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
            Ubicación registrada
          </span>

          <span className="text-muted">
            Total ubicaciones: {ubicaciones.length}
          </span>
        </div>

        {mensaje && (
          <div className="alert alert-warning text-center mx-3">
            {mensaje}
          </div>
        )}

        <div ref={mapaContenedor} className="mapa-contenedor"></div>
      </div>
    </section>
  );
}

export default MapaMascotas;