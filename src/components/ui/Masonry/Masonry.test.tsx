import { render, screen, fireEvent } from "@testing-library/react";
import Masonry from "./Masonry";

// jsdom never measures layout, so the component's own ResizeObserver never
// fires and `width` stays 0 (→ empty grid). Emit a width synchronously on
// observe so the packing algorithm actually lays out the cells.
class MockResizeObserver {
  private callback: ResizeObserverCallback;

  constructor(callback: ResizeObserverCallback) {
    this.callback = callback;
  }

  observe(target: Element) {
    const entry = {
      target,
      contentRect: {
        width: 900,
        height: 600,
        top: 0,
        left: 0,
        bottom: 600,
        right: 900,
      },
    } as ResizeObserverEntry;
    this.callback([entry], this as unknown as ResizeObserver);
  }

  unobserve() {}
  disconnect() {}
}

beforeAll(() => {
  globalThis.ResizeObserver =
    MockResizeObserver as unknown as typeof ResizeObserver;
});

const items = [
  { id: "a", img: "/a.jpg", alt: "Foto A" },
  { id: "b", img: "/b.jpg", alt: "Foto B" },
  {
    id: "c",
    img: "/c.jpg",
    alt: "Foto C",
    redirectUrl: "/trabajos",
    title: "Capota azul",
    eyebrow: "Portfolio",
    chips: ["A medida"],
  },
];

describe("Masonry", () => {
  it("renders every item as an image cell", () => {
    render(<Masonry items={items} />);
    expect(screen.getByAltText("Foto A")).toBeInTheDocument();
    expect(screen.getByAltText("Foto B")).toBeInTheDocument();
    expect(screen.getByAltText("Foto C")).toBeInTheDocument();
  });

  it("renders title, eyebrow and chips for redirect items", () => {
    render(<Masonry items={items} />);
    expect(screen.getByText("Capota azul")).toBeInTheDocument();
    expect(screen.getByText("Portfolio")).toBeInTheDocument();
    expect(screen.getByText("A medida")).toBeInTheDocument();
  });

  it("calls onItemClick with the item and index instead of opening the modal", () => {
    const onItemClick = vi.fn();
    render(<Masonry items={items} onItemClick={onItemClick} />);
    fireEvent.click(screen.getByAltText("Foto A").closest("[data-key]")!);
    expect(onItemClick).toHaveBeenCalledTimes(1);
    const [item, index] = onItemClick.mock.calls[0];
    // The item is enriched with grid coordinates (x/y/w/h) during packing.
    expect(index).toBe(0);
    expect(item.id).toBe("a");
    expect(item).toMatchObject({ x: expect.any(Number), y: expect.any(Number) });
  });

  it("renders the footer slot below the grid", () => {
    render(
      <Masonry
        items={items}
        footer={<button type="button">Cargar más</button>}
      />,
    );
    expect(
      screen.getByRole("button", { name: "Cargar más" }),
    ).toBeInTheDocument();
  });
});
