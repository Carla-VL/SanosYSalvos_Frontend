# Sanos y Salvos - Frontend

Frontend del sistema **Sanos y Salvos**, una plataforma web enfocada en el registro, visualización y gestión de mascotas reportadas, mascotas en adopción, usuarios y ubicaciones asociadas a reportes.

Este repositorio corresponde a la capa visual del proyecto y se conecta con distintos microservicios mediante una API centralizada en el archivo `src/services/api.js`.

---
## Comandos
cd Front_Sanos_y_Salvos

npm install


## Variables de entorno

El proyecto utiliza Mapbox para mostrar mapas, por lo que se debe crear un archivo .env en la raíz de Front_Sanos_y_Salvos.


VITE_MAPBOX_TOKEN=tu_token_de_mapbox

## Para levantar el frontend en modo desarrollo:


npm run dev

## iniciar pruebas:
npm run test


npm run test:run


## Tecnologías utilizadas

- React
- Vite
- JavaScript
- Bootstrap
- Bootstrap Icons
- React Router DOM
- Mapbox GL
- Vitest
- Testing Library
- JS DOM

---

## Funcionalidades principales

- Inicio de sesión de usuarios.
- Registro de nuevos usuarios.
- Visualización de mascotas y reportes.
- Registro de reportes de mascotas.
- Visualización de ubicaciones en mapa.
- Perfil de usuario.
- Gestión básica de mascotas asociadas al usuario.
- Catálogo de adopción.
- Componentes reutilizables para tarjetas, navbar, footer, mapas y reportes.
- Pruebas unitarias e integrales del frontend.

---

## Estructura del proyecto

```bash
SanosYSalvos_Frontend/
│
├── Front_Sanos_y_Salvos/
│   ├── public/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Carrusel.jsx
│   │   │   ├── Footer.jsx
│   │   │   ├── MapaMascotas.jsx
│   │   │   ├── MapaResumen.jsx
│   │   │   ├── MascotaCard.jsx
│   │   │   ├── Navbar.jsx
│   │   │   ├── ReporteCard.jsx
│   │   │   ├── Servicios.jsx
│   │   │   └── Topbar.jsx
│   │   │
│   │   ├── pages/
│   │   │   ├── Adopcion.jsx
│   │   │   ├── Dashboard.jsx
│   │   │   ├── Inicio.jsx
│   │   │   ├── Login.jsx
│   │   │   ├── Mapa.jsx
│   │   │   ├── Mascotas.jsx
│   │   │   ├── Perfil.jsx
│   │   │   ├── Registro.jsx
│   │   │   ├── Reportar.jsx
│   │   │   └── Reportes.jsx
│   │   │
│   │   ├── services/
│   │   │   └── api.js
│   │   │
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── styles.css
│   │
│   ├── tests/
│   │   ├── Login.test.jsx
│   │   ├── Navbar.test.jsx
│   │   ├── Registro.test.jsx
│   │   ├── Reportar.test.jsx
│   │   └── setup.js
│   │
│   ├── package.json
│   ├── vite.config.js
│   └── README.md
