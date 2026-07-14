const API_BFF = (
  import.meta.env.VITE_BFF_URL ||
  import.meta.env.VITE_API_BFF ||
  "http://localhost:8085/api/bff"
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
    const respuesta = await fetch(`${API_BFF}/auth/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        username,
        password,
      }),
    });

    return respuesta.ok;
  } catch (error) {
    console.error(
      "No se pudo verificar el registro con login:",
      error
    );

    return false;
  }
}

// =======================
// MASCOTAS / REPORTES
// =======================

export async function obtenerMascotas() {
  const respuesta = await fetch(
    `${API_BFF}/mascotas/listar`
  );

  if (!respuesta.ok) {
    const texto = await respuesta.text();

    throw new Error(
      texto || "Error al obtener mascotas"
    );
  }

  return await respuesta.json();
}

export async function obtenerReportes() {
  const respuesta = await fetch(
    `${API_BFF}/mascotas/listar`
  );

  if (!respuesta.ok) {
    const texto = await respuesta.text();

    throw new Error(
      texto || "Error al obtener reportes"
    );
  }

  return await respuesta.json();
}

export async function crearReporte(reporte, tipo) {
  const token = localStorage.getItem("token");

  const tipoCodificado = tipo
    ? encodeURIComponent(tipo)
    : null;

  const url = tipoCodificado
    ? `${API_BFF}/mascotas/reportar?tipo=${tipoCodificado}`
    : `${API_BFF}/mascotas/reportar`;

  const headers = {
    "Content-Type": "application/json",
  };

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  const respuesta = await fetch(url, {
    method: "POST",
    headers,
    body: JSON.stringify(reporte),
  });

  const texto = await respuesta.text();

  console.log(
    "Respuesta crearReporte status:",
    respuesta.status
  );

  console.log(
    "Respuesta crearReporte texto:",
    texto
  );

  if (!respuesta.ok) {
    throw new Error(
      `Error al crear el reporte. Status: ${respuesta.status}. Respuesta: ${texto}`
    );
  }

  return convertirTextoAJson(texto);
}

// =======================
// DETALLE DE MASCOTA
// =======================

export async function obtenerDetalleMascota(id) {
  const respuesta = await fetch(
    `${API_BFF}/mascotas/detalle/${id}`
  );

  const texto = await respuesta.text();

  if (!respuesta.ok) {
    throw new Error(
      texto || "No se pudo obtener el detalle de la mascota."
    );
  }

  return convertirTextoAJson(texto);
}

// =======================
// GEOLOCALIZACIÓN
// =======================

export async function registrarUbicacion(ubicacion) {
  console.log(
    "Enviando ubicación al BFF:",
    ubicacion
  );

  const respuesta = await fetch(
    `${API_BFF}/geo/registrar`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(ubicacion),
    }
  );

  const texto = await respuesta.text();

  console.log(
    "Respuesta GEO status:",
    respuesta.status
  );

  console.log(
    "Respuesta GEO texto:",
    texto
  );

  if (!respuesta.ok) {
    throw new Error(
      `Error al registrar ubicación. Status: ${respuesta.status}. Respuesta: ${texto}`
    );
  }

  return convertirTextoAJson(texto);
}

export async function listarUbicaciones() {
  const respuesta = await fetch(
    `${API_BFF}/geo/listar`
  );

  const texto = await respuesta.text();

  if (!respuesta.ok) {
    throw new Error(
      texto || "Error al listar ubicaciones"
    );
  }

  return convertirTextoAJson(texto) || [];
}

export async function obtenerUbicacionesMascota(id) {
  const respuesta = await fetch(
    `${API_BFF}/geo/mascota/${id}`
  );

  const texto = await respuesta.text();

  if (!respuesta.ok) {
    throw new Error(
      texto || "Error al obtener el historial de ubicación."
    );
  }

  return convertirTextoAJson(texto) || [];
}

// =======================
// LOGIN
// =======================

export async function login(username, password) {
  const respuesta = await fetch(
    `${API_BFF}/auth/login`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        username,
        password,
      }),
    }
  );

  const texto = await respuesta.text();

  console.log(
    "Respuesta login status:",
    respuesta.status
  );

  console.log(
    "Respuesta login texto:",
    texto
  );

  if (!respuesta.ok) {
    throw new Error(
      texto || "Error al iniciar sesión"
    );
  }

  return convertirTextoAJson(texto);
}

// =======================
// USUARIOS
// =======================

export async function registrarUsuario(usuarioData) {
  const correo =
    usuarioData.email ||
    usuarioData.correo;

  const usernameGenerado = correo
    ? correo
        .split("@")[0]
        .replace(/[^a-zA-Z0-9]/g, "")
    : usuarioData.username;

  const body = {
    username:
      usuarioData.username ||
      usernameGenerado,

    password:
      usuarioData.password,

    email:
      correo,

    nombreCompleto:
      usuarioData.nombreCompleto ||
      usuarioData.nombrecompleto,

    rol:
      usuarioData.rol ||
      "USER",
  };

  console.log(
    "Enviando usuario al BFF:",
    body
  );

  const respuesta = await fetch(
    `${API_BFF}/auth/registrar`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    }
  );

  const texto = await respuesta.text();

  console.log(
    "Respuesta registrarUsuario status:",
    respuesta.status
  );

  console.log(
    "Respuesta registrarUsuario texto:",
    texto
  );

  if (!respuesta.ok) {
    /*
     * Si el backend devuelve 500, verificamos si el
     * usuario igualmente fue creado intentando iniciar sesión.
     */
    if (respuesta.status === 500) {
      const usuarioFueCreado =
        await verificarRegistroConLogin(
          body.username,
          body.password
        );

      if (usuarioFueCreado) {
        console.warn(
          "El backend respondió 500, pero el usuario sí fue creado."
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
      texto ||
        `Error al registrar usuario. Status: ${respuesta.status}`
    );

    error.status = respuesta.status;
    error.respuesta = texto;

    throw error;
  }

  const data = convertirTextoAJson(texto);

  if (typeof data === "string") {
    return {
      mensaje:
        data ||
        "Usuario registrado correctamente",

      usuarioCreado: true,
      username: body.username,
      email: body.email,
      rol: body.rol,
    };
  }

  return (
    data || {
      mensaje: "Usuario registrado correctamente",
      usuarioCreado: true,
      username: body.username,
      email: body.email,
      rol: body.rol,
    }
  );
}

export function obtenerUsuarioActual() {
  const usuario = localStorage.getItem("usuario");

  return usuario
    ? JSON.parse(usuario)
    : null;
}

export function existeSesionActiva() {
  return Boolean(
    localStorage.getItem("token")
  );
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
    console.error(
      "No hay token guardado"
    );

    return [];
  }

  const respuesta = await fetch(
    `${API_BFF}/mascotas/mis-mascotas`,
    {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  const texto = await respuesta.text();

  console.log(
    "Respuesta obtenerMisMascotas status:",
    respuesta.status
  );

  console.log(
    "Respuesta obtenerMisMascotas texto:",
    texto
  );

  if (!respuesta.ok) {
    console.error(
      "Error al obtener mis mascotas:",
      respuesta.status,
      texto
    );

    return [];
  }

  return convertirTextoAJson(texto) || [];
}

export async function agregarMiMascota(mascota) {
  const token = localStorage.getItem("token");

  if (!token) {
    throw new Error(
      "Debes iniciar sesión para registrar una mascota."
    );
  }

  const mascotaParaEnviar = {
    ...mascota,

    especie:
      mascota.especie ||
      mascota.tipo,

    estadoReporte:
      mascota.estadoReporte ||
      "REGISTRO NORMAL",
  };

  delete mascotaParaEnviar.tipo;
  delete mascotaParaEnviar.dueñoId;
  delete mascotaParaEnviar.duenoId;
  delete mascotaParaEnviar.dueño_id;
  delete mascotaParaEnviar.dueno_id;

  const respuesta = await fetch(
    `${API_BFF}/mascotas/reportar`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(mascotaParaEnviar),
    }
  );

  const texto = await respuesta.text();

  console.log(
    "Respuesta agregarMiMascota status:",
    respuesta.status
  );

  console.log(
    "Respuesta agregarMiMascota texto:",
    texto
  );

  if (!respuesta.ok) {
    throw new Error(
      `Error al registrar mascota. Status: ${respuesta.status}. Respuesta: ${texto}`
    );
  }

  return convertirTextoAJson(texto);
}

export async function eliminarMiMascota(id) {
  console.warn(
    `La eliminación de mascotas de usuario todavía no está disponible en el BFF. ID: ${id}`
  );

  return false;
}

// =======================
// ADOPCIÓN
// =======================

export async function obtenerMascotasAdopcion() {
  const respuesta = await fetch(
    `${API_BFF}/adopcion/catalogo`
  );

  const texto = await respuesta.text();

  if (!respuesta.ok) {
    throw new Error(
      texto ||
        "No se pudieron cargar las mascotas en adopción."
    );
  }

  return convertirTextoAJson(texto) || [];
}

export async function listarMascotasAdopcion() {
  return await obtenerMascotasAdopcion();
}

export async function obtenerDetalleAdopcion(id) {
  const respuesta = await fetch(
    `${API_BFF}/adopcion/catalogo/detalle/${id}`
  );

  const texto = await respuesta.text();

  if (!respuesta.ok) {
    throw new Error(
      texto ||
        "No se pudo obtener el detalle de adopción."
    );
  }

  return convertirTextoAJson(texto);
}

export async function obtenerMascotasAdopcionPorEspecie(
  especie
) {
  const especieCodificada =
    encodeURIComponent(especie);

  const respuesta = await fetch(
    `${API_BFF}/adopcion/catalogo/especie/${especieCodificada}`
  );

  const texto = await respuesta.text();

  if (!respuesta.ok) {
    throw new Error(
      texto ||
        "No se pudieron filtrar las mascotas por especie."
    );
  }

  return convertirTextoAJson(texto) || [];
}

export async function obtenerMascotasAdopcionPorUbicacion(
  ubicacion
) {
  const ubicacionCodificada =
    encodeURIComponent(ubicacion);

  const respuesta = await fetch(
    `${API_BFF}/adopcion/catalogo/ubicacion/${ubicacionCodificada}`
  );

  const texto = await respuesta.text();

  if (!respuesta.ok) {
    throw new Error(
      texto ||
        "No se pudieron filtrar las mascotas por ubicación."
    );
  }

  return convertirTextoAJson(texto) || [];
}

/*
 * Estas funciones todavía no tienen una ruta equivalente
 * en el BFFcontroller actual.
 */

export async function registrarMascotaAdopcion(
  datosMascota
) {
  console.error(
    "El BFF todavía no tiene una ruta POST para registrar adopciones.",
    datosMascota
  );

  throw new Error(
    "El registro de mascotas en adopción todavía no está habilitado en el BFF."
  );
}

export async function obtenerMascotasAdopcionVeterinaria(
  contacto
) {
  console.error(
    "El BFF todavía no tiene una ruta para buscar adopciones por veterinaria.",
    contacto
  );

  throw new Error(
    "La búsqueda de adopciones por veterinaria todavía no está habilitada en el BFF."
  );
}

export async function marcarMascotaAdoptada(id) {
  console.error(
    "El BFF todavía no tiene una ruta para marcar una mascota como adoptada.",
    id
  );

  throw new Error(
    "La función para marcar una mascota como adoptada todavía no está habilitada en el BFF."
  );
}

// =======================
// INTELIGENCIA ARTIFICIAL
// =======================

export async function analizarImagenMascota(
  archivoImagen
) {
  if (!archivoImagen) {
    throw new Error(
      "Debes seleccionar una fotografía."
    );
  }

  const formData = new FormData();

  formData.append(
    "imagen",
    archivoImagen
  );

  const respuesta = await fetch(
    `${API_BFF}/mascotas/buscar-por-imagen`,
    {
      method: "POST",
      body: formData,
    }
  );

  const texto = await respuesta.text();

  console.log(
    "Respuesta IA status:",
    respuesta.status
  );

  console.log(
    "Respuesta IA texto:",
    texto
  );

  if (!respuesta.ok) {
    throw new Error(
      texto ||
        "No se pudo buscar la mascota mediante la fotografía."
    );
  }

  return convertirTextoAJson(texto);
}

// =======================
// DASHBOARD
// =======================

export async function obtenerResumenDashboard() {
  const respuesta = await fetch(
    `${API_BFF}/dashboard/resumen`
  );

  const texto = await respuesta.text();

  if (!respuesta.ok) {
    throw new Error(
      texto ||
        "No se pudo cargar el resumen del dashboard."
    );
  }

  return convertirTextoAJson(texto);
}

export async function obtenerUltimosReportes() {
  const respuesta = await fetch(
    `${API_BFF}/mascotas/ultimos`
  );

  const texto = await respuesta.text();

  if (!respuesta.ok) {
    throw new Error(
      texto ||
        "No se pudieron cargar los últimos reportes."
    );
  }

  return convertirTextoAJson(texto) || [];
}

export { API_BFF };