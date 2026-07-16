import { useMemo, useState } from "react";
import { IconX } from "@tabler/icons-react";
import { useMediaQuery } from "../../hooks/useMediaQuery";
import { useSessionSelection } from "../../hooks/useSessionSelection";
import { buildWhatsAppUrl } from "./whatsappUrl";
import { CatalogHero } from "../../components/ui/CatalogHero";
import { CatalogTabs } from "../../components/ui/CatalogTabs";
import { Modal } from "../../components/ui/Modal";
import { Button } from "../../components/ui/Button";
import { ProductCarousel } from "../../components/ui/ProductCarousel";
import type { Product } from "../../components/ui/ProductCarousel/ProductCarousel.types";
import type { Tab } from "../../components/ui/CatalogTabs/CatalogTabs.types";

const STORAGE_KEY = "mono:quote-cart";

// Broches — Casco
import bacan01 from "../../assets/img/products/broches/broche-casco/baca/negro/bacan-01.webp";
import bacab01 from "../../assets/img/products/broches/broche-casco/baca/blanco/bacab-01.webp";
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
  {
    id: "b1",
    title: "Broche Casco Bacan",
    description: "Broche a presión de carcasa tipo baca, acabado negro.",
    imageSrc: bacan01,
  },
  {
    id: "b2",
    title: "Broche Casco Bacab",
    description: "Broche a presión de carcasa tipo baca, acabado blanco.",
    imageSrc: bacab01,
  },
  {
    id: "b3",
    title: "Broche Casco Bacp",
    description: "Broche a presión de carcasa tipo bacp, para uso intensivo.",
    imageSrc: bacp01,
  },
  {
    id: "b4",
    title: "Broche Casco Bar",
    description: "Broche a presión de carcasa tipo bar, para decoración naval.",
    imageSrc: bar01,
  },
  {
    id: "b5",
    title: "Broche Lona Hembra Bronze",
    description:
      "Broche lona hembra en bronce, para sujeción de lonas y correas.",
    imageSrc: hb01,
  },
  {
    id: "b6",
    title: "Broche Lona Hembra Inox",
    description:
      "Broche lona hembra en acero inoxidable, para sujeción de lonas y correas.",
    imageSrc: hi01,
  },
  {
    id: "b7",
    title: "Broche Lona Macho Bronze Blanco",
    description: "Broche lona macho en bronce blanco, para sujeción de lonas.",
    imageSrc: bb01,
  },
  {
    id: "b8",
    title: "Broche Lona Macho Bronze Gris",
    description: "Broche lona macho en bronce gris, para sujeción de lonas.",
    imageSrc: bg01,
  },
  {
    id: "b9",
    title: "Broche Lona Macho Bronze Negro",
    description: "Broche lona macho en bronce negro, para sujeción de lonas.",
    imageSrc: bn01,
  },
  {
    id: "b10",
    title: "Broche Lona Macho Comun Bronze",
    description: "Broche lona macho común en bronce, para sujeción de lonas.",
    imageSrc: cb01,
  },
  {
    id: "b11",
    title: "Broche Lona Macho Comun Cubeta",
    description: "Broche lona macho común con cubeta, para sujeción de lonas.",
    imageSrc: cc01,
  },
  {
    id: "b12",
    title: "Broche Lona Macho Comun Inox",
    description:
      "Broche lona macho común en acero inoxidable, para sujeción de lonas.",
    imageSrc: ciBroche01,
  },
  {
    id: "b13",
    title: "Broche Lona Macho Negro Cubeta",
    description:
      "Broche lona macho en negro con cubeta, para sujeción de lonas.",
    imageSrc: nc01,
  },
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
];

const tabs: Tab[] = categories.map((c) => ({ id: c.id, name: c.name }));

function CotizacionModalContent({
  products,
  onRemove,
  onClear,
  onClose,
  whatsappHref,
  isWhatsAppDisabled,
  whatsappDisabledReason,
}: {
  products: Product[];
  onRemove: (id: string) => void;
  onClear: () => void;
  onClose: () => void;
  whatsappHref: string;
  isWhatsAppDisabled: boolean;
  whatsappDisabledReason?: string;
}) {
  return (
    <div className="font-poppins mt-4 flex flex-col gap-3">
      {products.length === 0 ? (
        <p className="text-sm text-sc-ocean-blue/70">
          No hay productos seleccionados.
        </p>
      ) : (
        <ul className="flex flex-col gap-2 max-h-72 overflow-y-auto">
          {products.map((p) => (
            <li
              key={p.id}
              className="flex items-center justify-between gap-3 rounded-md border border-sc-ocean-blue/15 px-3 py-2"
            >
              <span className="text-sm text-sc-ocean-blue">{p.title}</span>
              <button
                type="button"
                onClick={() => onRemove(p.id)}
                aria-label={`Quitar ${p.title}`}
                className="rounded-full p-1 text-sc-ocean-blue/60 transition-colors hover:bg-sc-chalk hover:text-sc-ocean-blue focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-pr-aquamarine"
              >
                <IconX className="h-4 w-4" />
              </button>
            </li>
          ))}
        </ul>
      )}

      {isWhatsAppDisabled ? (
        <p
          role="note"
          className="rounded-md border border-amber-300 bg-amber-50 px-4 py-2 text-sm text-amber-900"
        >
          {whatsappDisabledReason ?? "El mensaje es demasiado largo; contactanos por WhatsApp directamente."}
        </p>
      ) : (
        <a
          href={whatsappHref}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center justify-center gap-2 rounded-md bg-pr-hero-blue px-5 py-2.5 text-base font-medium text-white transition-colors hover:bg-pr-hero-blue/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-pr-aquamarine"
        >
          Consultar por WhatsApp
        </a>
      )}

      <div className="flex gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={onClear}
          disabled={products.length === 0}
          ariaLabel="Vaciar selección"
        >
          Vaciar
        </Button>
        <Button variant="ghost" size="sm" onClick={onClose}>
          Seguir viendo
        </Button>
      </div>
    </div>
  );
}

export function Products() {
  const { selected, isSelected, toggle, remove, clear, count } =
    useSessionSelection(STORAGE_KEY);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isClearModalOpen, setIsClearModalOpen] = useState(false);
  const [activeCategoryId, setActiveCategoryId] = useState<string | null>(null);
  const isMobile = useMediaQuery("(max-width: 767px)");

  const selectedProducts = useMemo<Product[]>(
    () =>
      Array.from(selected).flatMap((id) => {
        for (const cat of categories) {
          const p = cat.products.find((x) => x.id === id);
          if (p) return [p];
        }
        return [];
      }),
    [selected],
  );

  const whatsappResult = useMemo(
    () =>
      buildWhatsAppUrl(
        selectedProducts,
        import.meta.env.VITE_WHATSAPP_URL as string,
        window.location.href,
      ),
    [selectedProducts],
  );

  const handleTabSelect = (id: string) => {
    setActiveCategoryId(id);
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  };

  const handleOpenModal = () => setIsModalOpen(true);
  const handleCloseModal = () => setIsModalOpen(false);

  const handleOpenClearModal = () => setIsClearModalOpen(true);
  const handleCloseClearModal = () => setIsClearModalOpen(false);
  const handleConfirmClear = () => {
    clear();
    setIsClearModalOpen(false);
  };

  // Auto-close: derive modal visibility — if selection empties while modal is open,
  // the derived `isModalVisible` becomes false without calling setState in an effect.
  const isModalVisible = isModalOpen && selected.size > 0;

  return (
    <>
      <CatalogHero
        title="Nuestros productos"
        description="Explorá nuestra selección de artículos náuticos: broches, caballetes, cierres e hilos de la más alta calidad para tu embarcación."
      />

      <div id="tabs">
        <CatalogTabs
          categories={tabs}
          activeId={activeCategoryId ?? undefined}
          onSelect={handleTabSelect}
          topOffset={56}
          selectedCount={count}
          onPresupuestar={handleOpenModal}
          onClear={handleOpenClearModal}
          presupuestarDisabled={count === 0}
        />

        {categories.map((cat) => (
          <ProductCarousel
            key={cat.id}
            id={cat.id}
            items={cat.products}
            ariaLabel={cat.name}
            isSelected={isSelected}
            onToggle={toggle}
          />
        ))}
      </div>

      <Modal
        open={isModalVisible}
        onOpenChange={(open) => { if (!open) handleCloseModal(); }}
        title="Cotizar productos"
        description="Te llevamos a WhatsApp con los productos pre-seleccionados."
        variant={isMobile ? "sheet" : "centered"}
      >
        <CotizacionModalContent
          products={selectedProducts}
          onRemove={remove}
          onClear={clear}
          onClose={handleCloseModal}
          whatsappHref={whatsappResult.href}
          isWhatsAppDisabled={whatsappResult.isTooLong}
          whatsappDisabledReason="El mensaje es demasiado largo; contactanos por WhatsApp directamente."
        />
      </Modal>

      <Modal
        open={isClearModalOpen}
        onOpenChange={(open) => { if (!open) handleCloseClearModal(); }}
        title="Borrar lista"
        description="Vas a eliminar todos los productos seleccionados."
        variant={isMobile ? "sheet" : "centered"}
      >
        <div className="font-poppins mt-4 flex flex-col gap-4">
          <p className="text-sm text-sc-ocean-blue">
            ¿Estás seguro que querés borrar toda la lista de productos
            seleccionados? Esta acción no se puede deshacer.
          </p>
          <div className="flex justify-end gap-2">
            <Button
              variant="secondary"
              size="sm"
              onClick={handleCloseClearModal}
              ariaLabel="Cancelar"
            >
              Cancelar
            </Button>
            <Button
              variant="danger"
              size="sm"
              onClick={handleConfirmClear}
              ariaLabel="Borrar lista"
            >
              Borrar
            </Button>
          </div>
        </div>
      </Modal>
    </>
  );
}
