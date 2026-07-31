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
  title,
  theme = "dark",
  titlesAlign = "start",
  headingLevel = "h1",
  fullWidth,
}: SectionWrapperProps) {
  const Heading = headingLevel;
  const headingClasses = `font-poppins mb-8 font-bold uppercase  text-3xl ${theme === "dark" ? "text-white" : "text-pr-hero-blue"} `;
  const containerClasses = fullWidth
    ? "w-full"
    : "mx-auto max-w-295 px-6";

  const bgGradient = theme === "dark"
    ? "linear-gradient(to bottom, #001051 0%, #001051 calc(100% - 24px), #F4F4F4 100%)"
    : "linear-gradient(to bottom, #F4F4F4 0%, #F4F4F4 calc(100% - 24px), #001051 100%)";

  return (
    <section
      id={id}
      className={`relative py-20 text-white ${className ?? ""}`}
      style={{ background: bgGradient }}
      aria-label={title}
    >
      {/* Top edge glow */}
      <div className="absolute top-0 left-0 right-0 h-px bg-linear-to-r from-transparent via-pr-aquamarine/50 to-transparent" />
      <div className="absolute top-0 left-[15%] right-[15%] h-[3px] bg-linear-to-r from-transparent via-pr-aquamarine/20 to-transparent blur-sm" />

      {/* Bottom edge glow */}
      <div className="absolute bottom-0 left-0 right-0 h-px bg-linear-to-r from-transparent via-pr-aquamarine/50 to-transparent" />
      <div className="absolute bottom-0 left-[15%] right-[15%] h-[3px] bg-linear-to-r from-transparent via-pr-aquamarine/20 to-transparent blur-sm" />

      <div className={containerClasses}>
        <div className={`flex ${titlesAlignClasses[titlesAlign]} `}>
          <div>
            {eyebrow && (
              <p
                className={`${titlesTextClasses[titlesAlign]} font-poppins mb-2 text-base uppercase tracking-[0.2em] ${theme === "dark" ? "text-pr-aquamarine" : "text-pr-hero-blue"} `}
              >
                {eyebrow}
              </p>
            )}
            <Heading className={headingClasses}>{title}</Heading>
          </div>
        </div>
        <div className={`mt-4 w-full ${fullWidth ? "overflow-hidden" : ""}`}>{children}</div>
      </div>
    </section>
  );
}
