import { useEffect, useState } from "react";
import Topbar from "./components/Topbar";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Inicio from "./pages/Inicio";
import Mascotas from "./pages/Mascotas";
import Reportar from "./pages/Reportar";
import Reportes from "./pages/Reportes";
import Login from "./pages/Login";
import Registro from "./pages/Registro";
import Mapa from "./pages/Mapa";


function App() {
  const [pagina, setPagina] = useState("inicio");

  useEffect(() => {
    const elementos = document.querySelectorAll(".reveal");

    const mostrarElemento = () => {
      elementos.forEach((elemento) => {
        const posicion = elemento.getBoundingClientRect().top;
        const altoPantalla = window.innerHeight;

        if (posicion < altoPantalla - 80) {
          elemento.classList.add("reveal-visible");
        }
      });
    };

    mostrarElemento();
    window.addEventListener("scroll", mostrarElemento);

    return () => {
      window.removeEventListener("scroll", mostrarElemento);
    };
  }, [pagina]);

  return (
    <>
      <Topbar />
      <Navbar setPagina={setPagina} pagina={pagina} />

      <main>
        {pagina === "inicio" && <Inicio setPagina={setPagina} />}
        {pagina === "mascotas" && <Mascotas />}
        {pagina === "reportar" && <Reportar />}
        {pagina === "reportes" && <Reportes />}
        {pagina === "login" && <Login setPagina={setPagina} />}
        {pagina === "registro" && <Registro setPagina={setPagina} />}
        {pagina === "mapa" && <Mapa />}
      </main>

      <Footer />
    </>
  );
}

export default App;