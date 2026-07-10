import type { HomeSectionProps } from "./HomeSection.types";

export function HomeSection({
  icon,
  eyebrow,
  title,
  children,
  centerTitleOnMobile = false,
}: HomeSectionProps) {
  return (
    <section className="bg-sc-chalk px-8 py-20" aria-label={title}>
      <div className="mx-auto max-w-295">
        <div className="flex gap-6">
          {icon && (
            <img
              src={icon}
              alt=""
              aria-hidden="true"
              className="mt-4 h-16 w-16 shrink-0 self-start rounded-full"
            />
          )}
          <div
            className={
              centerTitleOnMobile ? "text-center md:text-left" : undefined
            }
          >
            {eyebrow && (
              <p className="font-poppins mb-4 text-xs uppercase tracking-[0.2em] text-pr-hero-blue">
                {eyebrow}
              </p>
            )}
            <h2 className="font-poppins mb-12 font-bold uppercase leading-[1.05] text-[clamp(1.8rem,3.5vw,2.8rem)] text-sc-ocean-blue">
              {title}
            </h2>
            {children}
          </div>
        </div>
      </div>
    </section>
  );
}
