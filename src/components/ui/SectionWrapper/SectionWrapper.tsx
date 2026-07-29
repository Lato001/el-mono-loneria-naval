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
}: SectionWrapperProps) {
  const Heading = headingLevel;
  const headingClasses = `font-poppins mb-8 font-bold uppercase  text-3xl ${theme === "dark" ? "text-white" : "text-pr-hero-blue"} `;

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
                className={`${titlesTextClasses[titlesAlign]} font-poppins mb-2 text-base uppercase tracking-[0.2em] ${theme === "dark" ? "text-pr-aquamarine" : "text-pr-hero-blue"} `}
              >
                {eyebrow}
              </p>
            )}
            <Heading className={headingClasses}>{title}</Heading>
          </div>
        </div>
        <div className="mt-4 w-full">{children}</div>
      </div>
    </section>
  );
}
