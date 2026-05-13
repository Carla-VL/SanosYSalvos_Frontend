import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import Registro from "../src/pages/Registro";

describe("Registro", () => {
  test("muestra errores si se intenta registrar con campos vacíos", async () => {
    const user = userEvent.setup();

    render(<Registro setPagina={() => {}} />);

    await user.click(screen.getByRole("button", { name: /crear cuenta/i }));

    expect(screen.getByText("El nombre es obligatorio.")).toBeInTheDocument();
    expect(screen.getByText("El correo es obligatorio.")).toBeInTheDocument();
    expect(screen.getByText("La contraseña es obligatoria.")).toBeInTheDocument();
  });
});