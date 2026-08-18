/**
 * Type definitions for FaqBubble component.
 * Separate .types.ts file per project convention (Button, Card, HomeSection, WorksGrid, AboutSection).
 */

import type { MouseEvent as ReactMouseEvent } from "react";

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

/**
 * Data passed to the page-level dialog when a mobile peek button is tapped.
 * Contains the question, optional highlight, answer, and optional image for the sheet dialog.
 */
export interface FaqBubbleDialogData {
  /** The full FAQ question text. */
  question: string;
  /** Optional substring of the question to highlight with accent color. */
  highlight?: string;
  /** The FAQ answer text. */
  answer: string;
  /** Optional image to display in the dialog (first image from slideshow or single src). */
  image?: { src: string; alt: string; title?: string };
}

/**
 * Props for the FaqBubble component.
 * Includes the onPeekTap callback for mobile interactive behavior.
 */
export interface FaqBubbleProps {
  /** The FAQ question text. */
  question: string;
  /** Optional substring of the question to highlight with an accent color. */
  highlight?: string;
  /** The FAQ answer text. */
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
   * Half the icon sticks out from behind the ImgCard. Purely decorative
   * on every viewport: on desktop it peeks toward the chat pair, on
   * mobile it peeks from the card's side edge as a bounded badge that
   * never overflows the viewport.
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
  /**
   * Callback fired when the ImgCard is tapped on mobile (viewport < 768px).
   * The whole card is the tap target — the chat pair is hidden on mobile,
   * so the sheet dialog carries the question, answer and image. Receives
   * the bubble's dialog data plus the originating click event so the owner
   * can restore focus to the trigger when the dialog closes (this dialog
   * opens programmatically, so Radix has no DialogTrigger to restore focus
   * to). Desktop stays decorative.
   */
  onPeekTap?: (
    data: FaqBubbleDialogData,
    event: ReactMouseEvent<HTMLButtonElement>,
  ) => void;
}