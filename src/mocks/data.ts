import type { Highlight, AboutCta } from "../components/ui/AboutSection/AboutSection.types";
import type { Service } from "../components/ui/ServiceGrid/ServiceGrid.types";
import type { Review } from "../types/review";

// Discriminated union for type-safe section rendering in Home.tsx
export type ReviewsSection = {
  id: "reviews";
  kind: "reviews";
  eyebrow: string;
  title: string;
};

export type AboutUsSection = {
  id: "aboutus";
  kind: "aboutus";
  eyebrow: string;
  title: string;
  content: string[];
  image?: string;
  imageAlt?: string;
  highlights?: Highlight[];
  cta?: AboutCta;
};

export type Section = ReviewsSection | AboutUsSection;

export const data = {
  Home: {
    Sections: [
      {
        id: "reviews" as const,
        kind: "reviews" as const,
        eyebrow: "Lo que dicen los clientes",
        title: "Rese\u00f1as",
      },
      {
        id: "aboutus" as const,
        kind: "aboutus" as const,
        eyebrow: "Qui\u00e9nes somos",
        title: "Oficio de loner\u00eda, mentalidad n\u00e1utica",
        content: [
          /* TODO: replace with real content */
          "En El Mono combinamos tradici\u00f3n y t\u00e9cnica para crear lonas que resisten el mar. Cada pieza es confeccionada a mano con materiales de primera calidad, garantizando durabilidad y protecci\u00f3n en las condiciones m\u00e1s exigentes.",
          /* TODO: replace with real content */
          "Nuestro taller es donde la experiencia se encuentra con la innovaci\u00f3n. Trabajamos con lonas t\u00e9cnicas, vinilos n\u00e1uticos y tejidos de alta performance para ofrecer soluciones a medida que superan las expectativas.",
        ],
        // TODO: replace with real image when available
        imageAlt: "Equipo de El Mono trabajando en el taller",
        highlights: [
          { label: "A\u00f1os de oficio (TODO: real number)", value: "+20" },
          { label: "Proyectos entregados (TODO)", value: "+500" },
          { label: "Clientes satisfechos (TODO)", value: "+300" },
        ],
        cta: { text: "Conoc\u00e9 m\u00e1s sobre nosotros", href: "/nosotros" },
      },
    ],
    Services: [
      {
        id: "srv1",
        title: "Lonas a Medida",
        description:
          "Fabricaci\u00f3n y colocaci\u00f3n de lonas para cubrir superficies de cualquier tama\u00f1o y forma, con materiales t\u00e9cnicos de alta durabilidad.",
      },
      {
        id: "srv2",
        title: "Capotas para Embarcaciones",
        description:
          "Dise\u00f1o y confecci\u00f3n de capotas personalizadas para embarcaciones, garantizando ajuste perfecto y resistencia a la intemperie.",
      },
      {
        id: "srv3",
        title: "Cubreautos y Fundas",
        description:
          "Fundas protectoras para autos, motos de agua y equipamiento n\u00e1utico, con materiales que cuidan la superficie y soportan el sol.",
      },
    ] satisfies Service[],
    Reviews: [
      {
        id: "r1",
        title: "Excelente calidad",
        author: "Juan P\u00e9rez",
        stars: 5,
        description:
          "Las lonas quedaron perfectas, tal como las ped\u00ed. Muy buena atenci\u00f3n y rapidez en la entrega.",
      },
      {
        id: "r2",
        title: "Trabajo impecable",
        author: "Mar\u00eda L\u00f3pez",
        stars: 5,
        description:
          "La capota para mi barco qued\u00f3 exactamente a medida. Materiales de primera y terminaciones impecables.",
      },
      {
        id: "r3",
        title: "Muy recomendables",
        author: "Carlos Garc\u00eda",
        stars: 5,
        description:
          "Profesionales y responsables. Me ayudaron a elegir el material adecuado para mi proyecto.",
      },
      {
        id: "r4",
        title: "Atenci\u00f3n personalizada",
        author: "Laura Mart\u00ednez",
        stars: 5,
        description:
          "Desde el primer contacto se tomaron el tiempo para entender lo que necesitaba. Resultado excelente.",
      },
      {
        id: "r5",
        title: "Durabilidad garantizada",
        author: "Pedro Rodr\u00edguez",
        stars: 5,
        description:
          "Ya pas\u00f3 una temporada completa y las cubiertas siguen como nuevas. Sin duda volver\u00eda a contratarlos.",
      },
    ] satisfies Review[],
  },
};
