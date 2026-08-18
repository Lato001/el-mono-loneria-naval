import {Root,Item,Header,Trigger,Content }from "@radix-ui/react-accordion"; 
import { IconChevronDown } from "@tabler/icons-react";
import type { AccordionProps } from "./Accordion.types";

export function Accordion({ items, className = "" }: AccordionProps) {
  return (
    <Root
      type="single"
      collapsible
      className={`space-y-3 ${className}`}
    >
      {items.map((item) => (
        <Item
          key={item.id}
          value={item.id}
          className="rounded-2xl border border-pr-aquamarine/40 bg-white/[0.07] transition-colors hover:border-pr-aquamarine hover:bg-white/10"
        >
          <Header>
            <Trigger className="group flex w-full cursor-pointer items-center justify-between gap-4 px-6 py-6 text-left sm:px-8">
              <span className="font-poppins text-xl font-semibold text-white">
                {item.q}
              </span>
              <IconChevronDown className="h-5 w-5 shrink-0 text-pr-aquamarine transition-transform duration-200 group-data-[state=open]:rotate-180" />
            </Trigger>
          </Header>
          <Content className="data-[state=open]:animate-slideDown data-[state=closed]:animate-slideUp overflow-hidden">
            <div className="border-t border-pr-aquamarine/30 px-6 pb-6 pt-5 sm:px-8">
              <p className="font-poppins text-lg leading-relaxed text-white/85">
                {item.a}
              </p>
            </div>
          </Content>
        </Item>
      ))}
    </Root>
  );
}
