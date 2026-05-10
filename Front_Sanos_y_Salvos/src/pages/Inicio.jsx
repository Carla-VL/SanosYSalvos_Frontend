import Carrusel from "../components/Carrusel";
import Servicios from "../components/Servicios";
import MapaResumen from "../components/MapaResumen";

function Inicio({ setPagina }) {
  return (
    <>
      <Carrusel setPagina={setPagina} />

      <section className="container py-5 reveal">
        <div className="row align-items-center">
          <div className="col-md-6">
            <img
              src="/template/images/about.jpg"
              className="img-fluid rounded shadow-sm"
              alt="Mascota"
            />
          </div>

          <div className="col-md-6 mt-4 mt-md-0">
            <p className="text-success fw-bold">Sobre la plataforma</p>

            <h2>Información centralizada para una búsqueda más rápida</h2>

            <p>
              Cuando una mascota se pierde, los reportes suelen quedar
              dispersos en redes sociales, carteles, refugios y clínicas.
              Sanos y Salvos busca reunir esa información en una sola
              plataforma.
            </p>

            <p>
              La solución permite registrar mascotas perdidas o encontradas,
              revisar reportes y facilitar la colaboración entre personas e
              instituciones.
            </p>
          </div>
        </div>
      </section>

      <Servicios setPagina={setPagina} />
      <MapaResumen setPagina={setPagina} />
    </>
  );
}

export default Inicio;