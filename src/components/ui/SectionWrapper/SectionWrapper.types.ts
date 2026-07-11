import type { ReactNode } from "react";

export interface SectionWrapperProps {
  children: ReactNode;
  className?: string;
  /** Small uppercase label above the title. Optional. */
  eyebrow?: string;
  /** Section title. Required. */
  title: string;
  theme? : 'dark' | 'light'
  titlesAlign?: 'start' | 'center' | 'end' 
}
