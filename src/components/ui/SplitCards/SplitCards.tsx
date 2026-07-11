import { Card } from "../Card";
import prodImg from "../../../assets/img/services/services-02.jpg";
import servImg from "../../../assets/img/services/services-04.jpg";

const splitCards = [
  {
    title: "Productos",
    /* TODO: replace with real description */
    description:
      "Accedé a materiales exclusivos y stock único en el país que marcan la diferencia en tus proyectos. Si los demás no lo consiguen, nosotros lo tenemos.",
    badge: "Entrega Inmediata",
    imageSrc: prodImg,
    /* TODO: replace with real CTA label */
    ctaLabel: "Ver Cat\u00e1logo",
  },
  {
    title: "Servicios",
    /* TODO: replace with real description */
    description:
      "Transformá tus espacios y protegé lo que más querés. Diseños personalizados a medida con la máxima durabilidad del mercado. Descubrí todo lo que podemos hacer por vos.",
    badge: "A Medida",
    imageSrc: servImg,
    /* TODO: replace with real CTA label */
    ctaLabel: "Ver M\u00e1s",
  },
];

export function SplitCards() {
  return (
    <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
      {splitCards.map((c) => (
        <a href={`${c.title}`}>
          <Card key={c.title} {...c} />
        </a>
      ))}
    </div>
  );
}
