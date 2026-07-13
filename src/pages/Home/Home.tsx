import { Hero } from "../../components/layout";
import {
  Accordion,
  AboutSection,
  SectionWrapper,
  SplitCards,
} from "../../components/ui";
import { SplitReviews } from "../../components/ui/SplitReviews/SplitReviews";
import { data } from "../../mocks/data";

export function Home() {
  return (
    <>
      <Hero />
      <SectionWrapper
        theme="dark"
        eyebrow="¿Qué ofrecemos?"
        title="Encontrá lo que buscas"
        titlesAlign="start"
      >
        <SplitCards></SplitCards>
      </SectionWrapper>
      <SectionWrapper
        titlesAlign="end"
        theme="light"
        eyebrow={"Sobre Nosotros"}
        title={"Trabajos a Medida"}
      >
        <AboutSection
          showControls
          description="Lonas, capotas y fundas a medida. Hecho en nuestro taller ubicado en Tigre, Buenos Aires. Trabajo artesanal con materiales de Marcas lider mundiales!"
          cta={{ text: "Trabajos Realizados", href: "/servicios" }}
        />
      </SectionWrapper>

      <SectionWrapper
        titlesAlign="center"
        theme="light"
        eyebrow={"Testimonios"}
        title={"Nuestros Clientes"}
      >
        <SplitReviews></SplitReviews>
      </SectionWrapper>

      <SectionWrapper
        titlesAlign="center"
        theme="dark"
        eyebrow={"FAQ's"}
        title={"Preguntas frecuentes"}
      >
        <Accordion items={data.Home.FAQs} />
      </SectionWrapper>
    </>
  );
}
