import Marquee from "react-fast-marquee";
export function Brands() {
  return (
    <div className="py-8">
      <Marquee speed={100} pauseOnHover={true}>
        <div className="flex items-center gap-12 px-4">
          <img src="/brands/brand1.svg" alt="Brand 1" className="h-16" />
          <img src="/brands/brand2.svg" alt="Brand 2" className="h-16" />
          <img src="/brands/brand3.svg" alt="Brand 3" className="h-16" />
          <img src="/brands/brand4.svg" alt="Brand 4" className="h-16" />
          <img src="/brands/brand5.svg" alt="Brand 5" className="h-16" />
        </div>
      </Marquee>
    </div>
  );
}
