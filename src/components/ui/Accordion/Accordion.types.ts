export interface AccordionItem {
  id: string;
  q: string;
  a: string;
}

export interface AccordionProps {
  items: AccordionItem[];
  className?: string;
}
