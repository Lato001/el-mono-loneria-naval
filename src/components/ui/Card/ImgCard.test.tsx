import { fireEvent, render, screen } from "@testing-library/react";
import { ImgCard } from "./ImgCard";
import { IMAGE_FALLBACK_SRC } from "../ImageFallback";

describe("ImgCard", () => {
  it("swaps a failed single image src for the inline fallback", () => {
    render(<ImgCard src="/broken.jpg" alt="Broken single" />);

    const img = screen.getByAltText("Broken single") as HTMLImageElement;
    expect(img.src).not.toBe(IMAGE_FALLBACK_SRC);
    fireEvent.error(img);

    expect(img.src).toBe(IMAGE_FALLBACK_SRC);
  });

  it("swaps a failed slideshow image src for the inline fallback", () => {
    const images = [
      { src: "/broken.jpg", alt: "Broken slide" },
      { src: "/ok.jpg", alt: "Ok slide" },
    ];
    render(<ImgCard images={images} />);

    const broken = screen.getByAltText("Broken slide") as HTMLImageElement;
    fireEvent.error(broken);
    expect(broken.src).toBe(IMAGE_FALLBACK_SRC);

    // The healthy image is untouched.
    const ok = screen.getByAltText("Ok slide") as HTMLImageElement;
    expect(ok.src).not.toBe(IMAGE_FALLBACK_SRC);
  });
});
