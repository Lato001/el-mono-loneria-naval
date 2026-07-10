import type { ServicesSectionProps } from "./ServicesSection.types";

export function ServicesSection({
  children,
  className,
  icon,
  eyebrow,
  title,
}: ServicesSectionProps) {
  return (
    <section
      className={`bg-sc-ocean-blue py-20 text-white ${className ?? ""}`}
      aria-label={title}
    >
      <div className="mx-auto max-w-295 px-6">
        <div
          className={
            icon
              ? "flex flex-col items-center gap-6 md:flex-row md:items-start md:gap-8"
              : "flex flex-col items-center gap-6"
          }
        >
          {icon && (
            <img
              src={icon}
              alt=""
              aria-hidden="true"
              className="h-16 w-16 shrink-0 rounded-full object-cover"
            />
          )}
          <div className={icon ? "" : "text-center"}>
            {eyebrow && (
              <p className="font-poppins mb-4 text-xs uppercase tracking-[0.2em] text-pr-aquamarine">
                {eyebrow}
              </p>
            )}
            <h2 className="font-poppins mb-8 font-bold uppercase leading-[1.05] text-[clamp(1.8rem,3.5vw,2.8rem)] text-white">
              {title}
            </h2>
          </div>
        </div>
        <div className="mt-8 w-full">{children}</div>
      </div>
    </section>
  );
}
