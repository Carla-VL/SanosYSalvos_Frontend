const API_BFF = "http://localhost:8085/api/bff";
const API_LOGIN = "http://localhost:8082/api/auth";
const API_USUARIOS = "http://localhost:8083/api/usuarios";
const API_GEO = "http://localhost:8084/api/geo";
const ADOPCION_API_URL = "http://localhost:8086/api/adopcion";

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
  const token = localStorage.getItem("token");

  if (!token) {
    throw new Error("Debes iniciar sesión para registrar una mascota.");
  }

  const url = tipo
    ? `${API_BFF}/mascotas/reportar?tipo=${tipo}`
    : `${API_BFF}/mascotas/reportar`;

  const respuesta = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": "Bearer " + token,
    },
    body: JSON.stringify(reporte),
  });

  const texto = await respuesta.text();

  console.log("Respuesta crearReporte status:", respuesta.status);
  console.log("Respuesta crearReporte texto:", texto);

  if (!respuesta.ok) {
    throw new Error(
      `Error al crear el reporte. Status: ${respuesta.status}. Respuesta: ${texto}`
    );
  }

  return texto ? JSON.parse(texto) : null;
}

// =======================
// GEOLOCALIZACIÓN
// =======================

export async function registrarUbicacion(ubicacion) {
  console.log("Enviando ubicación a GEO:", ubicacion);

  const respuesta = await fetch(`${API_GEO}/registrar`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(ubicacion),
  });

  const texto = await respuesta.text();

  console.log("Respuesta GEO status:", respuesta.status);
  console.log("Respuesta GEO texto:", texto);

  if (!respuesta.ok) {
    throw new Error(
      `Error al registrar ubicación. Status: ${respuesta.status}. Respuesta: ${texto}`
    );
  }

  return texto ? JSON.parse(texto) : null;
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

  return data;
}

// =======================
// USUARIOS
// =======================

export async function registrarUsuario(usuarioData) {
  const correo = usuarioData.email || usuarioData.correo;

  const usernameGenerado = correo
    ? correo.split("@")[0].replace(/[^a-zA-Z0-9]/g, "")
    : usuarioData.username;

  const body = {
    username: usuarioData.username || usernameGenerado,
    password: usuarioData.password,
    email: correo,
    nombreCompleto:
      usuarioData.nombreCompleto || usuarioData.nombrecompleto,
    rol: usuarioData.rol || "USER",
  };

  const respuesta = await fetch(`${API_USUARIOS}/registrar`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });

  if (!respuesta.ok) {
    const texto = await respuesta.text();
    throw new Error(texto || "Error al registrar usuario");
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
  localStorage.removeItem("rol");
  localStorage.removeItem("misMascotas");
}

// =======================
// MIS MASCOTAS
// =======================

export async function obtenerMisMascotas() {
  const token = localStorage.getItem("token");

  if (!token) {
    console.error("No hay token guardado");
    return [];
  }

  const respuesta = await fetch(`${API_BFF}/mascotas/mis-mascotas`, {
    method: "GET",
    headers: {
      "Authorization": "Bearer " + token,
    },
  });

  const texto = await respuesta.text();

  console.log("Respuesta obtenerMisMascotas status:", respuesta.status);
  console.log("Respuesta obtenerMisMascotas texto:", texto);

  if (!respuesta.ok) {
    console.error("Error al obtener mis mascotas:", respuesta.status, texto);
    return [];
  }

  return texto ? JSON.parse(texto) : [];
}

export async function agregarMiMascota(mascota) {
  const token = localStorage.getItem("token");

  if (!token) {
    throw new Error("Debes iniciar sesión para registrar una mascota.");
  }

  const mascotaParaEnviar = {
    ...mascota,
    especie: mascota.especie || mascota.tipo,
    estadoReporte: mascota.estadoReporte || "REGISTRO NORMAL",
  };

  delete mascotaParaEnviar.tipo;
  delete mascotaParaEnviar.dueñoId;
  delete mascotaParaEnviar.duenoId;
  delete mascotaParaEnviar.dueño_id;
  delete mascotaParaEnviar.dueno_id;

  const respuesta = await fetch(`${API_BFF}/mascotas/reportar`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": "Bearer " + token,
    },
    body: JSON.stringify(mascotaParaEnviar),
  });

  const texto = await respuesta.text();

  console.log("Respuesta agregarMiMascota status:", respuesta.status);
  console.log("Respuesta agregarMiMascota texto:", texto);

  if (!respuesta.ok) {
    throw new Error(
      `Error al registrar mascota. Status: ${respuesta.status}. Respuesta: ${texto}`
    );
  }

  return texto ? JSON.parse(texto) : null;
}

export async function eliminarMiMascota(id) {
  console.warn(
    "EliminarMiMascota todavía no está conectado para usuarios normales en el backend."
  );

  return true;
}

// =======================
// ADOPCIÓN
// =======================

export async function obtenerMascotasAdopcion() {
  const respuesta = await fetch(`${ADOPCION_API_URL}/catalogo`);

  if (!respuesta.ok) {
    throw new Error("No se pudieron cargar las mascotas en adopción.");
  }

  return await respuesta.json();
}

export async function registrarMascotaAdopcion(datosMascota) {
  const respuesta = await fetch(`${ADOPCION_API_URL}/registrar`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(datosMascota),
  });

  if (!respuesta.ok) {
    throw new Error("No se pudo registrar la mascota en adopción.");
  }

  return await respuesta.json();
}

export async function listarMascotasAdopcion() {
  return await obtenerMascotasAdopcion();
}

export async function obtenerMascotasAdopcionVeterinaria(contacto) {
  const contactoCodificado = encodeURIComponent(contacto);

  const respuesta = await fetch(
    `${ADOPCION_API_URL}/veterinaria/${contactoCodificado}`
  );

  if (!respuesta.ok) {
    throw new Error("No se pudieron cargar las mascotas de la veterinaria.");
  }

  return await respuesta.json();
}

export async function marcarMascotaAdoptada(id) {
  const respuesta = await fetch(`${ADOPCION_API_URL}/${id}/adoptada`, {
    method: "PUT",
  });

  if (!respuesta.ok) {
    throw new Error("No se pudo marcar la mascota como adoptada.");
  }

  return await respuesta.json();
}