import { render, screen } from "@testing-library/react";
import { MapSection } from "./MapSection";

vi.mock("react-map-gl/maplibre", () => ({
  default: ({ children }: { children?: React.ReactNode }) => (
    <div data-testid="mock-map">{children}</div>
  ),
  Marker: ({ longitude, latitude }: { longitude: number; latitude: number }) => (
    <div data-testid="mock-marker" data-lng={longitude} data-lat={latitude} />
  ),
  Popup: ({ children }: { children?: React.ReactNode }) => (
    <div data-testid="mock-popup">{children}</div>
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

  it("renders the default marker label", () => {
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

  it("renders a popup with the marker label", () => {
    render(<MapSection latitude={-34.4351676} longitude={-58.5956366} />);
    const popups = screen.getAllByTestId("mock-popup");
    expect(popups.length).toBeGreaterThanOrEqual(1);
    expect(screen.getByText("El Mono Lonería Naval")).toBeInTheDocument();
  });
});
