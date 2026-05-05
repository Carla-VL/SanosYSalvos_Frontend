const API_URL = "http://localhost:8080/api";

export async function obtenerMascotas() {
  const respuesta = await fetch(`${API_URL}/mascotas`);
  return respuesta.json();
}

export async function obtenerReportes() {
  const respuesta = await fetch(`${API_URL}/reportes`);
  return respuesta.json();
}

export async function crearReporte(reporte) {
  const respuesta = await fetch(`${API_URL}/reportes`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(reporte),
  });

  return respuesta.json();
}