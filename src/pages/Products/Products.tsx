import { useLayoutEffect, useMemo, useRef, useState } from "react";
import {
  IconX,
  IconBulb,
  IconChevronLeft,
  IconChevronRight,
} from "@tabler/icons-react";
import { useSessionSelection } from "../../hooks/useSessionSelection";
import { useProductCarousel } from "../../components/ui/ProductCarousel/useProductCarousel";
import { buildWhatsAppUrl } from "./whatsappUrl";
import {
  SectionHero,
  SectionTabs,
  ActionBar,
  Modal,
  Button,
  ProductCarousel,
  FaqBubble,
} from "../../components/ui";
import type { Product } from "../../components/ui/ProductCarousel/ProductCarousel.types";
import type { Tab } from "../../components/ui/SectionTabs/SectionTabs.types";
import { data } from "../../mocks/data";
import { ImgCard } from "../../components";
import MediaPlayer from "../../components/ui/MediaPlayer/MediaPLayer";
import isotipoElMono from "../../assets/logos/elmono/isotipo-elmono.png";

const STORAGE_KEY = "mono:quote-cart";

// ─── Product images (auto-discovered via Vite glob) ─────────────────────
const productImages = import.meta.glob(
  "../../assets/img/products/**/*.{webp,png,jpg}",
  { eager: true, import: "default" },
) as Record<string, string>;

const productsImageMap: Record<string, string> = Object.fromEntries(
  Object.entries(productImages).map(([path, url]) => {
    const key = path
      .split("/")
      .pop()!
      .replace(/\.[^.]+$/, "");
    return [key, url];
  }),
);

// ─── Category "applied" images ─────────────────────────────────────────────
const catImages = import.meta.glob(
  "../../assets/img/services/**/*.{webp,png,jpg}",
  { eager: true, import: "default" },
) as Record<string, string>;

const categoryImagesMap: Record<string, string> = Object.fromEntries(
  Object.entries(catImages).map(([path, url]) => {
    const key = path
      .split("/")
      .pop()!
      .replace(/\.[^.]+$/, "");
    return [key, url];
  }),
);

// ─── Derived data ────────────────────────────────────────────────────────

/** Converts ProductData (imageKey) → Product (imageSrc) for the carousel. */
function toProduct(p: {
  id: string;
  title: string;
  description: string;
  imageKey: string;
}): Product {
  return {
    id: p.id,
    title: p.title,
    description: p.description,
    imageSrc: productsImageMap[p.imageKey],
  };
}

const categories = data.products.categories.map((cat) => ({
  id: cat.id,
  name: cat.name,
  description: cat.description,
  imageKey: cat.imageKey,
  videoUrl: cat.videoUrl,
  products: cat.products.map(toProduct),
}));

const tabs: Tab[] = categories.map((c) => ({ id: c.id, name: c.name }));

function CotizacionModalContent({
  products,
  onRemove,
  whatsappHref,
  isWhatsAppDisabled,
  whatsappDisabledReason,
}: {
  products: Product[];
  onRemove: (id: string) => void;
  whatsappHref: string;
  isWhatsAppDisabled: boolean;
  whatsappDisabledReason?: string;
}) {
  return (
    <div className="font-poppins mt-4 flex min-h-0 flex-1 flex-col gap-3">
      {products.length === 0 ? (
        <p className="text-sm text-sc-ocean-blue/70">
          {data.ui.noProductsSelected}
        </p>
      ) : (
        <ul className="flex min-h-0 flex-1 flex-col gap-2 overflow-y-auto">
          {products.map((p) => (
            <li
              key={p.id}
              className="flex items-center justify-between gap-3 rounded-md border-2 border-pr-aquamarine px-3 py-2"
            >
              <span className="flex min-w-0 items-center gap-3">
                <img
                  src={p.imageSrc}
                  alt={p.title}
                  className="size-14 shrink-0 rounded object-cover"
                />
                <span className="truncate text-base font-poppins font-semibold text-sc-ocean-blue">
                  {p.title}
                </span>
              </span>
              <button
                type="button"
                onClick={() => onRemove(p.id)}
                aria-label={`Quitar ${p.title}`}
                className="rounded-full p-1 text-sc-chalk bg-sc-ocean-blue transition-colors hover:bg-sc-chalk hover:text-sc-ocean-blue  hover:ring-2 hover:cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-pr-aquamarine"
              >
                <IconX className="h-5 w-5" stroke={3} />
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
          className="inline-flex items-center justify-center gap-2 rounded-md bg-sc-ocean-blue px-5 py-2.5 text-base font-medium text-white transition-colors hover:bg-pr-hero-blue/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-pr-aquamarine"
        >
          {data.ui.consultWhatsApp}
        </a>
      )}
    </div>
  );
}

export function Products() {
  const { selected, isSelected, toggle, remove, clear, count } =
    useSessionSelection(STORAGE_KEY);
  const { scrollRef, prev, next } = useProductCarousel();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isClearModalOpen, setIsClearModalOpen] = useState(false);
  const [activeCategoryId, setActiveCategoryId] = useState<string>(
    categories[0].id,
  );
  const [showMobileInfo, setShowMobileInfo] = useState(false);
  const [tipFits, setTipFits] = useState(true);
  const overlayBoxRef = useRef<HTMLDivElement>(null);
  const overlayContentRef = useRef<HTMLDivElement>(null);

  // Fit-or-hide: the full category description renders at its natural size.
  // If it would overflow the ImgCard (very narrow viewports), the overlay
  // content is hidden instead of scrolling or clipping a bubble.
  useLayoutEffect(() => {
    if (!showMobileInfo) return;
    const box = overlayBoxRef.current;
    const content = overlayContentRef.current;
    if (!box || !content) return;
    const check = () => setTipFits(content.scrollHeight <= box.clientHeight);
    check();
    const ro = new ResizeObserver(check);
    ro.observe(box);
    ro.observe(content);
    return () => ro.disconnect();
  }, [showMobileInfo, activeCategoryId]);

  const activeCategory = categories.find((c) => c.id === activeCategoryId);

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

  const selectedCounts = useMemo<Record<string, number>>(() => {
    const counts: Record<string, number> = {};
    for (const cat of categories) {
      const catCount = cat.products.filter((p) => selected.has(p.id)).length;
      if (catCount > 0) counts[cat.id] = catCount;
    }
    return counts;
  }, [selected]);

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
    setShowMobileInfo(false);
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
      <SectionHero
        title={data.ui.catalogHeroTitle}
        description={data.ui.catalogHeroDescription}
      />

      <div className="bg-sc-chalk">
        <div id="tabs">
          <SectionTabs
            categories={tabs}
            activeId={activeCategoryId}
            onSelect={handleTabSelect}
            selectedCounts={selectedCounts}
          />

          {activeCategory && (
            <div className="px-6 pt-10 pb-20 xl:mx-auto xl:max-w-400">
              <div
                data-testid="catalog-layout"
                className="flex flex-col gap-8 xl:grid xl:grid-cols-12 xl:gap-8 xl:h-176"
              >
                {/* COLUMNA IZQUIERDA (Tarjeta de Imagen) */}
                <div className="flex shrink-0 justify-center xl:col-span-5 xl:h-full xl:items-center">
                  <ImgCard
                    src={categoryImagesMap[activeCategory.imageKey]}
                    alt={activeCategory.name}
                    className="xl:max-w-120 xl:max-h-200"
                    actionButton={
                      <button
                        type="button"
                        onClick={() => setShowMobileInfo((prev) => !prev)}
                        className="flex size-12 items-center justify-center rounded-full bg-sc-sky-blue text-sc-chalk shadow-lg transition-transform hover:scale-105 active:scale-95 hover:cursor-pointer"
                        aria-label={
                          showMobileInfo
                            ? "Cerrar información"
                            : "Ver información"
                        }
                      >
                        {showMobileInfo ? (
                          <IconX size={30} stroke={2.5} />
                        ) : (
                          <IconBulb size={30} stroke={2} />
                        )}
                      </button>
                    }
                    overlay={
                      showMobileInfo ? (
                        <div
                          ref={overlayBoxRef}
                          className="h-full overflow-hidden bg-black/5 p-6 backdrop-brightness-70 backdrop-blur-sm card:flex-row card:items-center card:justify-center card:p-10"
                        >
                          <div
                            ref={overlayContentRef}
                            className="flex w-full flex-col items-center gap-6 card:flex-row card:items-center card:justify-center card:gap-8 card:pl-0"
                          ></div>
                          <div className="absolute right-6 top-1 flex justify-center items-center gap-4 card:right-10 card:top-0">
                            <div className="flex justify-center items-center">
                              <img
                                src={isotipoElMono}
                                alt="Isotipo El Mono"
                                className="size-16 card:size-24"
                              />
                              <FaqBubble
                                question="MONO TIP"
                                answer={activeCategory.description}
                                align="end"
                                showChatTail={false}
                                questionClassName="shadow-2xl mt-26 text-center"
                                answerClassName={`shadow-2xl text-center ${tipFits ? "" : "invisible"}`}
                              />
                            </div>
                          </div>
                        </div>
                      ) : undefined
                    }
                  />
                </div>

                {/* COLUMNA DERECHA (Video + Productos) */}
                <div className="flex w-full min-w-0 flex-col-reverse gap-6 xl:h-full xl:flex-col xl:col-span-7 xl:gap-8">
                  {/* Video: 16:9 centrado en la mitad superior */}
                  <div className="w-full min-w-0 xl:flex xl:flex-1 xl:min-h-0 xl:items-center xl:justify-center">
                    <div className="w-full overflow-hidden rounded-2xl aspect-video xl:h-full xl:w-auto xl:max-w-full xl:mt-16">
                      <MediaPlayer
                        key={activeCategory.id}
                        src={activeCategory.videoUrl}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  </div>
                  {/* Carousel: mitad inferior */}
                  <div className="relative flex w-full min-w-0 flex-1 flex-col xl:min-h-0">
                    <button
                      type="button"
                      aria-label={data.ui.prevLabel}
                      onClick={prev}
                      className="group absolute left-10 top-1/2 z-10 hidden -translate-y-1/2 rounded-full bg-sc-ocean-blue p-3 shadow-md backdrop-blur-sm transition-colors hover:bg-pr-aquamarine/60  focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-pr-aquamarine xl:block hover:cursor-pointer"
                    >
                      <IconChevronLeft
                        stroke={4}
                        className="h-5 w-5 text-sc-chalk transition-colors group-hover:text-sc-ocean-blue"
                      />
                    </button>
                    <div className="xl:mx-auto  xl:h-full xl:w-150 xl:max-w-full">
                      <ProductCarousel
                        id={activeCategory.id}
                        items={activeCategory.products}
                        ariaLabel={activeCategory.name}
                        isSelected={isSelected}
                        onToggle={toggle}
                        scrollRef={scrollRef}
                      />
                    </div>
                    <button
                      type="button"
                      aria-label={data.ui.nextLabel}
                      onClick={next}
                      className="group absolute right-8 top-1/2 z-10 hidden -translate-y-1/2 rounded-full bg-sc-ocean-blue p-3 shadow-md backdrop-blur-sm transition-colors hover:bg-pr-aquamarine/60  focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-pr-aquamarine xl:block hover:cursor-pointer"
                    >
                      <IconChevronRight
                        stroke={4}
                        className="h-5 w-5 text-sc-chalk transition-colors group-hover:text-sc-ocean-blue"
                      />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      <ActionBar
        selectedCount={count}
        onPresupuestar={handleOpenModal}
        onClear={handleOpenClearModal}
        presupuestarDisabled={count === 0}
      />

      <Modal
        open={isModalVisible}
        onOpenChange={(open) => {
          if (!open) handleCloseModal();
        }}
        title={data.ui.quoteModal.title}
        description={data.ui.quoteModal.description}
      >
        <CotizacionModalContent
          products={selectedProducts}
          onRemove={remove}
          whatsappHref={whatsappResult.href}
          isWhatsAppDisabled={whatsappResult.isTooLong}
          whatsappDisabledReason={data.ui.whatsappDisabledReason}
        />
      </Modal>

      <Modal
        open={isClearModalOpen}
        onOpenChange={(open) => {
          if (!open) handleCloseClearModal();
        }}
        title={data.ui.clearModal.title}
        description={data.ui.clearModal.description}
        variant="centered"
        size="sm"
      >
        <div className="font-poppins mt-4 flex flex-col gap-4">
          <p className="text-sm text-sc-ocean-blue">
            {data.ui.clearConfirmation}
          </p>
          <div className="flex justify-end gap-2">
            <Button
              variant="primary"
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
