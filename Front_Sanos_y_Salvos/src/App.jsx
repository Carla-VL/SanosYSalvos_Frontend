import { useState } from "react";
import Topbar from "./components/Topbar";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Inicio from "./pages/Inicio";
import Mascotas from "./pages/Mascotas";
import Reportar from "./pages/Reportar";
import Reportes from "./pages/Reportes";

function App() {
  const [pagina, setPagina] = useState("inicio");

  return (
    <>
      <Topbar />
      <Navbar setPagina={setPagina} />

      <main>
        {pagina === "inicio" && <Inicio setPagina={setPagina} />}
        {pagina === "mascotas" && <Mascotas />}
        {pagina === "reportar" && <Reportar />}
        {pagina === "reportes" && <Reportes />}
      </main>

      <Footer />
    </>
  );
}

export default App;