import Map, { Marker, Popup } from "react-map-gl/maplibre";
import type { MapSectionProps } from "./MapSection.types";

export function MapSection({
  latitude,
  longitude,
  zoom = 15,
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
        mapStyle="https://basemaps.cartocdn.com/gl/positron-gl-style/style.json"
      >
        <Marker longitude={longitude} latitude={latitude} anchor="bottom">
          <div className="flex flex-col items-center">
            <div className="rounded-lg bg-sc-ocean-blue px-3 py-1.5 font-poppins text-xs font-semibold text-white shadow-lg">
              {markerLabel}
            </div>
            <div className="h-0 w-0 border-l-[6px] border-r-[6px] border-t-[6px] border-l-transparent border-r-transparent border-t-sc-ocean-blue" />
          </div>
        </Marker>
        <Popup
          longitude={longitude}
          latitude={latitude}
          anchor="bottom"
          offset={35}
          closeButton={false}
        >
          <div className="font-poppins text-sm font-semibold text-sc-ocean-blue">
            {markerLabel}
          </div>
        </Popup>
      </Map>
    </div>
  );
}
