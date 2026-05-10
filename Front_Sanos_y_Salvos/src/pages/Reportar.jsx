import { useState } from "react";

function Reportar() {
  const [formulario, setFormulario] = useState({
    nombreMascota: "",
    tipoMascota: "",
    color: "",
    ubicacion: "",
    tipoReporte: "PERDIDA",
    descripcion: "",
    contacto: "",
  });

  const [mensaje, setMensaje] = useState("");

  function manejarCambio(evento) {
    setFormulario({
      ...formulario,
      [evento.target.name]: evento.target.value,
    });
  }

  function manejarEnvio(evento) {
    evento.preventDefault();

    console.log("Reporte registrado:", formulario);
    setMensaje("Reporte registrado correctamente.");

    setFormulario({
      nombreMascota: "",
      tipoMascota: "",
      color: "",
      ubicacion: "",
      tipoReporte: "PERDIDA",
      descripcion: "",
      contacto: "",
    });
  }

  return (
    <section className="container py-5">
      <div className="text-center mb-5 seccion-encabezado">
        <p className="text-success fw-bold">Nuevo reporte</p>
        <h1>Reportar mascota</h1>

        <p>
          Completa el formulario para informar una mascota perdida o encontrada.
          Esta información permite apoyar la búsqueda desde la plataforma.
        </p>
      </div>

      <form className="card shadow-sm border-0 p-4 formulario-reporte" onSubmit={manejarEnvio}>
        <div className="row">
          <div className="col-md-6 mb-3">
            <label className="form-label">Nombre de la mascota</label>
            <input
              className="form-control"
              type="text"
              name="nombreMascota"
              value={formulario.nombreMascota}
              onChange={manejarCambio}
              required
            />
          </div>

          <div className="col-md-6 mb-3">
            <label className="form-label">Tipo de mascota</label>
            <input
              className="form-control"
              type="text"
              name="tipoMascota"
              value={formulario.tipoMascota}
              onChange={manejarCambio}
              placeholder="Perro, gato, etc."
              required
            />
          </div>

          <div className="col-md-6 mb-3">
            <label className="form-label">Color</label>
            <input
              className="form-control"
              type="text"
              name="color"
              value={formulario.color}
              onChange={manejarCambio}
              required
            />
          </div>

          <div className="col-md-6 mb-3">
            <label className="form-label">Ubicación</label>
            <input
              className="form-control"
              type="text"
              name="ubicacion"
              value={formulario.ubicacion}
              onChange={manejarCambio}
              required
            />
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
            <label className="form-label">Contacto</label>
            <input
              className="form-control"
              type="text"
              name="contacto"
              value={formulario.contacto}
              onChange={manejarCambio}
              placeholder="Teléfono o correo"
              required
            />
          </div>

          <div className="col-12 mb-3">
            <label className="form-label">Descripción</label>
            <textarea
              className="form-control"
              name="descripcion"
              value={formulario.descripcion}
              onChange={manejarCambio}
              rows="4"
              required
            />
          </div>
        </div>

        <button className="btn btn-success" type="submit">
          Guardar reporte
        </button>
      </form>

      {mensaje && <div className="alert alert-success mt-3 formulario-reporte">{mensaje}</div>}
    </section>
  );
}

export default Reportar;