import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, test, expect, vi, beforeEach } from "vitest";
import Registro from "../src/pages/Registro";

describe("Registro - prueba editable e integral", () => {
  // DATOS EDITABLES
  const nombrePrueba = "Carla Vasquez";
  const correoPrueba = "carla@test.com";
  const passwordPrueba = "Carla123";

  beforeEach(() => {
    global.fetch = vi.fn(() =>
      Promise.resolve({
        ok: true,
        status: 200,
        text: () =>
          Promise.resolve(
            JSON.stringify({
              id: 1,
              nombre: nombrePrueba,
              correo: correoPrueba,
            })
          ),
      })
    );
  });

  // Busca campos por atributo name.
  // Si se borra un campo del componente, esta función hace fallar la prueba.
  function obtenerCampo(container, nombreCampo) {
    const campo = container.querySelector(`[name="${nombreCampo}"]`);
    expect(campo).toBeInTheDocument();
    return campo;
  }

  // Esta prueba valida que los datos editables usados como "válidos" no estén vacíos.
  // Si cambias nombrePrueba = "", esta prueba falla.
  test("los datos editables válidos no deben estar vacíos", () => {
    expect(nombrePrueba.trim()).not.toBe("");
    expect(correoPrueba.trim()).not.toBe("");
    expect(passwordPrueba.trim()).not.toBe("");
  });

  // Verifica que existan los campos obligatorios del formulario.
  // Si se borra nombre, correo, contraseña, confirmar contraseña o botón, la prueba falla.
  test("muestra los campos necesarios para crear cuenta", () => {
    const { container } = render(<Registro setPagina={() => {}} />);

    expect(obtenerCampo(container, "nombrecompleto")).toBeInTheDocument();
    expect(obtenerCampo(container, "correo")).toBeInTheDocument();
    expect(obtenerCampo(container, "password")).toBeInTheDocument();
    expect(obtenerCampo(container, "confirmarPassword")).toBeInTheDocument();

    expect(
      screen.getByRole("button", { name: /crear cuenta/i })
    ).toBeInTheDocument();
  });

  // Verifica que el usuario pueda escribir en todos los campos del registro.
  // Si un input está eliminado o bloqueado, la prueba falla.
  test("permite escribir nombre, correo y contraseña", async () => {
    const user = userEvent.setup();
    const { container } = render(<Registro setPagina={() => {}} />);

    const nombre = obtenerCampo(container, "nombrecompleto");
    const correo = obtenerCampo(container, "correo");
    const password = obtenerCampo(container, "password");
    const confirmarPassword = obtenerCampo(container, "confirmarPassword");

    await user.type(nombre, nombrePrueba);
    await user.type(correo, correoPrueba);
    await user.type(password, passwordPrueba);
    await user.type(confirmarPassword, passwordPrueba);

    expect(nombre).toHaveValue(nombrePrueba);
    expect(correo).toHaveValue(correoPrueba);
    expect(password).toHaveValue(passwordPrueba);
    expect(confirmarPassword).toHaveValue(passwordPrueba);
  });

  // Verifica que no se pueda crear cuenta sin nombre.
  // Además confirma que no se llama a la API si falta ese dato obligatorio.
  test("si falta el nombre, muestra error y no llama a la API", async () => {
    const user = userEvent.setup();
    const { container } = render(<Registro setPagina={() => {}} />);

    await user.type(obtenerCampo(container, "correo"), correoPrueba);
    await user.type(obtenerCampo(container, "password"), passwordPrueba);
    await user.type(obtenerCampo(container, "confirmarPassword"), passwordPrueba);

    await user.click(screen.getByRole("button", { name: /crear cuenta/i }));

    expect(screen.getByText("El nombre es obligatorio.")).toBeInTheDocument();
    expect(fetch).not.toHaveBeenCalled();
  });

  // Verifica que no se pueda crear cuenta sin correo.
  // Además confirma que no se llama a la API si falta ese dato obligatorio.
  test("si falta el correo, muestra error y no llama a la API", async () => {
    const user = userEvent.setup();
    const { container } = render(<Registro setPagina={() => {}} />);

    await user.type(obtenerCampo(container, "nombrecompleto"), nombrePrueba);
    await user.type(obtenerCampo(container, "password"), passwordPrueba);
    await user.type(obtenerCampo(container, "confirmarPassword"), passwordPrueba);

    await user.click(screen.getByRole("button", { name: /crear cuenta/i }));

    expect(screen.getByText("El correo es obligatorio.")).toBeInTheDocument();
    expect(fetch).not.toHaveBeenCalled();
  });

  // Verifica que no se pueda crear cuenta sin contraseña.
  // Si falta la contraseña, no debe llamar a la API.
  test("si falta la contraseña, muestra error y no llama a la API", async () => {
    const user = userEvent.setup();
    const { container } = render(<Registro setPagina={() => {}} />);

    await user.type(obtenerCampo(container, "nombrecompleto"), nombrePrueba);
    await user.type(obtenerCampo(container, "correo"), correoPrueba);

    await user.click(screen.getByRole("button", { name: /crear cuenta/i }));

    expect(screen.getByText("La contraseña es obligatoria.")).toBeInTheDocument();
    expect(fetch).not.toHaveBeenCalled();
  });

  // Prueba de integración frontend:
  // Llena el formulario completo y verifica que el frontend llame a la API.
  test("con datos válidos llama a la API de registro", async () => {
    const user = userEvent.setup();
    const { container } = render(<Registro setPagina={() => {}} />);

    await user.type(obtenerCampo(container, "nombrecompleto"), nombrePrueba);
    await user.type(obtenerCampo(container, "correo"), correoPrueba);
    await user.type(obtenerCampo(container, "password"), passwordPrueba);
    await user.type(obtenerCampo(container, "confirmarPassword"), passwordPrueba);

    await user.click(screen.getByRole("button", { name: /crear cuenta/i }));

    await waitFor(() => {
      expect(fetch).toHaveBeenCalled();
    });
  });
});