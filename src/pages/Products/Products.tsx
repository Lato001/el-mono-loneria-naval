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

interface ProductCategory {
  id: string;
  name: string;
  products: Product[];
}

const categories: ProductCategory[] = [
  {
    id: "broches",
    name: "Broches",
    products: [
      {
        id: "b1",
        title: "Broche Náutico",
        description: "Broche de bronce con diseño de ancla, ideal para sombreros y gorras.",
        imageSrc: services01,
      },
      {
        id: "b2",
        title: "Broche Marinero",
        description: "Broche clásico con cabo trenzado, acabado en bronce envejecido.",
        imageSrc: services02,
      },
      {
        id: "b3",
        title: "Broche Timón",
        description: "Broche decorativo con forma de timón, perfecto para decoración naval.",
        imageSrc: services04,
      },
      {
        id: "b4",
        title: "Broche Rosa de los Vientos",
        description: "Broche artesanal con rosa de los vientos calada en latón.",
        imageSrc: services05,
      },
    ],
  },
  {
    id: "caballetes",
    name: "Caballetes",
    products: [
      {
        id: "c1",
        title: "Caballete Classic",
        description: "Caballete de madera tratada para toldos y carpas náuticas.",
        imageSrc: services02,
      },
      {
        id: "c2",
        title: "Caballette Reforzado",
        description: "Estructura reforzada en acero inoxidable para cargas pesadas.",
        imageSrc: services04,
      },
      {
        id: "c3",
        title: "Caballette Plegable",
        description: "Caballete plegable de fácil transporte, ideal para embarcaciones.",
        imageSrc: services05,
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
        description: "Cierre de cremallera resistente al agua, calibre 10, para fundas náuticas.",
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
        description: "Hilo de PTFE 100% resistente a UV, sal y temperaturas extremas.",
        imageSrc: services05,
      },
      {
        id: "h2",
        title: "Hilo Polyester Naval",
        description: "Hilo de poliéster de alta tenacidad para costuras de lonas.",
        imageSrc: services01,
      },
      {
        id: "h3",
        title: "Hilo Kevlar Reforzado",
        description: "Hilo de aramida para costuras de máxima resistencia mecánica.",
        imageSrc: services02,
      },
      {
        id: "h4",
        title: "Hilo Sunbrella",
        description: "Hilo especialmente diseñado para telas Sunbrella, garantía de color.",
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
        Consultá por <strong className="text-sc-ocean-blue">{product.title}</strong> vía WhatsApp.
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
        ctaLabel="Ver catálogo"
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
          <CotizacionModalContent product={selectedProduct} onClose={closeQuotation} />
        )}
      </Modal>
    </>
  );
}
