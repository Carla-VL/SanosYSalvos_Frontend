import MascotaCard from "../components/MascotaCard";

function Mascotas() {
  const mascotas = [
    {
      id: 1,
      nombre: "Luna",
      tipo: "Perro",
      raza: "Mestiza",
      color: "Blanco con café",
      estado: "Perdida",
      ubicacion: "Maipú",
      imagen: "/template/images/gallery-1.jpg",
    },
    {
      id: 2,
      nombre: "Milo",
      tipo: "Gato",
      raza: "Doméstico",
      color: "Gris",
      estado: "Encontrada",
      ubicacion: "Santiago Centro",
      imagen: "/template/images/gallery-2.jpg",
    },
    {
      id: 3,
      nombre: "Toby",
      tipo: "Perro",
      raza: "Poodle",
      color: "Blanco",
      estado: "Perdida",
      ubicacion: "La Florida",
      imagen: "/template/images/gallery-3.jpg",
    },
  ];

  return (
    <section className="container py-5">
      <div className="text-center mb-5 seccion-encabezado">
        <p className="text-success fw-bold">Mascotas</p>
        <h1>Mascotas registradas</h1>

        <p>
          Aquí se muestran mascotas perdidas o encontradas registradas en la
          plataforma. Esta información ayuda a centralizar los reportes y
          facilitar la búsqueda.
        </p>
      </div>

      <div className="row g-4">
        {mascotas.map((mascota) => (
          <div className="col-md-4" key={mascota.id}>
            <MascotaCard mascota={mascota} />
          </div>
        ))}
      </div>
    </section>
  );
}

export default Mascotas;