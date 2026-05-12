import { useState } from "react";
import { crearReporte } from "../services/api"; 

function Reportar() {
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
    tipoReporte: "PERDIDA",
    contacto: "",
  });

  const [mensaje, setMensaje] = useState("");
  const [errores, setErrores] = useState({});

  function manejarCambio(evento) {
    setFormulario({
      ...formulario,
      [evento.target.name]: evento.target.value,
    });
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
      nuevosErrores.estadoReproductivo = "Debes seleccionar el estado reproductivo.";
    }
    if (!formulario.edadAproximada.trim()) {
      nuevosErrores.edadAproximada = "La edad aproximada es obligatoria.";
    }
    if (!formulario.colorPatron.trim()) {
      nuevosErrores.colorPatron = "Debes indicar color y patrón del animal.";
    }
    if (!formulario.tamanoPeso.trim()) {
      nuevosErrores.tamanoPeso = "Debes indicar tamaño y peso aproximado del animal.";
    }
    if (!formulario.caracteristicasEspeciales.trim()) {
      nuevosErrores.caracteristicasEspeciales = "Debes agregar características físicas que ayuden a identificarlo.";
    }
    if (!formulario.ubicacion.trim()) {
      nuevosErrores.ubicacion = "La ubicación es obligatoria.";
    }
    if (!formulario.contacto.trim()) {
      nuevosErrores.contacto = "El contacto es obligatorio.";
    }

    return nuevosErrores;
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
      vacunas: formulario.estadoReproductivo || "No especifica"
    };

    try {
      await crearReporte(payloadMascota, formulario.tipoReporte.toLowerCase());
      
      
      const nombreLimpio = formulario.nombreAnimal.trim().toLowerCase();
      localStorage.setItem(`estado_${nombreLimpio}`, formulario.tipoReporte.toUpperCase());
      
      setMensaje("¡Reporte guardado con éxito! Puedes ir a la pestaña 'Reportes' para revisarlo. ");

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
        tipoReporte: "PERDIDA",
        contacto: "",
      });

    } catch (error) {
      console.error(" Error en la petición:", error);
      setMensaje("No se pudo conectar con el servidor. Revisa si el BFF está encendido.");
    }
  }

  return (
    <section className="container py-5">
      <div className="text-center mb-5 seccion-encabezado">
        <p className="text-success fw-bold">Nuevo reporte</p>
        <h1>Reportar mascota</h1>
        <p>
          Completa los datos del animal para facilitar su identificación y apoyar la búsqueda.
        </p>
      </div>

      <form className="card shadow-sm border-0 p-4 formulario-reporte" onSubmit={manejarEnvio}>
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
            {errores.nombreAnimal && <small className="text-danger">{errores.nombreAnimal}</small>}
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
            {errores.especie && <small className="text-danger">{errores.especie}</small>}
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
            {errores.raza && <small className="text-danger">{errores.raza}</small>}
          </div>

          <div className="col-md-6 mb-3">
            <label className="form-label d-block">Sexo</label>
            <div className="opciones-radio">
              <label className="opcion-radio">
                <input type="radio" name="sexo" value="Macho" checked={formulario.sexo === "Macho"} onChange={manejarCambio} /> Macho
              </label>
              <label className="opcion-radio">
                <input type="radio" name="sexo" value="Hembra" checked={formulario.sexo === "Hembra"} onChange={manejarCambio} /> Hembra
              </label>
            </div>
            {errores.sexo && <small className="text-danger">{errores.sexo}</small>}
          </div>

          <div className="col-md-6 mb-3">
            <label className="form-label d-block">Estado reproductivo</label>
            <div className="opciones-radio">
              <label className="opcion-radio">
                <input type="radio" name="estadoReproductivo" value="Castrado" checked={formulario.estadoReproductivo === "Castrado"} onChange={manejarCambio} /> Castrado
              </label>
              <label className="opcion-radio">
                <input type="radio" name="estadoReproductivo" value="No castrado" checked={formulario.estadoReproductivo === "No castrado"} onChange={manejarCambio} /> No castrado
              </label>
            </div>
            {errores.estadoReproductivo && <small className="text-danger">{errores.estadoReproductivo}</small>}
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
            {errores.edadAproximada && <small className="text-danger">{errores.edadAproximada}</small>}
          </div>

          <div className="col-md-6 mb-3">
            <label className="form-label">Tipo de reporte</label>
            <select className="form-select" name="tipoReporte" value={formulario.tipoReporte} onChange={manejarCambio}>
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
            {errores.colorPatron && <small className="text-danger">{errores.colorPatron}</small>}
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
            {errores.tamanoPeso && <small className="text-danger">{errores.tamanoPeso}</small>}
          </div>

          <div className="col-12 mb-3">
            <label className="form-label">Características físicas detalladas</label>
            <textarea
              className="form-control"
              name="caracteristicasEspeciales"
              value={formulario.caracteristicasEspeciales}
              onChange={manejarCambio}
              rows="4"
              placeholder="Detalles únicos..."
            />
            {errores.caracteristicasEspeciales && <small className="text-danger">{errores.caracteristicasEspeciales}</small>}
          </div>

          <div className="col-md-6 mb-3">
            <label className="form-label">Ubicación</label>
            <input
              className="form-control"
              type="text"
              name="ubicacion"
              value={formulario.ubicacion}
              onChange={manejarCambio}
              placeholder="Ej: Maipú"
            />
            {errores.ubicacion && <small className="text-danger">{errores.ubicacion}</small>}
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
            {errores.contacto && <small className="text-danger">{errores.contacto}</small>}
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