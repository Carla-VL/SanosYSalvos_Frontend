import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, test, expect, vi, beforeEach } from "vitest";
import Login from "../src/pages/Login";

describe("Login - prueba editable e integral", () => {
  // DATOS EDITABLES 
  const correoPrueba = "carla@test.com";
  const passwordPrueba = "Carla123";

  beforeEach(() => {
    localStorage.clear();

    // Simula una respuesta correcta de la API de login.
    global.fetch = vi.fn(() =>
      Promise.resolve({
        ok: true,
        text: () =>
          Promise.resolve(
            JSON.stringify({
              token: "token-prueba",
              usuario: {
                id: 1,
                nombre: "Carla",
                correo: correoPrueba,
              },
            })
          ),
      })
    );
  });

  // Busca un campo por su atributo name.
  // Esto sirve porque tus inputs reales tienen name="correo" y name="password".
  function obtenerCampo(container, nombreCampo) {
    const campo = container.querySelector(`[name="${nombreCampo}"]`);
    expect(campo).toBeInTheDocument();
    return campo;
  }

  // Verifica que existan correo, contraseña y botón.
  test("muestra los campos necesarios para iniciar sesión", () => {
    const { container } = render(<Login setPagina={() => {}} />);

    expect(obtenerCampo(container, "correo")).toBeInTheDocument();
    expect(obtenerCampo(container, "password")).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /iniciar sesión/i })
    ).toBeInTheDocument();
  });

  // Verifica que el usuario pueda escribir correo y contraseña.
  test("permite escribir correo y contraseña", async () => {
    const user = userEvent.setup();
    const { container } = render(<Login setPagina={() => {}} />);

    const correo = obtenerCampo(container, "correo");
    const password = obtenerCampo(container, "password");

    await user.type(correo, correoPrueba);
    await user.type(password, passwordPrueba);

    expect(correo).toHaveValue(correoPrueba);
    expect(password).toHaveValue(passwordPrueba);
  });

  // Verifica que no se pueda iniciar sesión sin contraseña.
  // Además, confirma que no se llama a la API si falta un dato obligatorio.
  test("si falta la contraseña, muestra error y no llama a la API", async () => {
    const user = userEvent.setup();
    const { container } = render(<Login setPagina={() => {}} />);

    await user.type(obtenerCampo(container, "correo"), correoPrueba);
    await user.click(screen.getByRole("button", { name: /iniciar sesión/i }));

    expect(screen.getByText("La contraseña es obligatoria.")).toBeInTheDocument();
    expect(fetch).not.toHaveBeenCalled();
  });

  // Prueba de integración frontend:
  // usuario escribe datos válidos, presiona el botón y el front llama a la API.
  test("con datos válidos llama a la API de login", async () => {
    const user = userEvent.setup();
    const { container } = render(<Login setPagina={() => {}} />);

    await user.type(obtenerCampo(container, "correo"), correoPrueba);
    await user.type(obtenerCampo(container, "password"), passwordPrueba);

    await user.click(screen.getByRole("button", { name: /iniciar sesión/i }));

    await waitFor(() => {
      expect(fetch).toHaveBeenCalled();
    });
  });
});