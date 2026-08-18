import { ImgCard } from "../Card";
import { IconMaximize } from "@tabler/icons-react";
import type {
  FaqBubbleImage,
  FaqBubbleProps,
  FaqBubbleDialogData,
} from "./FaqBubble.types";

export type { FaqBubbleImage, FaqBubbleProps, FaqBubbleDialogData };

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

  const questionRounded = isEnd
    ? "rounded-[48px_48px_48px_0]"
    : "rounded-[48px_48px_0_48px]";

  const answerRounded = isEnd
    ? "rounded-[48px_0_48px_48px]"
    : "rounded-[0_48px_48px_48px]";

  const answerOffset = showChatTail
    ? isStart
      ? "md:ml-20"
      : isEnd
        ? "md:mr-20"
        : ""
    : "";

  const pairAlign = isEnd
    ? "items-end"
    : isCenter
      ? "items-center"
      : "items-start";

  const layoutDirection = isEnd
    ? "flex-col items-stretch md:flex-row-reverse"
    : "flex-col items-stretch md:flex-row";

  const layoutCross = isEnd
    ? "md:items-end"
    : isCenter
      ? "md:items-center"
      : "md:items-start";

  const imageWrapperClass =
    "relative flex w-full max-w-60 self-center md:max-w-none md:w-64 lg:w-72 md:self-auto";

  const peekMobileSide = isStart
    ? "right-0 top-1/2  translate-x-1/2"
    : "left-0 top-1/2  -translate-x-1/2";
  const peekDesktop = isStart
    ? "md:right-auto md:bottom-auto md:top-1/2 md:-translate-x-0 md:-translate-y-1/2 md:left-[-50%]"
    : "md:left-auto md:bottom-auto md:top-1/2 md:-translate-x-0 md:-translate-y-1/2 md:right-[-50%]";

  // The ImgCard render, shared by the interactive (mobile tap target) and
  // the decorative (desktop) branches.
  const imageCard = image && (
    <ImgCard
      src={image.src}
      alt={image.alt}
      images={image.images}
      title={image.title}
      className="max-w-none"
    />
  );

  return (
    <div
      className={`relative flex w-full gap-6 md:gap-2 ${layoutDirection} ${layoutCross}`}
    >
      {/* Chat pair: question + answer. Mobile hides it — the question and
          answer live inside the sheet dialog opened from the ImgCard. */}
      <div
        className={`hidden md:flex min-w-0 flex-1 flex-col gap-6 ${pairAlign}`}
      >
        {/* Pregunta */}
        <div
          className={`
            w-full max-w-md
            bg-sc-ocean-blue
            text-white
            border-2 border-sc-chalk
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
            border-2 border-sc-chalk
            px-[clamp(1.25rem,4.1667vw,2rem)] py-[clamp(1rem,4.1667vw,2rem)]
            ${answerRounded}
            ${answerOffset}
            ${answerClassName}
          `}
        >
          <p className="text-xl font-semibold font-poppins">{answer}</p>
        </div>
      </div>

      {/* ImgCard (tap target on mobile) + decorative peek badge behind it */}
      {image && (
        <div className={imageWrapperClass}>
          {peekIcon && !isCenter && (
            <img
              src={peekIcon}
              alt=""
              aria-hidden="true"
              className={`
                pointer-events-none absolute z-0 h-40 w-40 rounded-full  p-0 object-contain
                ${peekMobileSide}
                md:h-full md:w-full
                ${peekDesktop}
              `}
            />
          )}

          {!isCenter && onPeekTap ? (
            <button
              type="button"
              aria-label={`Ver respuesta: ${question}`}
              onClick={(event) => {
                // Mobile-only interaction: below md the chat pair is hidden
                // and the sheet dialog takes over. On desktop the pair is
                // visible, so a stray click or keyboard activation must not
                // open the dialog.
                if (window.matchMedia("(min-width: 768px)").matches) return;
                onPeekTap(
                  {
                    question,
                    highlight,
                    answer,
                    image: dialogImage(image),
                  },
                  event,
                );
              }}
              className={`
                relative z-10 block w-full cursor-pointer
                border-0 bg-transparent p-0 text-left
                md:cursor-default
                focus-visible:outline-2 focus-visible:outline-offset-2
                focus-visible:outline-pr-aquamarine
              `}
            >
              {imageCard}
              {/* Mobile hint chip: tells first-time users the card opens the
                  answer. Hidden on desktop (the chat pair is right there) and
                  placed opposite the peek badge to balance the composition. */}
              <span
                aria-hidden="true"
                className={`
                  absolute top-3 z-20 flex items-center gap-1.5
                  rounded-full bg-pr-aquamarine px-3 py-1.5
                  font-poppins text-xs font-semibold text-sc-ocean-blue
                  shadow-lg md:hidden
                  ${isStart ? "left-3" : "right-3"}
                `}
              >
                <IconMaximize className="size-3.5" stroke={2.5} />
                Más info...
              </span>
            </button>
          ) : (
            <div className="relative z-10 w-full">{imageCard}</div>
          )}
        </div>
      )}
    </div>
  );
}

export default FaqBubble;