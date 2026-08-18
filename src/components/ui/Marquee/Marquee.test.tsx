import { render, screen, fireEvent } from "@testing-library/react";
import { Marquee } from "./Marquee";

const items = [
  { id: "a", src: "/a.png", alt: "Marca A", name: "Marca A" },
  { id: "b", src: "/b.png", alt: "Marca B", name: "Marca B" },
];

function getTrack(container: HTMLElement): HTMLElement {
  const all = Array.from(container.querySelectorAll("*")) as HTMLElement[];
  const track = all.find(
    (el) => el.style.animationName === "marquee-scroll",
  );
  expect(track).toBeDefined();
  return track!;
}

describe("Marquee", () => {
  it("renders every item with the default image + name content", () => {
    render(<Marquee items={items} />);
    expect(screen.getAllByAltText("Marca A")).toHaveLength(2);
    expect(screen.getAllByText("Marca B")).toHaveLength(2);
  });

  it("duplicates the track for a seamless loop (multiplier starts at 2)", () => {
    const { container } = render(<Marquee items={items} />);
    const track = getTrack(container);
    expect(track.style.width).toBe("max-content");
  });

  it("animates left by default and reverse when direction is right", () => {
    const left = render(<Marquee items={items} />);
    expect(getTrack(left.container).style.animationDirection).toBe("normal");

    const right = render(<Marquee items={items} direction="right" />);
    expect(getTrack(right.container).style.animationDirection).toBe("reverse");
  });

  it("uses the speed prop as the animation duration", () => {
    const { container } = render(<Marquee items={items} speed={30} />);
    expect(getTrack(container).style.animationDuration).toBe("30s");
  });

  it("pauses the animation on hover when pauseOnHover is true", () => {
    const { container } = render(<Marquee items={items} />);
    const track = getTrack(container);
    expect(track.style.animationPlayState).toBe("running");

    fireEvent.mouseEnter(container.firstChild as HTMLElement);
    expect(track.style.animationPlayState).toBe("paused");

    fireEvent.mouseLeave(container.firstChild as HTMLElement);
    expect(track.style.animationPlayState).toBe("running");
  });

  it("uses the custom renderItem instead of the default content", () => {
    const { container } = render(
      <Marquee
        items={items}
        renderItem={(item) => <strong data-testid="custom">{item.id}</strong>}
      />,
    );
    // 2 items × the duplicated track group = 4 renders.
    expect(container.querySelectorAll('[data-testid="custom"]')).toHaveLength(
      4,
    );
  });
});
