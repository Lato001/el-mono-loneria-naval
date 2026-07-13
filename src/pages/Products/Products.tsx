import { useState } from "react";
import { useMediaQuery } from "../../hooks/useMediaQuery";
import { CatalogHero } from "../../components/ui/CatalogHero";
import { CatalogTabs } from "../../components/ui/CatalogTabs";
import { Modal } from "../../components/ui/Modal";
import { ProductCarousel } from "../../components/ui/ProductCarousel";
import type { Product } from "../../components/ui/ProductCarousel/ProductCarousel.types";
import type { Tab } from "../../components/ui/CatalogTabs/CatalogTabs.types";
import services01 from "../../assets/img/services/services-01.jpg";
import services02 from "../../assets/img/services/services-02.jpg";
import services04 from "../../assets/img/services/services-04.jpg";
import services05 from "../../assets/img/services/services-05.jpg";

// Broches — Casco
import baca01 from "../../assets/img/products/broches/broche-casco/baca/baca-01.webp";
import bacp01 from "../../assets/img/products/broches/broche-casco/bacp/bacp-01.webp";
import bar01 from "../../assets/img/products/broches/broche-casco/bar/bar-01.webp";

// Broches — Lona Hembra
import hb01 from "../../assets/img/products/broches/broche-lona/hembra/bronze/hb-01.webp";
import hi01 from "../../assets/img/products/broches/broche-lona/hembra/inox/hi-01.webp";

// Broches — Lona Macho
import bb01 from "../../assets/img/products/broches/broche-lona/macho/bronze-blanco/bb-01.webp";
import bg01 from "../../assets/img/products/broches/broche-lona/macho/bronze-gris/bg-01.webp";
import bn01 from "../../assets/img/products/broches/broche-lona/macho/bronze-negro/bn-01.webp";
import cb01 from "../../assets/img/products/broches/broche-lona/macho/comun-bronze/cb-01.webp";
import cc01 from "../../assets/img/products/broches/broche-lona/macho/comun-cubeta/cc-01.webp";
import ciBroche01 from "../../assets/img/products/broches/broche-lona/macho/comun-inox/ci-01.webp";
import nc01 from "../../assets/img/products/broches/broche-lona/macho/negro-cubeta/nc-01.webp";

// Caballetes
import ci01 from "../../assets/img/products/caballetes/cano-inox/ci-01.webp";

const brochesProducts: Product[] = [
  { id: "b1", title: "Broche Casco Baca", description: "Broche a presión de carcasa tipo baca, para sombreros y gorras.", imageSrc: baca01 },
  { id: "b2", title: "Broche Casco Bacp", description: "Broche a presión de carcasa tipo bacp, para uso intensivo.", imageSrc: bacp01 },
  { id: "b3", title: "Broche Casco Bar", description: "Broche a presión de carcasa tipo bar, para decoración naval.", imageSrc: bar01 },
  { id: "b4", title: "Broche Lona Hembra Bronze", description: "Broche lona hembra en bronce, para sujeción de lonas y correas.", imageSrc: hb01 },
  { id: "b5", title: "Broche Lona Hembra Inox", description: "Broche lona hembra en acero inoxidable, para sujeción de lonas y correas.", imageSrc: hi01 },
  { id: "b6", title: "Broche Lona Macho Bronze Blanco", description: "Broche lona macho en bronce blanco, para sujeción de lonas.", imageSrc: bb01 },
  { id: "b7", title: "Broche Lona Macho Bronze Gris", description: "Broche lona macho en bronce gris, para sujeción de lonas.", imageSrc: bg01 },
  { id: "b8", title: "Broche Lona Macho Bronze Negro", description: "Broche lona macho en bronce negro, para sujeción de lonas.", imageSrc: bn01 },
  { id: "b9", title: "Broche Lona Macho Comun Bronze", description: "Broche lona macho común en bronce, para sujeción de lonas.", imageSrc: cb01 },
  { id: "b10", title: "Broche Lona Macho Comun Cubeta", description: "Broche lona macho común con cubeta, para sujeción de lonas.", imageSrc: cc01 },
  { id: "b11", title: "Broche Lona Macho Comun Inox", description: "Broche lona macho común en acero inoxidable, para sujeción de lonas.", imageSrc: ciBroche01 },
  { id: "b12", title: "Broche Lona Macho Negro Cubeta", description: "Broche lona macho en negro con cubeta, para sujeción de lonas.", imageSrc: nc01 },
];

interface ProductCategory {
  id: string;
  name: string;
  products: Product[];
}

const categories: ProductCategory[] = [
  {
    id: "broches",
    name: "Broches",
    products: brochesProducts,
  },
  {
    id: "caballetes",
    name: "Caballetes",
    products: [
      {
        id: "c1",
        title: "Caballete Caño Inox",
        description:
          "Caballete de caño de acero inoxidable, resistente a la corrosión y apto para intemperie.",
        imageSrc: ci01,
      },
    ],
  },
  {
    id: "cierres",
    name: "Cierres",
    products: [
      {
        id: "ci1",
        title: "Cierre Cremallera #10",
        description:
          "Cierre de cremallera resistente al agua, calibre 10, para fundas náuticas.",
        imageSrc: services04,
      },
      {
        id: "ci2",
        title: "Cierre Velcro Marino",
        description: "Velcro de alta adherencia tratado contra UV y salinidad.",
        imageSrc: services05,
      },
      {
        id: "ci3",
        title: "Cierre Snap Bronce",
        description: "Botones a presión de bronce macizo para lonas y toldos.",
        imageSrc: services01,
      },
    ],
  },
  {
    id: "hilos",
    name: "Hilos",
    products: [
      {
        id: "h1",
        title: "Hilo PTFE Premium",
        description:
          "Hilo de PTFE 100% resistente a UV, sal y temperaturas extremas.",
        imageSrc: services05,
      },
      {
        id: "h2",
        title: "Hilo Polyester Naval",
        description:
          "Hilo de poliéster de alta tenacidad para costuras de lonas.",
        imageSrc: services01,
      },
      {
        id: "h3",
        title: "Hilo Kevlar Reforzado",
        description:
          "Hilo de aramida para costuras de máxima resistencia mecánica.",
        imageSrc: services02,
      },
      {
        id: "h4",
        title: "Hilo Sunbrella",
        description:
          "Hilo especialmente diseñado para telas Sunbrella, garantía de color.",
        imageSrc: services04,
      },
    ],
  },
];

const tabs: Tab[] = categories.map((c) => ({ id: c.id, name: c.name }));

function CotizacionModalContent({
  product,
  onClose,
}: {
  product: Product;
  onClose: () => void;
}) {
  const baseUrl = import.meta.env.VITE_WHATSAPP_URL as string;
  const pageUrl = window.location.href;
  const message = encodeURIComponent(
    `Hola! Me interesa el producto "${product.title}". Página: ${pageUrl}`,
  );
  const whatsappHref = `${baseUrl} ${message}`;

  return (
    <div className="font-poppins mt-4 flex flex-col gap-3">
      <p className="text-sm text-sc-ocean-blue/70">
        Consultá por{" "}
        <strong className="text-sc-ocean-blue">{product.title}</strong> vía
        WhatsApp.
      </p>
      <a
        href={whatsappHref}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center justify-center gap-2 rounded-md bg-pr-hero-blue px-5 py-2.5 text-base font-medium text-white transition-colors hover:bg-pr-hero-blue/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-pr-aquamarine"
      >
        Consultar por WhatsApp
      </a>
      <button
        type="button"
        onClick={onClose}
        className="inline-flex items-center justify-center rounded-md border-2 border-sc-ocean-blue/20 px-5 py-2.5 text-sm font-medium text-sc-ocean-blue/70 transition-colors hover:border-sc-ocean-blue/40 hover:text-sc-ocean-blue focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-pr-aquamarine"
      >
        Seguir viendo
      </button>
    </div>
  );
}

export function Products() {
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [activeCategoryId, setActiveCategoryId] = useState<string | null>(null);
  const isMobile = useMediaQuery("(max-width: 767px)");

  const handleTabSelect = (id: string) => {
    setActiveCategoryId(id);
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  };

  const openQuotation = (product: Product) => {
    setSelectedProduct(product);
  };

  const closeQuotation = () => {
    setSelectedProduct(null);
  };

  return (
    <>
      <CatalogHero
        eyebrow="Catálogo"
        title="Nuestros productos"
        description="Explorá nuestra selección de artículos náuticos: broches, caballetes, cierres e hilos de la más alta calidad para tu embarcación."
        ctaLabel="Solicitar precios!"
        ctaTargetId="tabs"
      />

      <div id="tabs">
        <CatalogTabs
          categories={tabs}
          activeId={activeCategoryId ?? undefined}
          onSelect={handleTabSelect}
          topOffset={56}
        />

        {categories.map((cat) => (
          <ProductCarousel
            key={cat.id}
            id={cat.id}
            items={cat.products}
            ariaLabel={cat.name}
            onQuotationOpen={openQuotation}
          />
        ))}
      </div>

      <Modal
        open={!!selectedProduct}
        onOpenChange={closeQuotation}
        title="Cotizar producto"
        description="Te llevamos a WhatsApp con el producto pre-seleccionado."
        variant={isMobile ? "sheet" : "centered"}
      >
        {selectedProduct && (
          <CotizacionModalContent
            product={selectedProduct}
            onClose={closeQuotation}
          />
        )}
      </Modal>
    </>
  );
}
