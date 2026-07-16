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
import { data } from "../../mocks/data";

const STORAGE_KEY = "mono:quote-cart";

// ─── Image imports (resolved at build time by Vite) ──────────────────────
import bacan01 from "../../assets/img/products/broches/broche-casco/baca/negro/bacan-01.webp";
import bacab01 from "../../assets/img/products/broches/broche-casco/baca/blanco/bacab-01.webp";
import bacp01 from "../../assets/img/products/broches/broche-casco/bacp/bacp-01.webp";
import bar01 from "../../assets/img/products/broches/broche-casco/bar/bar-01.webp";
import hb01 from "../../assets/img/products/broches/broche-lona/hembra/bronze/hb-01.webp";
import hi01 from "../../assets/img/products/broches/broche-lona/hembra/inox/hi-01.webp";
import bb01 from "../../assets/img/products/broches/broche-lona/macho/bronze-blanco/bb-01.webp";
import bg01 from "../../assets/img/products/broches/broche-lona/macho/bronze-gris/bg-01.webp";
import bn01 from "../../assets/img/products/broches/broche-lona/macho/bronze-negro/bn-01.webp";
import cb01 from "../../assets/img/products/broches/broche-lona/macho/comun-bronze/cb-01.webp";
import cc01 from "../../assets/img/products/broches/broche-lona/macho/comun-cubeta/cc-01.webp";
import ciBroche01 from "../../assets/img/products/broches/broche-lona/macho/comun-inox/ci-01.webp";
import nc01 from "../../assets/img/products/broches/broche-lona/macho/negro-cubeta/nc-01.webp";
import ci01 from "../../assets/img/products/caballetes/cano-inox/ci-01.webp";

const productsImageMap: Record<string, string> = {
  "bacan-01": bacan01,
  "bacab-01": bacab01,
  "bacp-01": bacp01,
  "bar-01": bar01,
  "hb-01": hb01,
  "hi-01": hi01,
  "bb-01": bb01,
  "bg-01": bg01,
  "bn-01": bn01,
  "cb-01": cb01,
  "cc-01": cc01,
  "ci-broche-01": ciBroche01,
  "nc-01": nc01,
  "ci-01": ci01,
};

// ─── Derived data ────────────────────────────────────────────────────────

/** Converts ProductData (imageKey) → Product (imageSrc) for the carousel. */
function toProduct(p: { id: string; title: string; description: string; imageKey: string }): Product {
  return { id: p.id, title: p.title, description: p.description, imageSrc: productsImageMap[p.imageKey] };
}

const categories = data.products.categories.map((cat) => ({
  id: cat.id,
  name: cat.name,
  products: cat.products.map(toProduct),
}));

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
          {data.ui.noProductsSelected}
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
          {whatsappDisabledReason ?? data.ui.whatsappDisabledReason}
        </p>
      ) : (
        <a
          href={whatsappHref}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center justify-center gap-2 rounded-md bg-pr-hero-blue px-5 py-2.5 text-base font-medium text-white transition-colors hover:bg-pr-hero-blue/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-pr-aquamarine"
        >
          {data.ui.consultWhatsApp}
        </a>
      )}

      <div className="flex gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={onClear}
          disabled={products.length === 0}
          ariaLabel={data.ui.vaciarSelectionAriaLabel}
        >
          {data.ui.vaciarButton}
        </Button>
        <Button variant="ghost" size="sm" onClick={onClose}>
          {data.ui.keepBrowsing}
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
        title={data.ui.catalogHeroTitle}
        description={data.ui.catalogHeroDescription}
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
        title={data.ui.quoteModal.title}
        description={data.ui.quoteModal.description}
        variant={isMobile ? "sheet" : "centered"}
      >
        <CotizacionModalContent
          products={selectedProducts}
          onRemove={remove}
          onClear={clear}
          onClose={handleCloseModal}
          whatsappHref={whatsappResult.href}
          isWhatsAppDisabled={whatsappResult.isTooLong}
          whatsappDisabledReason={data.ui.whatsappDisabledReason}
        />
      </Modal>

      <Modal
        open={isClearModalOpen}
        onOpenChange={(open) => { if (!open) handleCloseClearModal(); }}
        title={data.ui.clearModal.title}
        description={data.ui.clearModal.description}
        variant={isMobile ? "sheet" : "centered"}
      >
        <div className="font-poppins mt-4 flex flex-col gap-4">
          <p className="text-sm text-sc-ocean-blue">
            {data.ui.clearConfirmation}
          </p>
          <div className="flex justify-end gap-2">
            <Button
              variant="secondary"
              size="sm"
              onClick={handleCloseClearModal}
              ariaLabel={data.ui.cancel}
            >
              {data.ui.cancel}
            </Button>
            <Button
              variant="danger"
              size="sm"
              onClick={handleConfirmClear}
              ariaLabel={data.ui.clearListAriaLabel}
            >
              {data.ui.delete}
            </Button>
          </div>
        </div>
      </Modal>
    </>
  );
}
