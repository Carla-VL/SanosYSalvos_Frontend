import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import Reportar from "../src/pages/Reportar";

describe("Reportar", () => {
  test("muestra errores si faltan datos obligatorios del animal", async () => {
    const user = userEvent.setup();

    render(<Reportar />);

    await user.click(screen.getByRole("button", { name: /guardar reporte/i }));

    expect(screen.getByText("El nombre del animal es obligatorio.")).toBeInTheDocument();
    expect(screen.getByText("La especie es obligatoria.")).toBeInTheDocument();
    expect(screen.getByText("La raza es obligatoria.")).toBeInTheDocument();
    expect(screen.getByText("Debes seleccionar el sexo del animal.")).toBeInTheDocument();
    expect(screen.getByText("Debes seleccionar el estado reproductivo.")).toBeInTheDocument();
  });
});