import { render, screen } from "@testing-library/react";
import { MapSection } from "./MapSection";

vi.mock("react-map-gl/maplibre", () => ({
  default: ({ children }: { children?: React.ReactNode }) => (
    <div data-testid="mock-map">{children}</div>
  ),
  Marker: ({ longitude, latitude, children }: { longitude: number; latitude: number; children?: React.ReactNode }) => (
    <div data-testid="mock-marker" data-lng={longitude} data-lat={latitude}>{children}</div>
  ),
}));

describe("MapSection", () => {
  it("renders the map container", () => {
    render(<MapSection latitude={-34.4351676} longitude={-58.5956366} />);
    expect(screen.getByTestId("mock-map")).toBeInTheDocument();
  });

  it("renders a marker at the given coordinates", () => {
    render(<MapSection latitude={-34.4351676} longitude={-58.5956366} />);
    const marker = screen.getByTestId("mock-marker");
    expect(marker).toHaveAttribute("data-lat", "-34.4351676");
    expect(marker).toHaveAttribute("data-lng", "-58.5956366");
  });

  it("renders a single marker with the default label", () => {
    render(<MapSection latitude={-34.4351676} longitude={-58.5956366} />);
    expect(screen.getByText("El Mono Lonería Naval")).toBeInTheDocument();
  });

  it("renders a custom marker label", () => {
    render(
      <MapSection
        latitude={-34.4351676}
        longitude={-58.5956366}
        markerLabel="Mi Negocio"
      />,
    );
    expect(screen.getByText("Mi Negocio")).toBeInTheDocument();
  });

  it("renders only one marker", () => {
    render(<MapSection latitude={-34.4351676} longitude={-58.5956366} />);
    const markers = screen.getAllByTestId("mock-marker");
    expect(markers).toHaveLength(1);
  });
});
