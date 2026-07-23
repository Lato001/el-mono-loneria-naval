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
   * Optional PNG (or SVG) rendered as a faded background watermark behind
   * the chat pair. Decorative — `aria-hidden`, `pointer-events: none`.
   * Use the brand's category icon at low opacity for a subtle
   * "category-stamped" feel.
   */
  watermark?: string;
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
 * When `watermark` is provided, a faded copy of the brand's category
 * icon sits behind the chat pair as a subtle stamp.
 */
export function FaqBubble({
  question,
  highlight,
  answer,
  align = "start",
  image,
  watermark,
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
  const answerOffset = isStart
    ? "md:ml-20"
    : isEnd
      ? "md:mr-20"
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
  const imageWrapperClass = "flex w-full md:w-64 lg:w-72";

  return (
    <div className={`relative flex w-full gap-6 md:gap-2 ${layoutDirection} ${layoutCross}`}>
      {/* Watermark: faded brand icon stamped behind the chat pair. */}
      {watermark && (
        <img
          src={watermark}
          alt=""
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 m-auto h-3/4 w-3/4 max-w-lg object-contain opacity-[0.06] mix-blend-screen"
        />
      )}
      {/* Chat pair: question + answer */}
      <div className={`flex min-w-0 flex-1 flex-col gap-6 ${pairAlign}`}>
        {/* Pregunta */}
        <div
          className={`
            w-full max-w-md
            bg-[#4B56A8]
            text-white
            px-8 py-8
            ${questionRounded}
          `}
        >
          <h2 className="text-4xl font-bold leading-tight">
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
            bg-sky-400
            text-white
            px-8 py-8
            ${answerRounded}
            ${answerOffset}
          `}
        >
          <p className="text-lg leading-relaxed font-medium">{answer}</p>
        </div>
      </div>

      {/* Imagen representativa (ImgCard) */}
      {image && (
        <div className={imageWrapperClass}>
          <ImgCard
            src={image.src}
            alt={image.alt}
            images={image.images}
            title={image.title}
            className="max-w-none"
          />
        </div>
      )}
    </div>
  );
}

export default FaqBubble;
