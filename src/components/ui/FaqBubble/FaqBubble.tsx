import { ImgCard } from "../Card";
import type {
  FaqBubbleImage,
  FaqBubbleProps,
  FaqBubbleDialogData,
} from "./FaqBubble.types";

export type { FaqBubbleImage, FaqBubbleProps, FaqBubbleDialogData };

/**
 * FaqBubble — a single FAQ entry rendered as a chat-style pair of bubbles
 * (navy question on top, sky-blue answer below) with an ImgCard on the
 * opposite side. Mirrors the title-align values used by SectionWrapper.
 *
 * When `image` is omitted, no image slot is rendered. When `image` is
 * provided without `src` or `images`, the ImgCard falls back to its
 * internal placeholder behaviour.
 *
 * When `peekIcon` is provided, the icon is layered behind the ImgCard.
 * On desktop the chat pair shows next to the ImgCard and the peek stays
 * decorative, overflowing toward the chat pair. On mobile the chat pair
 * is hidden — the ImgCard is the only content and the peek becomes a
 * tappable button peeking from the card's side edge (right for
 * `align="start"`, left for `align="end"`), firing `onPeekTap` with the
 * bubble's dialog data so the owner can open a sheet dialog with the
 * question, answer and image.
 */

/**
 * Build the image payload for the page-level dialog. Slideshows resolve
 * to their first slide; a single `src` resolves directly; placeholder-only
 * images resolve to undefined so the dialog renders no image slot.
 */
function dialogImage(
  image?: FaqBubbleImage,
): { src: string; alt: string; title?: string } | undefined {
  if (!image) return undefined;
  if (image.images && image.images.length > 0) {
    return { src: image.images[0].src, alt: image.images[0].alt };
  }
  if (image.src) {
    return { src: image.src, alt: image.alt, title: image.title };
  }
  return undefined;
}

export function FaqBubble({
  question,
  highlight,
  answer,
  align = "start",
  image,
  peekIcon,
  questionClassName,
  answerClassName,
  showChatTail = true,
  onPeekTap,
}: FaqBubbleProps) {
  const parts = highlight ? question.split(highlight) : [question];

  const isStart = align === "start";
  const isEnd = align === "end";
  const isCenter = align === "center";

  // Question corner rounding: tail is on the conversation side.
  // start → tail bottom-right; end → tail bottom-left; center → uniform.
  const questionRounded = isEnd
    ? "rounded-[48px_48px_48px_0]"
    : "rounded-[48px_48px_0_48px]";
  // Answer corner rounding: tail is on the opposite side of the question.
  const answerRounded = isEnd
    ? "rounded-[48px_0_48px_48px]"
    : "rounded-[0_48px_48px_48px]";

  // Offset for the answer so it sits away from the question (chat-tail effect).
  // Skipped when showChatTail is false (e.g. inside a constrained overlay
  // container) to avoid overflowing and getting clipped.
  const answerOffset = showChatTail
    ? isStart
      ? "md:ml-20"
      : isEnd
        ? "md:mr-20"
        : ""
    : "";

  // Container alignment (vertical axis): where the pair sits inside its parent.
  const pairAlign = isEnd
    ? "items-end"
    : isCenter
      ? "items-center"
      : "items-start";

  // Outer layout: row on md+ (image next to pair), column on mobile.
  // When align=end we flip the row so the image lands on the left.
  const layoutDirection = isEnd
    ? "flex-col items-stretch md:flex-row-reverse"
    : "flex-col items-stretch md:flex-row";

  // Cross-axis alignment so the image vertically centers against the pair.
  const layoutCross = isEnd
    ? "md:items-end"
    : isCenter
      ? "md:items-center"
      : "md:items-start";

  // Constrain the ImgCard so it doesn't fight the chat pair for attention.
  // No `hidden md:block` — the ImgCard must render on mobile too.
  const imageWrapperClass = "relative flex w-full md:w-64 lg:w-72";

  // Peek positioning.
  // - Mobile: the ImgCard is the ONLY content on screen (the chat pair is
  //   hidden). The peek button sits BEHIND the ImgCard, vertically
  //   centered, peeking from the card's side edge: RIGHT for
  //   `align=start` (insumos, servicios), LEFT for `align=end`
  //   (tiempos, trabajos). Tapping it opens the page-level sheet dialog
  //   with the question, answer and image.
  // - Desktop: the chat pair shows next to the ImgCard and the peek stays
  //   decorative, overflowing toward the chat pair exactly as before
  //   (start → left, end → right), with pointer-events disabled and
  //   aria-hidden so it never intercepts pointer or assistive
  //   interactions.
  const peekMobileSide = isStart
    ? "right-0 top-1/2  translate-x-1/2"
    : "left-0 top-1/2  -translate-x-1/2";
  const peekDesktop = isStart
    ? "md:right-auto md:bottom-auto md:top-1/2 md:-translate-x-0 md:-translate-y-1/2 md:left-[-50%]"
    : "md:left-auto md:bottom-auto md:top-1/2 md:-translate-x-0 md:-translate-y-1/2 md:right-[-50%]";

  return (
    <div
      className={`relative flex w-full gap-6 md:gap-2 ${layoutDirection} ${layoutCross}`}
    >
      {/* Chat pair: question + answer. Mobile hides it — the question and
          answer live inside the sheet dialog opened from the peek button. */}
      <div
        className={`hidden md:flex min-w-0 flex-1 flex-col gap-6 ${pairAlign}`}
      >
        {/* Pregunta */}
        <div
          className={`
            w-full max-w-md
            bg-sc-ocean-blue
            text-white
            border-5 border-sc-chalk
            px-[clamp(1.25rem,4.1667vw,2rem)] py-[clamp(1rem,4.1667vw,2rem)]
            ${questionRounded}
            ${questionClassName}
          `}
        >
          <h2 className="text-4xl font-poppins font-bold leading-tight">
            {parts[0]}

            {highlight && (
              <>
                <span className="text-cyan-300">{highlight}</span>
                {parts[1]}
              </>
            )}
          </h2>
        </div>

        {/* Respuesta */}
        <div
          className={`
            w-full max-w-md
            bg-sc-sky-blue
            text-white
            border-5 border-sc-chalk
            px-[clamp(1.25rem,4.1667vw,2rem)] py-[clamp(1rem,4.1667vw,2rem)]
            ${answerRounded}
            ${answerOffset}
            ${answerClassName}
          `}
        >
          <p className="text-xl font-semibold font-poppins">{answer}</p>
        </div>
      </div>

      {/* Imagen representativa (ImgCard) + peek icon behind it */}
      {image && (
        <div className={imageWrapperClass}>
          {peekIcon && !isCenter && (
            <button
              type="button"
              aria-label={`Ver respuesta: ${question}`}
              onClick={(event) =>
                onPeekTap?.(
                  {
                    question,
                    highlight,
                    answer,
                    image: dialogImage(image),
                  },
                  event,
                )
              }
              className={`
                absolute z-10 flex min-h-11 min-w-11 cursor-pointer
                items-center justify-center p-2
                ${peekMobileSide}
                ${peekDesktop}
                md:pointer-events-none md:aria-hidden
                md:h-full md:w-full md:min-h-0 md:min-w-0 md:p-0
              `}
            >
              <img
                src={peekIcon}
                alt=""
                aria-hidden="true"
                className="pointer-events-none h-full w-full object-contain"
              />
            </button>
          )}
          <div className="relative z-10 w-full">
            <ImgCard
              src={image.src}
              alt={image.alt}
              images={image.images}
              title={image.title}
              className="max-w-none"
            />
          </div>
        </div>
      )}
    </div>
  );
}

export default FaqBubble;