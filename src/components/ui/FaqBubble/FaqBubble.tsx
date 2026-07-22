export interface FaqBubbleProps {
  question: string;
  /** Optional substring of the question to highlight with an accent color. */
  highlight?: string;
  answer: string;
  /**
   * Horizontal alignment of the bubble inside its parent.
   * - "start" (default): question on the left, answer nudged right (chat goes left→right).
   * - "end": question on the right, answer nudged left (chat goes right→left).
   * - "center": both centered, no offset.
   */
  align?: "start" | "center" | "end";
}

/**
 * FaqBubble — a single FAQ entry rendered as a chat-style pair of bubbles.
 * Visually: a navy question bubble on top, a sky-blue answer bubble below,
 * with rounded corners shaped to suggest a chat "tail" on the conversation
 * side. Mirrors the title-align values used by SectionWrapper.
 */
export function FaqBubble({
  question,
  highlight,
  answer,
  align = "start",
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

  // Container alignment: where the pair sits inside its parent.
  const containerAlign = isEnd
    ? "items-end"
    : isCenter
      ? "items-center"
      : "items-start";

  return (
    <div className={`flex w-full flex-col gap-6 ${containerAlign}`}>
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
  );
}

export default FaqBubble;
