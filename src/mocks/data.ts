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
        title: "Excelente Trabajo",
        author: "Enrique Gómez",
        stars: 5,
        description:
          "Trabajos rápidos y acorde con precios, recomendados!",
      },
      {
        id: "r2",
        title: "Excelente Atencion y Servicio",
        author: "German Villanueva",
        stars: 5,
        description:
          "Excelente atención y servicio. Trabajos en tiempo y forma con la mejor calidad",
      },
      {
        id: "r3",
        title: "En Tiempo y Forma",
        author: "Lautaro Couceiro",
        stars: 5,
        description:
          "Excelente. Cumplió en tiempo y forma, la lona le queda como un guante a mi tracker. Muy recomendable.",
      },
    ] satisfies Review[],
    FAQs: [
      {
        id: "faq1",
        q: "¿Qué tipo de materiales utilizan?",
        a: "Trabajamos con lonas técnicas náuticas, vinilos de primera calidad y textiles de alta performance como Sunbrella y Sailrite. Cada material se elige según el uso final y la exposición al sol, sal y viento.",
      },
      {
        id: "faq2",
        q: "¿Cuánto tarda la confección de un trabajo a medida?",
        a: "Depende de la complejidad. Trabajos estándar como cubreautos o fundas simples se entregan en 5 a 10 días hábiles. Proyectos a medida como capotas de embarcaciones o cerramientos pueden llevar entre 2 y 4 semanas.",
      },
      {
        id: "faq3",
        q: "¿Ofrecen garantía sobre sus trabajos?",
        a: "Sí. Todos nuestros trabajos cuentan con garantía de confección. La cobertura específica varía según el material y el tipo de producto, pero en general cubre defectos de fabricación y costuras.",
      },
      {
        id: "faq4",
        q: "¿Puedo llevar mi propio diseño o tienen catálogo?",
        a: "Las dos cosas. Trabajamos a medida desde un diseño propio, una idea, una foto o una necesidad específica. Si preferís ver opciones, tenemos catálogo de modelos probados que podemos adaptar a tus medidas.",
      },
      {
        id: "faq5",
        q: "¿Realizan colocación e instalación?",
        a: "Sí. Para lonas, capotas y cerramientos ofrecemos el servicio completo de confección, colocación e instalación en domicilio o en el taller. En el caso de cubreautos y fundas, la entrega incluye instrucciones de uso.",
      },
    ],
  },
};
