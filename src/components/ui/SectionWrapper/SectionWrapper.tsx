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
  headingLevel = "h2",
}: SectionWrapperProps) {
  const Heading = headingLevel;
  const headingClasses = `font-poppins mb-8 font-bold uppercase leading-[1.05] text-[clamp(1.8rem,3.5vw,2.8rem)] ${theme === "dark" ? "text-white" : "text-pr-hero-blue"} `;

  return (
    <section
      id={id}
      className={`${theme === "dark" ? "bg-sc-ocean-blue" : "bg-sc-chalk"} py-20 text-white  ${className ?? ""}`}
      aria-label={title}
    >
      <div className="mx-auto max-w-295 px-6">
        <div className={`flex ${titlesAlignClasses[titlesAlign]} `}>
          <div>
            {eyebrow && (
              <p
                className={`${titlesTextClasses[titlesAlign]} font-poppins mb-4 text-xs uppercase tracking-[0.2em] ${theme === "dark" ? "text-pr-aquamarine" : "text-pr-hero-blue"} `}
              >
                {eyebrow}
              </p>
            )}
            <Heading className={headingClasses}>{title}</Heading>
          </div>
        </div>
        <div className="mt-8 w-full">{children}</div>
      </div>
    </section>
  );
}
