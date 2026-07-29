/**
 * MOCK DATA — SINGLE SOURCE OF TRUTH
 * ──────────────────────────────────────────────────────────────────
 *  ALL page content (copy, navigation, products, brands, FAQ, UI labels)
 *  lives here. Components import `data` and render. No API, no fetch, no
 *  context — the whole site is a build-time static bundle.
 *
 *  MIGRATION TO A REAL DATABASE (4 steps, NOT in this change):
 *
 *    1. Wrap `data` in an async fetcher:
 *         export async function fetchData(): Promise<typeof data> { ... }
 *
 *    2. Add a `DataProvider` context populated on app mount:
 *         const ctx = useAppData();  // returns `data` once loaded
 *
 *    3. Swap consumer imports:
 *         import { data } from "../../mocks/data";  // BEFORE
 *         const { home } = useAppData();             // AFTER
 *
 *    4. Types and component contracts stay byte-identical — only the
 *       data source and the import line change.
 *
 *  IMAGE & ICON DECOUPLING:
 *    • Images are stored as `imageKey: string` in data. Each consuming
 *      page maintains a `Record<imageKey, string>` map co-located with
 *      the asset imports. DB migration = swap the map for CDN URLs.
 *    • Icons are stored as `platform: SocialPlatform` (Footer) or
 *      `iconKey: ContactIconKey` strings, resolved via a local map
 *      in Footer.tsx.
 */

import type { Work } from "../types/work";
import type { Review } from "../types/review";
import type {
  AboutUsContent,
  AboutUsSection,
  BrandData,
  FaqItem,
  FooterNav,
  GlobalData,
  HeroData,
  NavLink,
  ProductCategoryData,
  ReviewsSection,
  Section,
  SectionsGroup,
  StackedCardData,
  WorksPageData,
  SplitCardData,
  UICopy,
} from "./types";

// ─── Canonical data ──────────────────────────────────────────────────────

const works = [
  {
    id: "srv1",
    title: "Lonas a Medida",
    description:
      "Fabricación y colocación de lonas para cubrir superficies de cualquier tamaño y forma, con materiales técnicos de alta durabilidad.",
  },
  {
    id: "srv2",
    title: "Capotas para Embarcaciones",
    description:
      "Diseño y confección de capotas personalizadas para embarcaciones, garantizando ajuste perfecto y resistencia a la intemperie.",
  },
  {
    id: "srv3",
    title: "Cubreautos y Fundas",
    description:
      "Fundas protectoras para autos, motos de agua y equipamiento náutico, con materiales que cuidan la superficie y soportan el sol.",
  },
] satisfies Work[];

const reviews = [
  {
    id: "r1",
    title: "Excelente Trabajo",
    author: "Enrique Gómez",
    stars: 5,
    description: "Trabajos rápidos y acorde con precios, recomendados!",
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
] satisfies Review[];

const faqs = [
  {
    id: "faq1",
    category: "insumos",
    q: "¿Qué tipo de materiales utilizan?",
    a: "Trabajamos con lonas técnicas náuticas, vinilos de primera calidad y textiles de alta performance como Sunbrella y Sailrite. Cada material se elige según el uso final y la exposición al sol, sal y viento.",
  },
  {
    id: "faq2",
    category: "tiempos",
    q: "¿Cuánto tardamos en hacer tu lona?",
    a: "Por lo general demoramos unos 15 dias aprox. desde el pago del adelanto. Ésto puede variar según las dimensiones del trabajo!",
  },
  {
    id: "faq3",
    category: "servicios",
    q: "¿Ofrecen garantía sobre sus trabajos?",
    a: "Sí. Todos nuestros trabajos cuentan con garantía de confección. La cobertura específica varía según el material y el tipo de producto, pero en general cubre defectos de fabricación y costuras.",
  },
  {
    id: "faq4",
    category: "trabajos",
    q: "¿Puedo llevar mi propio diseño o tienen catálogo?",
    a: "Las dos cosas. Trabajamos a medida desde un diseño propio, una idea, una foto o una necesidad específica. Si preferís ver opciones, tenemos catálogo de modelos probados que podemos adaptar a tus medidas.",
  },
] satisfies FaqItem[];

const reviewsSection: ReviewsSection = {
  id: "reviews",
  kind: "reviews",
  eyebrow: "Lo que dicen los clientes",
  title: "Reseñas",
};

const aboutUsSection: AboutUsSection = {
  id: "aboutus",
  kind: "aboutus",
  eyebrow: "Quiénes somos",
  title: "Oficio de lonería, mentalidad náutica",
  content: [
    /* TODO: replace with real content */
    "En El Mono combinamos tradición y técnica para crear lonas que resisten el mar. Cada pieza es confeccionada a mano con materiales de primera calidad, garantizando durabilidad y protección en las condiciones más exigentes.",
    /* TODO: replace with real content */
    "Nuestro taller es donde la experiencia se encuentra con la innovación. Trabajamos con lonas técnicas, vinilos náuticos y tejidos de alta performance para ofrecer soluciones a medida que superan las expectativas.",
  ],
  // TODO: replace with real image when available
  imageAlt: "Equipo de El Mono trabajando en el taller",
  highlights: [
    { label: "Años de oficio (TODO: real number)", value: "+20" },
    { label: "Proyectos entregados (TODO)", value: "+500" },
    { label: "Clientes satisfechos (TODO)", value: "+300" },
  ],
  cta: { text: "Conocé más sobre nosotros", href: "/nosotros" },
};

// ─── Exported data object ────────────────────────────────────────────────

export const data = {
  // ─── Global brand ────────────────────────────────────────────────────
  global: {
    brandName: "El Mono",
    brandFullName: "El Mono Lonería Naval",
    brandLogoAlt: "El Mono — Lonería Naval",
  } satisfies GlobalData,

  // ─── UI copy (buttons, modals, aria-labels, empty states) ────────────
  ui: {
    ctaContactDesktop: "Pedi tu Presupuesto",
    ctaContactMobile: "Cotizar",
    catalogHeroTitle: "Nuestros productos",
    catalogHeroDescription:
      "Explorá nuestra selección de artículos náuticos: broches, caballetes, cierres e hilos de la más alta calidad para tu embarcación.",
    worksHeroTitle: "Nuestros servicios",
    worksHeroDescription:
      "TODO: replace with real content — descripción general de los servicios que ofrece El Mono (lonas, capotas, cerramientos, etc.).",
    worksCategoriesLabel: "Categorías de servicios",
    consultWhatsApp: "Consultá por Whatsapp",
    clearList: "Vaciar lista",
    keepBrowsing: "Seguir viendo",
    cancel: "Cancelar",
    delete: "Borrar",
    quoteModal: {
      title: "Cotizar productos",
      description: "Te llevamos a WhatsApp con los productos pre-seleccionados.",
    },
    clearModal: {
      title: "Borrar lista",
      description: "Vas a eliminar todos los productos seleccionados.",
    },
    clearConfirmation:
      "¿Estás seguro que querés borrar toda la lista de productos seleccionados? Esta acción no se puede deshacer.",
    whatsappDisabledReason:
      "El mensaje es demasiado largo; contactanos por WhatsApp directamente.",
    noProductsSelected: "No hay productos seleccionados.",
    selectedLabel: "Seleccionado",
    closeLabel: "Cerrar",
    prevLabel: "Anterior",
    nextLabel: "Siguiente",
    goToProductLabel: "Ir a producto",
    categoriesLabel: "Categorías de productos",
    contactWhatsAppLabel: "Contactar por WhatsApp",
    selectedCountLabel: "productos seleccionados",
    quoteCartLabel: "Presupuestar productos seleccionados",
    clearListLabel: "Borrar lista de productos seleccionados",
    quoteLabel: "Presupuestar",
    vaciarButton: "Vaciar",
    vaciarSelectionAriaLabel: "Vaciar selección",
    clearListAriaLabel: "Borrar lista",
    whatsappGreeting:
      "Hola! Me interesa presupuestar los siguientes productos:",
    contactSectionTitle: "Contacto",
    actionBarLabel: "Acciones del presupuesto",
  } satisfies UICopy,

  // ─── Navigation ──────────────────────────────────────────────────────
  nav: {
    header: [
      { label: "Inicio", href: "/" },
      { label: "Productos", href: "/productos" },
      { label: "Trabajos", href: "/trabajos" },
      { label: "Nosotros", href: "/nosotros" },
      { label: "FAQ", href: "/faq" },
      { label: "Contacto", href: "/contacto" },
    ] satisfies NavLink[],
    footer: {
      groups: [
        {
          title: "Servicios",
          links: [
            { label: "Lonas a Medida", href: "/trabajos" },
            { label: "Capotas para Embarcaciones", href: "/trabajos" },
            { label: "Cubreautos y Fundas", href: "/trabajos" },
          ],
        },
        {
          title: "Productos",
          links: [{ label: "Catálogo", href: "/productos" }],
        },
        {
          title: "Nosotros",
          links: [
            { label: "Sobre el Taller", href: "/nosotros" },
            { label: "Equipo", href: "/nosotros" },
          ],
        },
        {
          title: "Ayuda",
          links: [
            { label: "FAQ", href: "/faq" },
            { label: "Contacto", href: "/contacto" },
          ],
        },
      ],
      social: [
        { platform: "Facebook", href: "https://www.facebook.com/profile.php?id=100071098357153" },
        { platform: "Instagram", href: "https://www.instagram.com/lonerianavalelmono/" },
        { platform: "WhatsApp", href: `${import.meta.env.VITE_WHATSAPP_URL}` },
      ],
      contact: [
        {
          label: "Teléfono",
          value: "+54 9 11 6990-6255",
          href: "tel:+54 9 11 6990-6255",
          iconKey: "phone",
        },
        {
          label: "Email",
          value: "lonerianavalelmono@hotmail.com",
          href: "mailto:lonerianavalelmono@hotmail.com",
          iconKey: "mail",
        },
        {
          label: "Dirección",
          value: "Tigre, Buenos Aires, Argentina",
          href: "https://maps.app.goo.gl/5yJprtv3uSdtv13M7",
          iconKey: "mapPin",
        },
      ],
      tagline: "El Mono · Lonería Naval desde 2026",
      copyright:
        "© 2026 El Mono Lonería Naval. Desarrollado por CameSites",
      contactTitle: "Contacto",
    } satisfies FooterNav,
  },

  // ─── Home page ───────────────────────────────────────────────────────
  home: {
    hero: {
      eyebrow: "Lonería naval — a medida, para cada superficie",
      titlePrefix: "Lonas, capotas y fundas que ",
      titleHighlight: "resisten cualquier intemperie",
      description:
        "Confección de lonas, cerramientos, capotas, cubreautos y fundas para motos de agua. Trabajo a medida con materiales técnicos de alta durabilidad.",
      primaryCta: "Solicitar presupuesto",
      secondaryCta: "Ver Productos",
      images: [
        { src: "services-06", alt: "Carpa" },
        { src: "services-07", alt: "Toneau" },
        { src: "services-08", alt: "Capota" },
      ],
    } satisfies HeroData,

    sections: {
      whatWeOffer: {
        eyebrow: "¿Qué ofrecemos?",
        title: "Encontrá lo que buscas",
        theme: "dark",
        titlesAlign: "start",
      },
      aboutUs: {
        eyebrow: "Sobre Nosotros",
        title: "Trabajos a Medida",
        theme: "light",
        titlesAlign: "end",
      },
      testimonials: {
        eyebrow: "Testimonios",
        title: "Nuestros Clientes",
        theme: "light",
        titlesAlign: "center",
      },
      faq: {
        eyebrow: "FAQ's",
        title: "Preguntas frecuentes",
        theme: "dark",
        titlesAlign: "center",
      },
    } satisfies SectionsGroup,

    splitCards: [
      { title: "Productos", imageKey: "services-02" },
      { title: "Trabajos", imageKey: "services-04" },
    ] satisfies SplitCardData[],

    stackedCards: [
      {
        id: "capotas",
        title: "Capotas",
        description:
          "Capotas a medida para embarcaciones, confeccionadas con materiales técnicos de alta resistencia.",
        imageKey: "services-01",
      },
      {
        id: "cerramientos",
        title: "Cerramientos",
        description:
          "Cerramientos marinos que protegen del sol, viento y lluvia sin sacrificar la estética.",
        imageKey: "services-03",
      },
      {
        id: "fundas",
        title: "Fundas y Cubiertos",
        description:
          "Fundas para motos de agua, cubreautos y protectores a medida con materiales de larga duración.",
        imageKey: "services-05",
      },
    ] satisfies StackedCardData[],

    aboutSection: {
      description:
        "Lonas, capotas y fundas a medida. Hecho en nuestro taller ubicado en Tigre, Buenos Aires. Trabajo artesanal con materiales de Marcas lider mundiales!",
      cta: { text: "Trabajos Realizados", href: "/servicios" },
    } satisfies AboutUsContent,

    works,
    reviews,
    faqs,
    aboutUsSection,
  },

  // ─── Products page ───────────────────────────────────────────────────
  products: {
    categories: [
      {
        id: "broches",
        name: "Broches",
        description:
          "Broches de presión profesionales para lonas, capotas y cubiertas náuticas. Disponibles en varios acabados y materiales para cada tipo de aplicación.",
        imageKey: "services-01",
        products: [
          { id: "b1", title: "Broche Casco Bacan", description: "Broche a presión de carcasa tipo baca, acabado negro.", imageKey: "bacan-01" },
          { id: "b2", title: "Broche Casco Bacab", description: "Broche a presión de carcasa tipo baca, acabado blanco.", imageKey: "bacab-01" },
          { id: "b3", title: "Broche Casco Bacp", description: "Broche a presión de carcasa tipo bacp, para uso intensivo.", imageKey: "bacp-01" },
          { id: "b4", title: "Broche Casco Bar", description: "Broche a presión de carcasa tipo bar, para decoración naval.", imageKey: "bar-01" },
          { id: "b5", title: "Broche Lona Hembra Bronze", description: "Broche lona hembra en bronce, para sujeción de lonas y correas.", imageKey: "hb-01" },
          { id: "b6", title: "Broche Lona Hembra Inox", description: "Broche lona hembra en acero inoxidable, para sujeción de lonas y correas.", imageKey: "hi-01" },
          { id: "b7", title: "Broche Lona Macho Bronze Blanco", description: "Broche lona macho en bronce blanco, para sujeción de lonas.", imageKey: "bb-01" },
          { id: "b8", title: "Broche Lona Macho Bronze Gris", description: "Broche lona macho en bronce gris, para sujeción de lonas.", imageKey: "bg-01" },
          { id: "b9", title: "Broche Lona Macho Bronze Negro", description: "Broche lona macho en bronce negro, para sujeción de lonas.", imageKey: "bn-01" },
          { id: "b10", title: "Broche Lona Macho Comun Bronze", description: "Broche lona macho común en bronce, para sujeción de lonas.", imageKey: "cb-01" },
          { id: "b11", title: "Broche Lona Macho Comun Cubeta", description: "Broche lona macho común con cubeta, para sujeción de lonas.", imageKey: "cc-01" },
          { id: "b12", title: "Broche Lona Macho Comun Inox", description: "Broche lona macho común en acero inoxidable, para sujeción de lonas.", imageKey: "ci-broche-01" },
          { id: "b13", title: "Broche Lona Macho Negro Cubeta", description: "Broche lona macho en negro con cubeta, para sujeción de lonas.", imageKey: "nc-01" },
        ],
      },
      {
        id: "caballetes",
        name: "Caballetes",
        description:
          "Caballetes de acero inoxidable diseñados para soportar las condiciones más exigentes. Resistentes a la corrosión y aptos para uso marino prolongado.",
        imageKey: "services-02",
        products: [
          { id: "c1", title: "Caballete Caño Inox", description: "Caballete de caño de acero inoxidable, resistente a la corrosión y apto para intemperie.", imageKey: "ci-01" },
        ],
      },
    ] satisfies ProductCategoryData[],
  },

  // ─── Works page ──────────────────────────────────────────────────────
  worksPage: {
    tabs: [
      { id: "capotas", name: "Capotas" },
      { id: "cerramientos", name: "Cerramientos" },
      { id: "tonos", name: "Tonos" },
    ],
    content: {
      capotas: {
        title: "Capotas para embarcaciones",
        // TODO: replace with real content
        description:
          "Diseño y confección de capotas personalizadas para embarcaciones, garantizando ajuste perfecto y resistencia a la intemperie.",
        items: [
          { id: "capotas-rigida", title: "Capota rígida", description: "TODO: descripción capota rígida" },
          { id: "capotas-semirrigida", title: "Capota semirrígida", description: "TODO: descripción capota semirrígida" },
          { id: "capotas-lona", title: "Capota de lona", description: "TODO: descripción capota de lona" },
        ],
      },
      cerramientos: {
        title: "Cerramientos",
        // TODO: replace with real content
        description:
          "Cerramientos a medida para protección y confort en tu embarcación, con materiales técnicos de alta durabilidad.",
        items: [
          { id: "cerramientos-lateral", title: "Cerramiento lateral", description: "TODO: descripción cerramiento lateral" },
          { id: "cerramientos-frontal", title: "Cerramiento frontal", description: "TODO: descripción cerramiento frontal" },
        ],
      },
      tonos: {
        title: "Tonos",
        // TODO: replace with real content
        description:
          "Tonos y cubiertas para embarcaciones, fabricados con materiales de primera calidad.",
        items: [
          { id: "tonos-bimini", title: "Toldo Bimini", description: "TODO: descripción toldo bimini" },
          { id: "tonos-cubre", title: "Cubre equipos", description: "TODO: descripción cubre equipos" },
        ],
      },
    },
    album: {
      // Photo album rendered by the Masonry on /trabajos.
      // `src` is an imageKey resolved by Works.tsx via a
      // Record<imageKey, string> map. When new works land, just
      // add the WebP to src/assets/img/ and a matching entry here.
      images: [
        { id: "svc-03", src: "services-03", alt: "Trabajo de lona" },
        { id: "svc-04", src: "services-04", alt: "Cubreauto" },
        { id: "svc-05", src: "services-05", alt: "Funda para moto de agua" },
        { id: "svc-06", src: "services-06", alt: "Carpa" },
        { id: "svc-07", src: "services-07", alt: "Toneau" },
        { id: "svc-08", src: "services-08", alt: "Capota" },
        { id: "wrk-01", src: "works-01", alt: "Trabajo de taller 1" },
        { id: "wrk-02", src: "works-02", alt: "Trabajo de taller 2" },
        { id: "wrk-03", src: "works-03", alt: "Trabajo de taller 3" },
        { id: "wrk-04", src: "works-04", alt: "Trabajo de taller 4" },
        { id: "wrk-05", src: "works-05", alt: "Trabajo de taller 5" },
      ],
    },
  } satisfies WorksPageData,

  // ─── Brands ──────────────────────────────────────────────────────────
  brands: [
    { id: "sauleda-logo", alt: "Sauleda", link: "https://sauleda.com/" },
    { id: "ykk-logo", alt: "YKK", link: "https://argentina.ykkamericas.com/" },
    { id: "sunbrella-logo", alt: "Sunbrella", link: "https://global.sunbrella.com" },
    { id: "coats-logo", alt: "Coats", link: "https://www.coats.com/" },
    { id: "achilles-logo", alt: "Achilles" },
  ] satisfies BrandData[],

  // ─── Deprecated backward-compat aliases ──────────────────────────────

  /** @deprecated import from `data.home.reviews` instead. Kept for backward compatibility. */
  Home: {
    Sections: [reviewsSection, aboutUsSection] satisfies Section[],
    Works: works,
    Reviews: reviews,
    FAQs: faqs,
  },
};
