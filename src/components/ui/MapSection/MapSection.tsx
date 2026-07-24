import Map, { Marker } from "react-map-gl/maplibre";
import logoElMono from "../../../assets/logos/elmono/isotipo-elmono.png";
import type { MapSectionProps } from "./MapSection.types";

export function MapSection({
  latitude,
  longitude,
  zoom = 17,
  height = "400px",
  markerLabel = "El Mono Lonería Naval",
  className,
}: MapSectionProps) {
  return (
    <div
      className={`overflow-hidden rounded-xl shadow-xl ${className ?? ""}`}
      style={{ height }}
    >
      <Map
        initialViewState={{
          longitude,
          latitude,
          zoom,
        }}
        style={{ width: "100%", height: "100%" }}
        mapStyle="https://basemaps.cartocdn.com/gl/voyager-gl-style/style.json"
      >
        <Marker longitude={longitude} latitude={latitude} anchor="bottom">
          <div className="flex flex-col items-center">
            <img
              src={logoElMono}
              alt={markerLabel}
              className="h-16 w-16 rounded-full  shadow-lg bg-sc-ocean-blue"
              style={{ display: "block" }}
            />
            <div className="mt-1 rounded-md bg-sc-ocean-blue px-2 py-1 font-poppins text-[10px] font-semibold text-white shadow-lg">
              {markerLabel}
            </div>
          </div>
        </Marker>
      </Map>
    </div>
  );
}
