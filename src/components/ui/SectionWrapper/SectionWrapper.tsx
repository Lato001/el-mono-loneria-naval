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
  eyebrowDash = false,
  subtitle,
  title,
  theme = "dark",
  titlesAlign = "start",
  headingLevel = "h1",
  fullWidth,
  containerClassName,
}: SectionWrapperProps) {
  const Heading = headingLevel;
  const headingClasses = `font-poppins mb-8 font-bold uppercase  text-3xl ${theme === "dark" ? "text-white" : "text-pr-hero-blue"} `;
  const containerClasses = fullWidth
    ? "w-full"
    : containerClassName ?? "mx-auto max-w-295 px-6";

  const titleBlock = (
    <>
      {eyebrow && (
        <p
          className={`${titlesTextClasses[titlesAlign]} font-poppins mb-2 flex items-center gap-2.5 text-base uppercase tracking-[0.2em] ${theme === "dark" ? "text-pr-aquamarine" : "text-pr-hero-blue"} `}
        >
          {eyebrowDash && (
            <span
              aria-hidden="true"
              className="h-px w-4 shrink-0 bg-current"
            />
          )}
          {eyebrow}
        </p>
      )}
      <Heading className={headingClasses}>{title}</Heading>
    </>
  );

  return (
    <section
      id={id}
      className={`${theme === "dark" ? "bg-sc-ocean-blue " : "bg-sc-chalk"} py-20 text-white  ${className ?? ""}`}
      aria-label={title}
    >
      <div className={containerClasses}>
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
