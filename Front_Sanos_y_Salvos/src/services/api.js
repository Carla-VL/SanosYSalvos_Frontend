const API_BFF = "http://localhost:8085/api/bff";
const API_LOGIN = "http://localhost:8082/api/auth";
const API_USUARIOS = "http://localhost:8083/api/usuarios";
const API_GEO = "http://localhost:8084/api/geo";

// =======================
// MASCOTAS / REPORTES
// =======================

export async function obtenerMascotas() {
  const respuesta = await fetch(`${API_BFF}/mascotas/listar`);

  if (!respuesta.ok) {
    throw new Error("Error al obtener mascotas");
  }

  return await respuesta.json();
}

export async function obtenerReportes() {
  const respuesta = await fetch(`${API_BFF}/mascotas/listar`);

  if (!respuesta.ok) {
    throw new Error("Error al obtener reportes");
  }

  return await respuesta.json();
}

export async function crearReporte(reporte, tipo) {
  const url = tipo
    ? `${API_BFF}/mascotas/reportar?tipo=${tipo}`
    : `${API_BFF}/mascotas/reportar`;

  const respuesta = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(reporte),
  });

  if (!respuesta.ok) {
    throw new Error("Error al crear el reporte");
  }

  return await respuesta.json();
}

// =======================
// GEOLOCALIZACIÓN
// =======================

export async function registrarUbicacion(ubicacion) {
  const respuesta = await fetch(`${API_GEO}/registrar`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(ubicacion),
  });

  if (!respuesta.ok) {
    throw new Error("Error al registrar la ubicación");
  }

  return await respuesta.json();
}

export async function listarUbicaciones() {
  const respuesta = await fetch(`${API_GEO}/listar`);

  if (!respuesta.ok) {
    throw new Error("Error al listar ubicaciones");
  }

  return await respuesta.json();
}

// =======================
// LOGIN
// =======================

export async function login(username, password) {
  const respuesta = await fetch(`${API_LOGIN}/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ username, password }),
  });

  if (!respuesta.ok) {
    throw new Error("Error al iniciar sesión");
  }

  const data = await respuesta.json();

  if (data.success && data.token) {
    localStorage.setItem("token", data.token);

    localStorage.setItem(
      "usuario",
      JSON.stringify({
        correo: username,
        rol: data.rol,
      })
    );

    if (data.rol === "ADMIN") {
      window.location.href = "http://localhost:3000/index.html";
    } else {
      window.location.href = "/perfil";
    }
  }

  return data;
}

// =======================
// USUARIOS
// =======================

export async function registrarUsuario(usuarioData) {
  const respuesta = await fetch(`${API_USUARIOS}/registrar`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(usuarioData),
  });

  if (!respuesta.ok) {
    throw new Error("Error al registrar usuario");
  }

  return await respuesta.json();
}

export function obtenerUsuarioActual() {
  const usuario = localStorage.getItem("usuario");
  return usuario ? JSON.parse(usuario) : null;
}

export function existeSesionActiva() {
  return !!localStorage.getItem("token");
}

export function cerrarSesionUsuario() {
  localStorage.removeItem("token");
  localStorage.removeItem("usuario");
}

// =======================
// MIS MASCOTAS
// =======================

export async function obtenerMisMascotas() {
  const mascotas = localStorage.getItem("misMascotas");
  return mascotas ? JSON.parse(mascotas) : [];
}

export async function agregarMiMascota(mascota) {
  const mascotas = await obtenerMisMascotas();

  const nuevaMascota = {
    id: Date.now(),
    ...mascota,
  };

  const mascotasActualizadas = [...mascotas, nuevaMascota];

  localStorage.setItem("misMascotas", JSON.stringify(mascotasActualizadas));

  return nuevaMascota;
}

export async function eliminarMiMascota(id) {
  const mascotas = await obtenerMisMascotas();

  const mascotasActualizadas = mascotas.filter(
    (mascota) => mascota.id !== id
  );

  localStorage.setItem("misMascotas", JSON.stringify(mascotasActualizadas));

  return true;
}