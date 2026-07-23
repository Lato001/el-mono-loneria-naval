export interface FaqBubbleImage {
  /** Optional image source. When omitted, a placeholder is rendered. */
  src?: string;
  /** Alt text and placeholder label. Always required for a11y. */
  alt: string;
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
}

/**
 * FaqBubble — a single FAQ entry rendered as a chat-style pair of bubbles
 * (navy question on top, sky-blue answer below) with a rectangular image
 * slot on the opposite side. Mirrors the title-align values used by
 * SectionWrapper.
 *
 * When `image.src` is omitted, a dashed placeholder card is rendered so
 * designers/devs can see the slot before real artwork is available.
 */
export function FaqBubble({
  question,
  highlight,
  answer,
  align = "start",
  image,
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

  return (
    <div className={`flex w-full gap-6 ${layoutDirection} ${layoutCross}`}>
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

      {/* Imagen representativa (o placeholder) */}
      {image && (
        <div className="flex shrink-0 md:w-72">
          {image.src ? (
            <img
              src={image.src}
              alt={image.alt}
              className="aspect-video w-full rounded-xl object-cover"
            />
          ) : (
            <div
              role="img"
              aria-label={image.alt}
              className="
                flex aspect-video w-full items-center justify-center
                rounded-xl border border-dashed border-pr-aquamarine/40
                bg-pr-aquamarine/5
              "
            >
              <span className="font-poppins text-xs font-semibold uppercase tracking-[0.15em] text-pr-aquamarine/60">
                {image.alt}
              </span>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default FaqBubble;
