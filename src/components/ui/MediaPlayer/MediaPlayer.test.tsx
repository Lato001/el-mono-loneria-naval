import { render } from "@testing-library/react";
import MediaPlayer from "./MediaPlayer";

vi.mock("react-player", () => ({
  default: ({ src, width, height }: { src: string; width: string; height: string }) => (
    <div data-testid="mock-player" data-src={src} data-width={width} data-height={height}>
      mock-player
    </div>
  ),
}));

describe("MediaPlayer", () => {
  it("renders a responsive wrapper with 16:9 aspect", () => {
    const { container } = render(<MediaPlayer src="https://example.com/video" />);
    const wrapper = container.firstElementChild as HTMLElement;
    expect(wrapper).not.toBeNull();
    expect(wrapper.className).toContain("w-full");
    expect(wrapper.className).toContain("aspect-video");
  });

  it("does not use fixed pixel dimensions", () => {
    const { container } = render(<MediaPlayer src="https://example.com/video" />);
    const wrapper = container.firstElementChild as HTMLElement;
    expect(wrapper.style.width).not.toContain("px");
    expect(wrapper.style.height).not.toContain("px");
  });

  it("passes className to the wrapper", () => {
    const { container } = render(
      <MediaPlayer src="https://example.com/video" className="xl:h-full" />,
    );
    const wrapper = container.firstElementChild as HTMLElement;
    expect(wrapper.className).toContain("xl:h-full");
    expect(wrapper.className).toContain("w-full");
  });

  it("forwards src to ReactPlayer", () => {
    const { getByTestId } = render(<MediaPlayer src="https://example.com/video" />);
    const player = getByTestId("mock-player");
    expect(player).toHaveAttribute("data-src", "https://example.com/video");
  });
});
