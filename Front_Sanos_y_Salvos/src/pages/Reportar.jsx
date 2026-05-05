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
    <section className="container mt-4">
      <h1 className="text-success">Reportar mascota</h1>

      <p>
        Completa el formulario para informar una mascota perdida o encontrada.
      </p>

      <form className="card p-4" onSubmit={manejarEnvio}>
        <div className="mb-3">
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

        <div className="mb-3">
          <label className="form-label">Tipo de mascota</label>
          <input
            className="form-control"
            type="text"
            name="tipoMascota"
            value={formulario.tipoMascota}
            onChange={manejarCambio}
            required
          />
        </div>

        <div className="mb-3">
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

        <div className="mb-3">
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

        <div className="mb-3">
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

        <div className="mb-3">
          <label className="form-label">Descripción</label>
          <textarea
            className="form-control"
            name="descripcion"
            value={formulario.descripcion}
            onChange={manejarCambio}
            required
          />
        </div>

        <div className="mb-3">
          <label className="form-label">Contacto</label>
          <input
            className="form-control"
            type="text"
            name="contacto"
            value={formulario.contacto}
            onChange={manejarCambio}
            required
          />
        </div>

        <button className="btn btn-success" type="submit">
          Guardar reporte
        </button>
      </form>

      {mensaje && <div className="alert alert-success mt-3">{mensaje}</div>}
    </section>
  );
}

export default Reportar;