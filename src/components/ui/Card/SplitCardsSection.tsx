import type { ReactNode } from "react";

export interface SplitCardsSectionProps {
  children: ReactNode;
  className?: string;
}

export const SplitCardsSection = ({ children, className }: SplitCardsSectionProps) => {
  return (
    <section
      className={`mx-auto grid w-full max-w-6xl grid-cols-1 gap-8 px-4 md:grid-cols-2 ${className ?? ""}`}
    >
      {children}
    </section>
  );
};
