import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, test, expect, vi, beforeEach } from "vitest";
import Reportar from "../src/pages/Reportar";

describe("Reportar - prueba editable e integral", () => {
  // DATOS EDITABLES 
  const nombreAnimal = "Pepi";
  const especieAnimal = "Perro";
  const razaAnimal = "Mestizo";
  const ubicacionAnimal = "Maipú";
  const contactoAnimal = "carla@test.com";

  beforeEach(() => {
    // Simula una respuesta correcta de la API al guardar el reporte.
    global.fetch = vi.fn(() =>
      Promise.resolve({
        ok: true,
        json: () =>
          Promise.resolve({
            id: 1,
            nombre: nombreAnimal,
            especie: especieAnimal,
            raza: razaAnimal
          })
      })
    );
  });

  // Esta función busca los inputs por su atributo name.
  // Sirve porque tu formulario usa name="nombreAnimal", name="especie", name="raza", etc.
  function obtenerCampo(container, nombreCampo) {
    const campo = container.querySelector(`[name="${nombreCampo}"]`);
    expect(campo).toBeInTheDocument();
    return campo;
  }

  // Esta prueba verifica que existan los campos principales del formulario.
  // Si se borra nombreAnimal, especie, raza o el botón guardar, la prueba falla.
  test("muestra los campos principales del formulario", () => {
    const { container } = render(<Reportar />);

    expect(obtenerCampo(container, "nombreAnimal")).toBeInTheDocument();
    expect(obtenerCampo(container, "especie")).toBeInTheDocument();
    expect(obtenerCampo(container, "raza")).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /guardar reporte/i })
    ).toBeInTheDocument();
  });

  // Esta prueba verifica que el usuario pueda escribir datos del animal.
  // Si algún input está eliminado o no permite escritura, la prueba falla.
  test("permite escribir nombre, especie y raza", async () => {
    const user = userEvent.setup();
    const { container } = render(<Reportar />);

    const nombre = obtenerCampo(container, "nombreAnimal");
    const especie = obtenerCampo(container, "especie");
    const raza = obtenerCampo(container, "raza");

    await user.type(nombre, nombreAnimal);
    await user.type(especie, especieAnimal);
    await user.type(raza, razaAnimal);

    expect(nombre).toHaveValue(nombreAnimal);
    expect(especie).toHaveValue(especieAnimal);
    expect(raza).toHaveValue(razaAnimal);
  });

  // Esta prueba verifica que no se guarde un reporte sin especie.
  // También revisa que NO se llame a la API si el formulario está incompleto.
  test("si falta la especie, muestra error y no llama a la API", async () => {
    const user = userEvent.setup();
    const { container } = render(<Reportar />);

    await user.type(obtenerCampo(container, "nombreAnimal"), nombreAnimal);
    await user.type(obtenerCampo(container, "raza"), razaAnimal);

    await user.click(screen.getByRole("button", { name: /guardar reporte/i }));

    expect(screen.getByText("La especie es obligatoria.")).toBeInTheDocument();
    expect(fetch).not.toHaveBeenCalled();
  });

  // Esta es una prueba de integración frontend.
  // Simula completar el formulario y presionar guardar.
  // Verifica que el frontend intente llamar a la API para registrar el reporte.
  test("con datos válidos llama a la API para guardar reporte", async () => {
    const user = userEvent.setup();
    const { container } = render(<Reportar />);

    await user.type(obtenerCampo(container, "nombreAnimal"), nombreAnimal);
    await user.type(obtenerCampo(container, "especie"), especieAnimal);
    await user.type(obtenerCampo(container, "raza"), razaAnimal);

    // Completa campos extra por si tu validación los exige.
    await user.type(obtenerCampo(container, "ubicacion"), ubicacionAnimal);
    await user.type(obtenerCampo(container, "contacto"), contactoAnimal);

    // Selecciona sexo.
    await user.click(screen.getByLabelText(/macho/i));

    // Selecciona estado reproductivo.
    await user.click(screen.getByLabelText(/^castrado$/i));

    await user.click(screen.getByRole("button", { name: /guardar reporte/i }));

    await waitFor(() => {
      expect(fetch).toHaveBeenCalled();
    });
  });
});