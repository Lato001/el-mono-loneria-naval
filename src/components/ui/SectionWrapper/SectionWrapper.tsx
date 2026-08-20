import type { SectionWrapperProps } from "./SectionWrapper.types";

const titlesAlignClasses = {
  start: "justify-start",
  center: "justify-center",
  end: "justify-end",
} as const;

const titlesTextClasses = {
  start: "text-start",
  center: "text-center",
  end: "text-end",
} as const;

export function SectionWrapper({
  children,
  className,
  id,
  eyebrow,
  subtitle,
  title,
  theme = "dark",
  titlesAlign = "start",
  headingLevel = "h1",
  fullWidth,
  containerClassName,
  backgroundImage,
}: SectionWrapperProps) {
  const Heading = headingLevel;
  const headingClasses = `font-poppins mb-8 font-bold uppercase text-[clamp(1.875rem,3vw,2.5rem)] ${theme === "dark" ? "text-white" : "text-pr-hero-blue"} `;
  const containerClasses = fullWidth
    ? "w-full"
    : containerClassName ?? "mx-auto max-w-295 px-6";

  const titleBlock = (
    <>
      {eyebrow && (
        <p
          className={`${titlesAlignClasses[titlesAlign]} ${titlesTextClasses[titlesAlign]} font-poppins mb-2 flex items-center gap-2.5 text-xs uppercase tracking-[0.2em] ${theme === "dark" ? "text-pr-aquamarine" : "text-pr-hero-blue"} `}
        >
          {eyebrow}
        </p>
      )}
      <Heading className={`${headingClasses} ${titlesTextClasses[titlesAlign]}`}>{title}</Heading>
    </>
  );

  return (
    <section
      id={id}
      className={`${theme === "dark" ? "bg-sc-ocean-blue" : "bg-sc-chalk"} py-25 text-white ${
        backgroundImage ? "relative overflow-hidden" : ""
      } ${className ?? ""}`}
      aria-label={title}
    >
      {backgroundImage && (
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-y-0 left-1/2 w-screen max-w-none -translate-x-1/2 opacity-50 bg-fade-mask"
          style={{
            backgroundImage: `url(${backgroundImage})`
          }}
        />
      )}
      <div className={`${containerClasses} ${backgroundImage ? "relative z-10" : ""}`}>
        <div
          className={`flex ${
            subtitle
              ? "flex-col gap-3 sm:flex-row sm:items-end sm:justify-between"
              : titlesAlignClasses[titlesAlign]
          } `}
        >
          <div>{titleBlock}</div>
          {subtitle && (
            <p
              className={`${titlesTextClasses[titlesAlign]} mb-8 pb-1 font-poppins text-sm leading-relaxed ${
                theme === "dark" ? "text-sc-chalk/70" : "text-pr-hero-blue/70"
              } sm:max-w-xs`}
            >
              {subtitle}
            </p>
          )}
        </div>
        <div className={`mt-4 w-full ${fullWidth ? "overflow-hidden" : ""}`}>{children}</div>
      </div>
    </section>
  );
}
