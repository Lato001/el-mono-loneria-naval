import { Hero } from "../../components/layout";
import { SectionWrapper, SplitCards } from "../../components/ui";
import { SplitReviews } from "../../components/ui/SplitReviews/SplitReviews";

// TODO: replace with real content for top-level category cards

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
        titlesAlign="start"
        theme="light"
        eyebrow={"Sobre Nosotros"}
        title={"Acerca de nuestro trabajo"}
      >
        <div />
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
        <div />
      </SectionWrapper>
    </>
  );
}
