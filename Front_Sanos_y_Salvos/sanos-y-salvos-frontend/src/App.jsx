import { useState } from "react";
import Navbar from "./components/Navbar";
import Inicio from "./pages/Inicio";
import Mascotas from "./pages/Mascotas";
import Reportar from "./pages/Reportar";
import Reportes from "./pages/Reportes";

function App() {
  const [pagina, setPagina] = useState("inicio");

  return (
    <>
      <Navbar setPagina={setPagina} />

      <main>
        {pagina === "inicio" && <Inicio setPagina={setPagina} />}
        {pagina === "mascotas" && <Mascotas />}
        {pagina === "reportar" && <Reportar />}
        {pagina === "reportes" && <Reportes />}
      </main>
    </>
  );
}

export default App;