import * as AccordionPrimitive from "@radix-ui/react-accordion";
import { IconChevronDown } from "@tabler/icons-react";

export interface AccordionItem {
  id: string;
  q: string;
  a: string;
}

interface AccordionProps {
  items: AccordionItem[];
  className?: string;
}

export function Accordion({ items, className = "" }: AccordionProps) {
  return (
    <AccordionPrimitive.Root
      type="single"
      collapsible
      className={`space-y-3 ${className}`}
    >
      {items.map((item) => (
        <AccordionPrimitive.Item
          key={item.id}
          value={item.id}
          className="rounded-xl border border-pr-aquamarine/30 bg-white/5 transition-colors hover:border-pr-aquamarine/60"
        >
          <AccordionPrimitive.Header>
            <AccordionPrimitive.Trigger className="group flex w-full cursor-pointer items-center justify-between gap-4 px-6 py-5 text-left">
              <span className="font-poppins text-lg font-semibold text-white">
                {item.q}
              </span>
              <IconChevronDown className="h-5 w-5 shrink-0 text-pr-aquamarine transition-transform duration-200 group-data-[state=open]:rotate-180" />
            </AccordionPrimitive.Trigger>
          </AccordionPrimitive.Header>
          <AccordionPrimitive.Content className="data-[state=open]:animate-slideDown data-[state=closed]:animate-slideUp overflow-hidden">
            <div className="border-t border-pr-aquamarine/20 px-6 pb-5 pt-4">
              <p className="font-poppins text-base leading-relaxed text-white/80">
                {item.a}
              </p>
            </div>
          </AccordionPrimitive.Content>
        </AccordionPrimitive.Item>
      ))}
    </AccordionPrimitive.Root>
  );
}
