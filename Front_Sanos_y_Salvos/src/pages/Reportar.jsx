import { useEffect, useState } from "react";
import { crearReporte, registrarUbicacion, obtenerMascotas } from "../services/api";

const MAPBOX_TOKEN = import.meta.env.VITE_MAPBOX_TOKEN;

function Reportar() {
  const [sugerenciasDireccion, setSugerenciasDireccion] = useState([]);
  const [cargandoDirecciones, setCargandoDirecciones] = useState(false);
  const [busquedaRealizada, setBusquedaRealizada] = useState(false);
  const [direccionElegida, setDireccionElegida] = useState(false);
  const [sessionToken] = useState(() => crypto.randomUUID());

  const [formulario, setFormulario] = useState({
    microchip: "",
    nombreAnimal: "",
    especie: "",
    raza: "",
    sexo: "",
    estadoReproductivo: "",
    edadAproximada: "",
    colorPatron: "",
    tamanoPeso: "",
    caracteristicasEspeciales: "",
    ubicacion: "",
    latitud: "",
    longitud: "",
    comuna: "",
    tipoReporte: "PERDIDA",
    contacto: "",
  });

  const [mensaje, setMensaje] = useState("");
  const [errores, setErrores] = useState({});

  useEffect(() => {
    const texto = formulario.ubicacion.trim();

    if (direccionElegida) return;

    if (texto.length < 3) {
      setSugerenciasDireccion([]);
      setBusquedaRealizada(false);
      return;
    }

    if (!MAPBOX_TOKEN) {
      console.error("Falta configurar VITE_MAPBOX_TOKEN en el archivo .env");
      setSugerenciasDireccion([]);
      setBusquedaRealizada(false);
      return;
    }

    const temporizador = setTimeout(() => {
      buscarDirecciones(texto);
    }, 500);

    return () => clearTimeout(temporizador);
  }, [formulario.ubicacion, direccionElegida]);

  async function buscarDirecciones(texto) {
    try {
      setCargandoDirecciones(true);
      setBusquedaRealizada(false);

      const url = `https://api.mapbox.com/search/searchbox/v1/suggest?q=${encodeURIComponent(
        texto
      )}&access_token=${MAPBOX_TOKEN}&session_token=${sessionToken}&country=CL&language=es&limit=6&types=address,street,place,locality,neighborhood&proximity=-70.6693,-33.4489`;

      const respuesta = await fetch(url);
      const data = await respuesta.json();

      console.log("Respuesta Search Box Mapbox:", data);

      if (data.suggestions && data.suggestions.length > 0) {
        setSugerenciasDireccion(data.suggestions);
      } else {
        setSugerenciasDireccion([]);
      }

      setBusquedaRealizada(true);
    } catch (error) {
      console.error("Error buscando direcciones:", error);
      setSugerenciasDireccion([]);
      setBusquedaRealizada(true);
    } finally {
      setCargandoDirecciones(false);
    }
  }

  async function seleccionarDireccion(direccion) {
    try {
      if (!direccion?.mapbox_id) {
        console.warn("La dirección no tiene mapbox_id:", direccion);
        return;
      }

      const url = `https://api.mapbox.com/search/searchbox/v1/retrieve/${direccion.mapbox_id}?access_token=${MAPBOX_TOKEN}&session_token=${sessionToken}`;

      const respuesta = await fetch(url);
      const data = await respuesta.json();

      console.log("Dirección seleccionada:", data);

      const feature = data.features?.[0];

      if (!feature) {
        console.warn("No se pudo recuperar la dirección seleccionada");
        return;
      }

      const coordenadas = feature.geometry?.coordinates;

      const direccionCompleta =
        feature.properties?.full_address ||
        `${feature.properties?.name || ""}, ${
          feature.properties?.place_formatted || ""
        }`.trim() ||
        direccion.full_address ||
        direccion.place_formatted ||
        direccion.name;

      const comuna =
        feature.properties?.context?.place?.name ||
        feature.properties?.context?.locality?.name ||
        feature.properties?.context?.neighborhood?.name ||
        "Sin comuna";

      setFormulario((prev) => ({
        ...prev,
        ubicacion: direccionCompleta,
        longitud: coordenadas ? coordenadas[0] : "",
        latitud: coordenadas ? coordenadas[1] : "",
        comuna: comuna,
      }));

      setDireccionElegida(true);
      setSugerenciasDireccion([]);
      setBusquedaRealizada(false);
    } catch (error) {
      console.error("Error seleccionando dirección:", error);
    }
  }

  function manejarCambio(evento) {
    const { name, value } = evento.target;

    if (name === "ubicacion") {
      setDireccionElegida(false);

      setFormulario((prev) => ({
        ...prev,
        ubicacion: value,
        latitud: "",
        longitud: "",
        comuna: "",
      }));

      return;
    }

    setFormulario((prev) => ({
      ...prev,
      [name]: value,
    }));
  }

  function validarFormulario() {
    const nuevosErrores = {};

    if (!formulario.nombreAnimal.trim()) {
      nuevosErrores.nombreAnimal = "El nombre del animal es obligatorio.";
    }

    if (!formulario.especie.trim()) {
      nuevosErrores.especie = "La especie es obligatoria.";
    }

    if (!formulario.raza.trim()) {
      nuevosErrores.raza = "La raza es obligatoria.";
    }

    if (!formulario.sexo) {
      nuevosErrores.sexo = "Debes seleccionar el sexo del animal.";
    }

    if (!formulario.estadoReproductivo) {
      nuevosErrores.estadoReproductivo =
        "Debes seleccionar el estado reproductivo.";
    }

    if (!formulario.edadAproximada.trim()) {
      nuevosErrores.edadAproximada = "La edad aproximada es obligatoria.";
    }

    if (!formulario.colorPatron.trim()) {
      nuevosErrores.colorPatron = "Debes indicar color y patrón del animal.";
    }

    if (!formulario.tamanoPeso.trim()) {
      nuevosErrores.tamanoPeso =
        "Debes indicar tamaño y peso aproximado del animal.";
    }

    if (!formulario.caracteristicasEspeciales.trim()) {
      nuevosErrores.caracteristicasEspeciales =
        "Debes agregar características físicas que ayuden a identificarlo.";
    }

    if (!formulario.ubicacion.trim()) {
      nuevosErrores.ubicacion = "La ubicación es obligatoria.";
    }

    if (!formulario.contacto.trim()) {
      nuevosErrores.contacto = "El contacto es obligatorio.";
    }

    return nuevosErrores;
  }

  async function obtenerIdMascotaCreada(mascotaCreada) {
    let mascotaId =
      mascotaCreada?.id ||
      mascotaCreada?.mascotaId ||
      mascotaCreada?.idMascota ||
      mascotaCreada?.data?.id ||
      mascotaCreada?.data?.mascotaId ||
      mascotaCreada?.data?.idMascota;

    if (mascotaId) {
      return mascotaId;
    }

    try {
      const mascotas = await obtenerMascotas();

      console.log("Lista de mascotas después de crear:", mascotas);

      const listaMascotas = Array.isArray(mascotas)
        ? mascotas
        : mascotas?.data || mascotas?.content || [];

      const nombreFormulario = formulario.nombreAnimal.trim().toLowerCase();
      const ubicacionFormulario = formulario.ubicacion.trim().toLowerCase();

      const mascotaEncontrada = [...listaMascotas]
        .reverse()
        .find((mascota) => {
          const nombreMascota = (mascota.nombre || mascota.nombreAnimal || "")
            .trim()
            .toLowerCase();

          const ubicacionMascota = (mascota.ubicacion || "")
            .trim()
            .toLowerCase();

          return (
            nombreMascota === nombreFormulario &&
            ubicacionMascota === ubicacionFormulario
          );
        });

      if (!mascotaEncontrada) {
        console.warn("No se encontró la mascota recién creada en la lista.");
        return null;
      }

      mascotaId =
        mascotaEncontrada.id ||
        mascotaEncontrada.mascotaId ||
        mascotaEncontrada.idMascota;

      console.log("ID encontrado desde la lista:", mascotaId);

      return mascotaId || null;
    } catch (error) {
      console.error("Error buscando el ID de la mascota creada:", error);
      return null;
    }
  }

  async function manejarEnvio(evento) {
    evento.preventDefault();

    const validaciones = validarFormulario();
    setErrores(validaciones);
    setMensaje("");

    if (Object.keys(validaciones).length > 0) {
      return;
    }

    const payloadMascota = {
      ...formulario,
      nombre: formulario.nombreAnimal,
      edad: parseInt(formulario.edadAproximada) || 0,
      vacunas: formulario.estadoReproductivo || "No especifica",
    };

    try {
      const mascotaCreada = await crearReporte(
        payloadMascota,
        formulario.tipoReporte.toLowerCase()
      );

      console.log("Mascota creada:", mascotaCreada);

      const mascotaId = await obtenerIdMascotaCreada(mascotaCreada);

      console.log("Mascota ID final:", mascotaId);
      console.log("Datos ubicación antes de registrar:", {
        latitud: formulario.latitud,
        longitud: formulario.longitud,
        comuna: formulario.comuna,
        ubicacion: formulario.ubicacion,
      });

      if (mascotaId && formulario.latitud && formulario.longitud) {
        await registrarUbicacion({
          mascotaId: Number(mascotaId),
          latitud: Number(formulario.latitud),
          longitud: Number(formulario.longitud),
          comuna: formulario.comuna || "Sin comuna",
          sectorReferencia: formulario.ubicacion,
        });

        console.log("Ubicación registrada correctamente en geolocalización");
      } else {
        console.warn("No se registró ubicación en geolocalización", {
          mascotaId,
          latitud: formulario.latitud,
          longitud: formulario.longitud,
          comuna: formulario.comuna,
          ubicacion: formulario.ubicacion,
        });
      }

      const nombreLimpio = formulario.nombreAnimal.trim().toLowerCase();
      localStorage.setItem(
        `estado_${nombreLimpio}`,
        formulario.tipoReporte.toUpperCase()
      );

      setMensaje(
        "¡Reporte guardado con éxito! Puedes ir a la pestaña 'Reportes' para revisarlo."
      );

      setFormulario({
        microchip: "",
        nombreAnimal: "",
        especie: "",
        raza: "",
        sexo: "",
        estadoReproductivo: "",
        edadAproximada: "",
        colorPatron: "",
        tamanoPeso: "",
        caracteristicasEspeciales: "",
        ubicacion: "",
        latitud: "",
        longitud: "",
        comuna: "",
        tipoReporte: "PERDIDA",
        contacto: "",
      });

      setSugerenciasDireccion([]);
      setBusquedaRealizada(false);
      setDireccionElegida(false);
    } catch (error) {
      console.error("Error en la petición:", error);
      setMensaje(
        "No se pudo conectar con el servidor. Revisa si el BFF o los microservicios están encendidos."
      );
    }
  }

  return (
    <section className="container py-5">
      <div className="text-center mb-5 seccion-encabezado">
        <p className="text-success fw-bold">Nuevo reporte</p>
        <h1>Reportar mascota</h1>
        <p>
          Completa los datos del animal para facilitar su identificación y
          apoyar la búsqueda.
        </p>
      </div>

      <form
        className="card shadow-sm border-0 p-4 formulario-reporte"
        onSubmit={manejarEnvio}
      >
        <div className="row">
          <div className="col-md-6 mb-3">
            <label className="form-label">Registro de microchip</label>
            <input
              className="form-control"
              type="text"
              name="microchip"
              value={formulario.microchip}
              onChange={manejarCambio}
              placeholder="Opcional"
            />
          </div>

          <div className="col-md-6 mb-3">
            <label className="form-label">Nombre del animal</label>
            <input
              className="form-control"
              type="text"
              name="nombreAnimal"
              value={formulario.nombreAnimal}
              onChange={manejarCambio}
              placeholder="Ej: Luna, Toby"
            />
            {errores.nombreAnimal && (
              <small className="text-danger">{errores.nombreAnimal}</small>
            )}
          </div>

          <div className="col-md-6 mb-3">
            <label className="form-label">Especie</label>
            <input
              className="form-control"
              type="text"
              name="especie"
              value={formulario.especie}
              onChange={manejarCambio}
              placeholder="Ej: perro, gato"
            />
            {errores.especie && (
              <small className="text-danger">{errores.especie}</small>
            )}
          </div>

          <div className="col-md-6 mb-3">
            <label className="form-label">Raza</label>
            <input
              className="form-control"
              type="text"
              name="raza"
              value={formulario.raza}
              onChange={manejarCambio}
              placeholder="Ej: mestizo, poodle"
            />
            {errores.raza && (
              <small className="text-danger">{errores.raza}</small>
            )}
          </div>

          <div className="col-md-6 mb-3">
            <label className="form-label d-block">Sexo</label>
            <div className="opciones-radio">
              <label className="opcion-radio">
                <input
                  type="radio"
                  name="sexo"
                  value="Macho"
                  checked={formulario.sexo === "Macho"}
                  onChange={manejarCambio}
                />{" "}
                Macho
              </label>

              <label className="opcion-radio">
                <input
                  type="radio"
                  name="sexo"
                  value="Hembra"
                  checked={formulario.sexo === "Hembra"}
                  onChange={manejarCambio}
                />{" "}
                Hembra
              </label>
            </div>
            {errores.sexo && (
              <small className="text-danger">{errores.sexo}</small>
            )}
          </div>

          <div className="col-md-6 mb-3">
            <label className="form-label d-block">Estado reproductivo</label>
            <div className="opciones-radio">
              <label className="opcion-radio">
                <input
                  type="radio"
                  name="estadoReproductivo"
                  value="Castrado"
                  checked={formulario.estadoReproductivo === "Castrado"}
                  onChange={manejarCambio}
                />{" "}
                Castrado
              </label>

              <label className="opcion-radio">
                <input
                  type="radio"
                  name="estadoReproductivo"
                  value="No castrado"
                  checked={formulario.estadoReproductivo === "No castrado"}
                  onChange={manejarCambio}
                />{" "}
                No castrado
              </label>
            </div>
            {errores.estadoReproductivo && (
              <small className="text-danger">
                {errores.estadoReproductivo}
              </small>
            )}
          </div>

          <div className="col-md-6 mb-3">
            <label className="form-label">Edad aproximada</label>
            <input
              className="form-control"
              type="text"
              name="edadAproximada"
              value={formulario.edadAproximada}
              onChange={manejarCambio}
              placeholder="Ej: 2"
            />
            {errores.edadAproximada && (
              <small className="text-danger">{errores.edadAproximada}</small>
            )}
          </div>

          <div className="col-md-6 mb-3">
            <label className="form-label">Tipo de reporte</label>
            <select
              className="form-select"
              name="tipoReporte"
              value={formulario.tipoReporte}
              onChange={manejarCambio}
            >
              <option value="PERDIDA">Mascota perdida</option>
              <option value="ENCONTRADA">Mascota encontrada</option>
            </select>
          </div>

          <div className="col-md-6 mb-3">
            <label className="form-label">Color y patrón</label>
            <input
              className="form-control"
              type="text"
              name="colorPatron"
              value={formulario.colorPatron}
              onChange={manejarCambio}
              placeholder="Ej: blanco negro"
            />
            {errores.colorPatron && (
              <small className="text-danger">{errores.colorPatron}</small>
            )}
          </div>

          <div className="col-md-6 mb-3">
            <label className="form-label">Tamaño y peso estimado</label>
            <input
              className="form-control"
              type="text"
              name="tamanoPeso"
              value={formulario.tamanoPeso}
              onChange={manejarCambio}
              placeholder="Ej: mediano"
            />
            {errores.tamanoPeso && (
              <small className="text-danger">{errores.tamanoPeso}</small>
            )}
          </div>

          <div className="col-12 mb-3">
            <label className="form-label">
              Características físicas detalladas
            </label>
            <textarea
              className="form-control"
              name="caracteristicasEspeciales"
              value={formulario.caracteristicasEspeciales}
              onChange={manejarCambio}
              rows="4"
              placeholder="Detalles únicos..."
            />
            {errores.caracteristicasEspeciales && (
              <small className="text-danger">
                {errores.caracteristicasEspeciales}
              </small>
            )}
          </div>

          <div className="col-md-6 mb-3 position-relative">
            <label className="form-label">Ubicación</label>

            <input
              className="form-control"
              type="text"
              name="ubicacion"
              value={formulario.ubicacion}
              onChange={manejarCambio}
              placeholder="Ej: Rivadavia 7580, Santiago"
              autoComplete="off"
            />

            {cargandoDirecciones && (
              <small className="text-muted">Buscando direcciones...</small>
            )}

            {!cargandoDirecciones &&
              busquedaRealizada &&
              formulario.ubicacion.trim().length >= 3 &&
              sugerenciasDireccion.length === 0 && (
                <small className="text-muted">
                  No se encontraron sugerencias para esa dirección.
                </small>
              )}

            {sugerenciasDireccion.length > 0 && (
              <div
                className="list-group position-absolute w-100 shadow"
                style={{
                  zIndex: 9999,
                  maxHeight: "230px",
                  overflowY: "auto",
                  top: "75px",
                  left: 0,
                }}
              >
                {sugerenciasDireccion.map((direccion) => (
                  <button
                    type="button"
                    key={direccion.mapbox_id}
                    className="list-group-item list-group-item-action text-start"
                    onMouseDown={(e) => {
                      e.preventDefault();
                      seleccionarDireccion(direccion);
                    }}
                  >
                    <strong>{direccion.name}</strong>
                    <br />
                    <small>
                      {direccion.full_address ||
                        direccion.place_formatted ||
                        "Dirección sugerida"}
                    </small>
                  </button>
                ))}
              </div>
            )}

            {errores.ubicacion && (
              <small className="text-danger">{errores.ubicacion}</small>
            )}
          </div>

          <div className="col-md-6 mb-3">
            <label className="form-label">Contacto</label>
            <input
              className="form-control"
              type="text"
              name="contacto"
              value={formulario.contacto}
              onChange={manejarCambio}
              placeholder="Teléfono o correo"
            />
            {errores.contacto && (
              <small className="text-danger">{errores.contacto}</small>
            )}
          </div>
        </div>

        <button className="btn btn-success" type="submit">
          Guardar reporte
        </button>
      </form>

      {mensaje && (
        <div className="alert alert-success mt-3 formulario-reporte">
          {mensaje}
        </div>
      )}
    </section>
  );
}

export default Reportar;