const API_IA = (
  import.meta.env.VITE_API_IA || "http://localhost:9000/api/ia"
).replace(/\/+$/, "");


const API_BFF = (
  import.meta.env.VITE_API_BFF ||
  "http://localhost:8085/api/bff"
).replace(/\/+$/, "");

const API_LOGIN = (
  import.meta.env.VITE_API_LOGIN ||
  "http://localhost:8082/api/auth"
).replace(/\/+$/, "");

const API_USUARIOS = (
  import.meta.env.VITE_API_USUARIOS ||
  "http://localhost:8083/api/usuarios"
).replace(/\/+$/, "");

const API_GEO = (
  import.meta.env.VITE_API_GEO ||
  "http://localhost:8084/api/geo"
).replace(/\/+$/, "");

const ADOPCION_API_URL = (
  import.meta.env.VITE_API_ADOPCION ||
  "http://localhost:8086/api/adopcion"
).replace(/\/+$/, "");

// =======================
// FUNCIONES AUXILIARES
// =======================

function convertirTextoAJson(texto) {
  if (!texto) return null;

  try {
    return JSON.parse(texto);
  } catch {
    return texto;
  }
}

async function verificarRegistroConLogin(username, password) {
  try {
    const respuesta = await fetch(`${API_LOGIN}/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ username, password }),
    });

    return respuesta.ok;
  } catch (error) {
    console.error("No se pudo verificar el registro con login:", error);
    return false;
  }
}

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

  return convertirTextoAJson(texto);
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

  return convertirTextoAJson(texto);
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

  const texto = await respuesta.text();

  console.log("Respuesta login status:", respuesta.status);
  console.log("Respuesta login texto:", texto);

  if (!respuesta.ok) {
    throw new Error("Error al iniciar sesión");
  }

  return convertirTextoAJson(texto);
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

  console.log("Enviando usuario a MS_USUARIOS:", body);

  const respuesta = await fetch(`${API_USUARIOS}/registrar`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });

  const texto = await respuesta.text();

  console.log("Respuesta registrarUsuario status:", respuesta.status);
  console.log("Respuesta registrarUsuario texto:", texto);

  if (!respuesta.ok) {
    /*
      Parche importante:
      Si el backend responde 500, pero el usuario igual quedó creado,
      verificamos intentando iniciar sesión con los mismos datos.
      Si el login funciona, tratamos el registro como exitoso.
    */
    if (respuesta.status === 500) {
      const usuarioFueCreado = await verificarRegistroConLogin(
        body.username,
        body.password
      );

      if (usuarioFueCreado) {
        console.warn(
          "El backend respondió 500, pero el usuario sí fue creado correctamente."
        );

        return {
          mensaje: "Usuario registrado correctamente",
          usuarioCreado: true,
          username: body.username,
          email: body.email,
          rol: body.rol,
        };
      }
    }

    const error = new Error(
      texto || `Error al registrar usuario. Status: ${respuesta.status}`
    );

    error.status = respuesta.status;
    error.respuesta = texto;

    throw error;
  }

  const data = convertirTextoAJson(texto);

  if (typeof data === "string") {
    return {
      mensaje: data || "Usuario registrado correctamente",
      usuarioCreado: true,
      username: body.username,
      email: body.email,
      rol: body.rol,
    };
  }

  return data || {
    mensaje: "Usuario registrado correctamente",
    usuarioCreado: true,
    username: body.username,
    email: body.email,
    rol: body.rol,
  };
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

  return convertirTextoAJson(texto) || [];
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

  return convertirTextoAJson(texto);
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

  const texto = await respuesta.text();

  console.log("Respuesta registrarMascotaAdopcion status:", respuesta.status);
  console.log("Respuesta registrarMascotaAdopcion texto:", texto);

  if (!respuesta.ok) {
    throw new Error("No se pudo registrar la mascota en adopción.");
  }

  return convertirTextoAJson(texto);
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

  const texto = await respuesta.text();

  console.log("Respuesta marcarMascotaAdoptada status:", respuesta.status);
  console.log("Respuesta marcarMascotaAdoptada texto:", texto);

  if (!respuesta.ok) {
    throw new Error("No se pudo marcar la mascota como adoptada.");
  }

  return convertirTextoAJson(texto);
}

// =======================
// INTELIGENCIA ARTIFICIAL
// =======================

export async function analizarImagenMascota(archivoImagen) {
  if (!archivoImagen) {
    throw new Error("Debes seleccionar una fotografía.");
  }

  const formData = new FormData();
  formData.append("imagen", archivoImagen);

  const respuesta = await fetch(`${API_IA}/analizar`, {
    method: "POST",
    body: formData,
  });

  const texto = await respuesta.text();

  console.log("Respuesta IA status:", respuesta.status);
  console.log("Respuesta IA texto:", texto);

  if (!respuesta.ok) {
    throw new Error(
      texto || "No se pudo analizar la fotografía de la mascota."
    );
  }

  return texto;
}