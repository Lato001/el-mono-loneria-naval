import type { Work, WorksGridProps } from "./WorksGrid.types";

function WorkCard({ title, description }: Work) {
  return (
    <article className="flex flex-col gap-4 rounded-lg bg-white p-6 shadow-lg">
      <h3 className="font-poppins font-bold text-lg uppercase text-sc-ocean-blue">
        {title}
      </h3>
      <p className="font-poppins text-base text-sc-ocean-blue/80">
        {description}
      </p>
    </article>
  );
}

export function WorksGrid({ works }: WorksGridProps) {
  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {works.map((work) => (
        <WorkCard key={work.id} {...work} />
      ))}
    </div>
  );
}
