const API_BFF = "http://localhost:8085/api/bff";           
const API_LOGIN = "http://localhost:8081/api/auth";         
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