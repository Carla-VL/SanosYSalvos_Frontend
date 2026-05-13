import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import Navbar from "../src/components/Navbar";

describe("Navbar", () => {
  test("muestra las opciones principales del menú", () => {
    render(<Navbar pagina="inicio" setPagina={() => {}} />);

    expect(screen.getByText("Inicio")).toBeInTheDocument();
    expect(screen.getByText("Mascotas")).toBeInTheDocument();
    expect(screen.getByText("Reportar")).toBeInTheDocument();
    expect(screen.getByText("Reportes")).toBeInTheDocument();
    expect(screen.getByText("Mapa")).toBeInTheDocument();
    expect(screen.getByText("Iniciar sesión")).toBeInTheDocument();
    expect(screen.getByText("Registrarse")).toBeInTheDocument();
  });

  test("al hacer clic en Mapa llama a setPagina con mapa", async () => {
    const user = userEvent.setup();
    const setPaginaMock = vi.fn();

    render(<Navbar pagina="inicio" setPagina={setPaginaMock} />);

    await user.click(screen.getByText("Mapa"));

    expect(setPaginaMock).toHaveBeenCalledWith("mapa");
  });
});
