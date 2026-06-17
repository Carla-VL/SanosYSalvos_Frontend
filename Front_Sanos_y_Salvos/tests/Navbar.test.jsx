import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, test, expect, vi } from "vitest";
import Navbar from "../src/components/Navbar";

describe("Navbar - navegación editable", () => {
  // Esta prueba verifica que el menú tenga las opciones principales.
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

  // Esta prueba verifica la integración entre el botón Mapa y la navegación.
  // Si el botón existe pero manda a otra página incorrecta, la prueba falla.
  test("al hacer clic en Mapa cambia a la página mapa", async () => {
    const user = userEvent.setup();
    const setPaginaMock = vi.fn();

    render(<Navbar pagina="inicio" setPagina={setPaginaMock} />);

    await user.click(screen.getByText("Mapa"));

    expect(setPaginaMock).toHaveBeenCalledWith("mapa");
  });

  // Esta prueba verifica que la opción Reportar navegue correctamente.
  // Si se cambia mal la ruta esperada, la prueba falla.
  test("al hacer clic en Reportar cambia a la página reportar", async () => {
    const user = userEvent.setup();
    const setPaginaMock = vi.fn();

    render(<Navbar pagina="inicio" setPagina={setPaginaMock} />);

    await user.click(screen.getByText("Reportar"));

    expect(setPaginaMock).toHaveBeenCalledWith("reportar");
  });

  // Esta prueba verifica que la opción Iniciar sesión lleve al login.
  // Si el menú ya no permite entrar al login, la prueba falla.
  test("al hacer clic en Iniciar sesión cambia a login", async () => {
    const user = userEvent.setup();
    const setPaginaMock = vi.fn();

    render(<Navbar pagina="inicio" setPagina={setPaginaMock} />);

    await user.click(screen.getByText("Iniciar sesión"));

    expect(setPaginaMock).toHaveBeenCalledWith("login");
  });
});