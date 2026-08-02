import Masonry from "../../components/ui/Masonry/Masonry";
import { data } from "../../mocks/data";
import services03 from "../../assets/img/services/services-03.webp";
import services04 from "../../assets/img/services/services-04.webp";
import services05 from "../../assets/img/services/services-05.webp";
import services06 from "../../assets/img/services/services-06.webp";
import services07 from "../../assets/img/services/services-07.webp";
import services08 from "../../assets/img/services/services-08.webp";
import works01 from "../../assets/img/works/works-01.webp";
import works02 from "../../assets/img/works/works-02.webp";
import works03 from "../../assets/img/works/works-03.webp";
import works04 from "../../assets/img/works/works-04.webp";
import works05 from "../../assets/img/works/works-05.webp";
import works06 from "../../assets/img/works/works-06.webp";
import works07 from "../../assets/img/works/works-07.webp";
import works08 from "../../assets/img/works/works-08.webp";
import works09 from "../../assets/img/works/works-09.webp";
import works10 from "../../assets/img/works/works-10.webp";
import works11 from "../../assets/img/works/works-11.webp";
import works12 from "../../assets/img/works/works-12.webp";
import works13 from "../../assets/img/works/works-13.webp";
import works14 from "../../assets/img/works/works-14.webp";

import { SectionWrapper } from "../../components";

/**
 * Image-key → URL map. The `src` field in `data.worksPage.album.images`
 * is an imageKey (a stable identifier, e.g. "services-03"). The page
 * resolves it to the actual Vite-imported URL here so that `mocks/data.ts`
 * stays free of Vite-specific import paths.
 */
const imageMap: Record<string, string> = {
  "services-03": services03,
  "services-04": services04,
  "services-05": services05,
  "services-06": services06,
  "services-07": services07,
  "services-08": services08,
  "works-01": works01,
  "works-02": works02,
  "works-03": works03,
  "works-04": works04,
  "works-05": works05,
  "works-06": works06,
  "works-07": works07,
  "works-08": works08,
  "works-09": works09,
  "works-10": works10,
  "works-11": works11,
  "works-12": works12,
  "works-13": works13,
  "works-14": works14,
};

export function Works() {
  const images = data.worksPage.album.images.map((item) => ({
    id: item.id,
    img: imageMap[item.src] ?? "",
    url: "",
    alt: item.alt,
  }));

  return (
    <>
      <SectionWrapper
        id="album"
        className="mx-auto"
        eyebrow="Album de fotos"
        title="Nuestros Trabajos"
      >
        <Masonry
          items={images}
          ease="power3.out"
          duration={0.6}
          stagger={0.05}
          animateFrom="bottom"
          scaleOnHover
          hoverScale={0.95}
          colorShiftOnHover={true}
        />
      </SectionWrapper>
    </>
  );
}
