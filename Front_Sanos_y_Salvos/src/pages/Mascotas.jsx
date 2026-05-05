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
    },
    {
      id: 2,
      nombre: "Milo",
      tipo: "Gato",
      raza: "Doméstico",
      color: "Gris",
      estado: "Encontrado",
      ubicacion: "Santiago Centro",
    },
    {
      id: 3,
      nombre: "Toby",
      tipo: "Perro",
      raza: "Poodle",
      color: "Blanco",
      estado: "Perdido",
      ubicacion: "La Florida",
    },
  ];

  return (
    <section className="container mt-4">
      <h1 className="text-success">Mascotas registradas</h1>

      <p>
        Aquí se muestran mascotas perdidas o encontradas registradas en la
        plataforma.
      </p>

      <div className="row g-3">
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