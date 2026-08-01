import { ImgCard } from "../Card";

export interface FaqBubbleImage {
  /** Optional single image source. */
  src?: string;
  /**
   * Optional slideshow. When provided with 2+ entries, the ImgCard will
   * auto-rotate through them. Use this for category galleries.
   */
  images?: { src: string; alt: string }[];
  /** Alt text for the (first) image or placeholder. Always required for a11y. */
  alt: string;
  /** Optional title rendered as a centered overlay on top of the image. */
  title?: string;
}

export interface FaqBubbleProps {
  question: string;
  /** Optional substring of the question to highlight with an accent color. */
  highlight?: string;
  answer: string;
  /**
   * Horizontal alignment of the chat pair (question + answer).
   * - "start" (default): pair sits on the left, image on the right.
   * - "end": pair sits on the right, image on the left.
   * - "center": pair is centered, image stacks below.
   */
  align?: "start" | "center" | "end";
  /** Optional image to render on the opposite side of the chat pair. */
  image?: FaqBubbleImage;
  /**
   * Optional PNG (or SVG) used as a "peek" icon behind the ImgCard.
   * Half the icon sticks out from behind the ImgCard toward the chat
   * pair (i.e. toward the inside of the page), so the icon reads as
   * a sticker layered over the photograph. Decorative —
   * `aria-hidden`, `pointer-events: none`.
   */
  peekIcon?: string;
  /** Optional extra classes appended to the question bubble. */
  questionClassName?: string;
  /** Optional extra classes appended to the answer bubble. */
  answerClassName?: string;
  /**
   * Render the chat-tail offset on the answer bubble (md:ml-20 / md:mr-20).
   * Disable it when the pair renders inside a constrained container
   * (e.g. the overlay inside an ImgCard), where the offset would push
   * the answer out of the card and get clipped.
   */
  showChatTail?: boolean;
}

/**
 * FaqBubble — a single FAQ entry rendered as a chat-style pair of bubbles
 * (navy question on top, sky-blue answer below) with an ImgCard on the
 * opposite side. Mirrors the title-align values used by SectionWrapper.
 *
 * When `image` is omitted, no image slot is rendered. When `image` is
 * provided without `src` or `images`, the ImgCard falls back to its
 * internal placeholder behaviour.
 *
 * When `peekIcon` is provided, half the icon is layered behind the
 * ImgCard and peeks toward the chat pair.
 */
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
  const imageWrapperClass = "relative flex w-full md:w-64 lg:w-72";

  // Peek icon positioning.
  // - Mobile: the ImgCard stacks BELOW the chat pair, so the peek
  //   overflows downward (centred horizontally) — the half sticking
  //   out appears below the photograph.
  // - Desktop: the ImgCard sits NEXT to the chat pair. The peek
  //   overflows toward the INNER side (toward the chat pair, into
  //   the page). start → image on the right, peek overflows to the
  //   left. end → image on the left, peek overflows to the right.
  //   Uses arbitrary values for the overflow axis (md:left-[-50%] /
  //   md:right-[-50%]) so the cascade order can't drop the desktop
  //   offset in favour of the mobile left-1/2 or md:left-auto utilities.
  const peekMobile = "left-1/2 -translate-x-1/2 -bottom-1/2";
  const peekDesktop = isStart
    ? "md:right-auto md:bottom-auto md:top-1/2 md:-translate-x-0 md:-translate-y-1/2 md:left-[-50%]"
    : "md:left-auto md:bottom-auto md:top-1/2 md:-translate-x-0 md:-translate-y-1/2 md:right-[-50%]";
  const peekPositionClasses = `${peekMobile} ${peekDesktop}`;

  return (
    <div
      className={`relative flex w-full gap-6 md:gap-2 ${layoutDirection} ${layoutCross}`}
    >
      {/* Chat pair: question + answer */}
      <div className={`flex min-w-0 flex-1 flex-col gap-6 ${pairAlign}`}>
        {/* Pregunta */}
        <div
          className={`
            w-full max-w-md
            bg-sc-ocean-blue
            text-white
            border-10 border-sc-chalk
            px-[clamp(1.25rem,4.1667vw,2rem)] py-[clamp(1rem,4.1667vw,2rem)]
            ${questionRounded}
            ${questionClassName}
          `}
        >
          <h2 className="text-[clamp(1.5rem,4.6875vw,2.25rem)] font-bold leading-tight">
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
            border-10 border-sc-chalk
            px-[clamp(1.25rem,4.1667vw,2rem)] py-[clamp(1rem,4.1667vw,2rem)]
            ${answerRounded}
            ${answerOffset}
            ${answerClassName}
          `}
        >
          <p className="text-[clamp(0.875rem,2.0833vw,1rem)] leading-relaxed font-medium">
            {answer}
          </p>
        </div>
      </div>

      {/* Imagen representativa (ImgCard) + peek icon behind it */}
      {image && (
        <div className={`hidden md:block ${imageWrapperClass}`}>
          {peekIcon && (
            <img
              src={peekIcon}
              alt=""
              aria-hidden="true"
              className={`
                pointer-events-none absolute z-0
                hidden h-full w-full object-contain
                md:block
                ${peekPositionClasses}
              `}
            />
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
