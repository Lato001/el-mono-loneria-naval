import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Accordion } from "./Accordion";

const items = [
  { id: "q1", q: "¿Pregunta uno?", a: "Respuesta uno" },
  { id: "q2", q: "¿Pregunta dos?", a: "Respuesta dos" },
];

describe("Accordion", () => {
  it("renders every question as a trigger button", () => {
    render(<Accordion items={items} />);
    expect(
      screen.getByRole("button", { name: /pregunta uno/i }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /pregunta dos/i }),
    ).toBeInTheDocument();
  });

  it("collapses every answer initially", () => {
    render(<Accordion items={items} />);
    expect(screen.queryByText("Respuesta uno")).not.toBeInTheDocument();
    expect(screen.queryByText("Respuesta dos")).not.toBeInTheDocument();
  });

  it("reveals the answer when its trigger is clicked", async () => {
    const user = userEvent.setup();
    render(<Accordion items={items} />);
    await user.click(screen.getByRole("button", { name: /pregunta uno/i }));
    expect(screen.getByText("Respuesta uno")).toBeInTheDocument();
  });

  it("closes the open item when its trigger is clicked again (collapsible)", async () => {
    const user = userEvent.setup();
    render(<Accordion items={items} />);
    const trigger = screen.getByRole("button", { name: /pregunta uno/i });
    await user.click(trigger);
    expect(screen.getByText("Respuesta uno")).toBeInTheDocument();
    await user.click(trigger);
    expect(screen.queryByText("Respuesta uno")).not.toBeInTheDocument();
  });

  it("keeps only one item open at a time (single mode)", async () => {
    const user = userEvent.setup();
    render(<Accordion items={items} />);
    await user.click(screen.getByRole("button", { name: /pregunta uno/i }));
    await user.click(screen.getByRole("button", { name: /pregunta dos/i }));
    expect(screen.getByText("Respuesta dos")).toBeInTheDocument();
    expect(screen.queryByText("Respuesta uno")).not.toBeInTheDocument();
  });
});
