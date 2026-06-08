const API_BFF = "http://localhost:8085/api/bff";           
const API_LOGIN = "http://localhost:8082/api/auth";         
const API_USUARIOS = "http://localhost:8083/api/usuarios";  

export async function obtenerMascotas() {
    const respuesta = await fetch(`${API_BFF}/mascotas/listar`);
    return respuesta.json();
}

export async function obtenerReportes() {
    const respuesta = await fetch(`${API_BFF}/mascotas/listar`);
    return respuesta.json();
}

export async function crearReporte(reporte, tipo) {
    const url = tipo ? `${API_BFF}/mascotas/reportar?tipo=${tipo}` : `${API_BFF}/mascotas/reportar`;
    
    const respuesta = await fetch(url, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(reporte),
    });
    return respuesta.json();
}

export async function login(username, password) {
    const respuesta = await fetch(`${API_LOGIN}/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
    });
    const data = await respuesta.json();
    if (data.token) {
        localStorage.setItem("token", data.token); 
    }
    return data;
}

export async function registrarUsuario(usuarioData) {
    const respuesta = await fetch(`${API_USUARIOS}/registrar`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(usuarioData),
    });
    return respuesta.json();
}

export async function obtenerMascotasAdopcion() {
  return [
    {
      id: 1,
      nombre: "Luna",
      tipo: "Perro",
      edad: "2 años",
      ubicacion: "Santiago Centro",
      lugar: "Fundación Patitas Seguras",
      descripcion:
        "Luna es una perrita tranquila, cariñosa y sociable. Actualmente se encuentra en una fundación donde recibe cuidados mientras espera una familia responsable.",
      estado: "Disponible",
      imagen:
        "https://images.unsplash.com/photo-1558788353-f76d92427f16?auto=format&fit=crop&w=800&q=80",
    },
    {
      id: 2,
      nombre: "Milo",
      tipo: "Gato",
      edad: "1 año",
      ubicacion: "Maipú",
      lugar: "Rescate Huellitas",
      descripcion:
        "Milo es un gatito curioso y juguetón. Está en un hogar temporal asociado a un rescate animal, donde se encuentra protegido y cuidado.",
      estado: "Disponible",
      imagen:
        "https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?auto=format&fit=crop&w=800&q=80",
    },
    {
      id: 3,
      nombre: "Rocky",
      tipo: "Perro",
      edad: "4 años",
      ubicacion: "La Florida",
      lugar: "Refugio Animal Esperanza",
      descripcion:
        "Rocky es un perro activo y regalón. Se recomienda para una familia que pueda entregarle paseos, compañía y un ambiente seguro.",
      estado: "Disponible",
      imagen:
        "https://images.unsplash.com/photo-1543466835-00a7907e9de1?auto=format&fit=crop&w=800&q=80",
    },
  ];
}