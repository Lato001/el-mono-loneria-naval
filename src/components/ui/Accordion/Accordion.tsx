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
          className="rounded-2xl border border-pr-aquamarine/40 bg-white/[0.07] transition-colors hover:border-pr-aquamarine hover:bg-white/10"
        >
          <AccordionPrimitive.Header>
            <AccordionPrimitive.Trigger className="group flex w-full cursor-pointer items-center justify-between gap-4 px-6 py-6 text-left sm:px-8">
              <span className="font-poppins text-lg font-semibold text-white">
                {item.q}
              </span>
              <IconChevronDown className="h-5 w-5 shrink-0 text-pr-aquamarine transition-transform duration-200 group-data-[state=open]:rotate-180" />
            </AccordionPrimitive.Trigger>
          </AccordionPrimitive.Header>
          <AccordionPrimitive.Content className="data-[state=open]:animate-slideDown data-[state=closed]:animate-slideUp overflow-hidden">
            <div className="border-t border-pr-aquamarine/30 px-6 pb-6 pt-5 sm:px-8">
              <p className="font-poppins text-base leading-relaxed text-white/85">
                {item.a}
              </p>
            </div>
          </AccordionPrimitive.Content>
        </AccordionPrimitive.Item>
      ))}
    </AccordionPrimitive.Root>
  );
}
