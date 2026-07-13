import { ImgCard } from "../Card";
import prodImg from "../../../assets/img/services/services-02.jpg";
import servImg from "../../../assets/img/services/services-04.jpg";

const splitCards = [
  {
    title: "Productos",
    imageSrc: prodImg,
  },
  {
    title: "Servicios",
    imageSrc: servImg,
  },
];

export function SplitCards() {
  return (
    <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
      {splitCards.map((c) => (
        <a href={`${c.title}`}>
          <ImgCard
            imageClassName="brightness-50 grayscale-50 hover:brightness-100 hover:grayscale-0"
            src={c.imageSrc}
            alt={c.title}
            title={c.title}
          ></ImgCard>
        </a>
      ))}
    </div>
  );
}
