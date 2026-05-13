import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import Login from "../src/pages/Login";

describe("Login", () => {
  test("muestra errores si se intenta iniciar sesión con campos vacíos", async () => {
    const user = userEvent.setup();

    render(<Login setPagina={() => {}} />);

    await user.click(screen.getByRole("button", { name: /iniciar sesión/i }));

    expect(screen.getByText("El correo es obligatorio.")).toBeInTheDocument();
    expect(screen.getByText("La contraseña es obligatoria.")).toBeInTheDocument();
  });
});