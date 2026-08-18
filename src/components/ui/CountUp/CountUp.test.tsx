import { render, screen } from "@testing-library/react";
import CountUp from "./CountUp";

describe("CountUp", () => {
  it("renders the starting value (from, default 0) before any animation", () => {
    render(<CountUp to={100} />);
    expect(screen.getByText("0")).toBeInTheDocument();
  });

  it("renders a custom starting value", () => {
    render(<CountUp to={100} from={50} />);
    expect(screen.getByText("50")).toBeInTheDocument();
  });

  it("applies the className to the span", () => {
    const { container } = render(
      <CountUp to={10} from={5} className="text-pr-hero-blue" />,
    );
    const span = container.querySelector("span");
    expect(span).not.toBeNull();
    expect(span!.className).toContain("text-pr-hero-blue");
  });

  it("does not fire onStart/onEnd while the element is out of view", () => {
    const onStart = vi.fn();
    const onEnd = vi.fn();
    render(<CountUp to={10} onStart={onStart} onEnd={onEnd} />);
    expect(onStart).not.toHaveBeenCalled();
    expect(onEnd).not.toHaveBeenCalled();
  });
});
