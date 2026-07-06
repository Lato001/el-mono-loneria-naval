import type { HomeSectionProps } from "./HomeSection.types";

export function HomeSection({ eyebrow, title, children }: HomeSectionProps) {
  return (
    <section className="bg-sc-chalk px-8 py-20" aria-label={title}>
      <div className="mx-auto max-w-295">
        {eyebrow && (
          <p className="font-poppins mb-4 text-xs uppercase tracking-[0.2em] text-pr-aquamarine">
            {eyebrow}
          </p>
        )}
        <h2 className="font-poppins mb-12 font-bold uppercase leading-[1.05] text-[clamp(1.8rem,3.5vw,2.8rem)] text-sc-ocean-blue">
          {title}
        </h2>
        {children}
      </div>
    </section>
  );
}
