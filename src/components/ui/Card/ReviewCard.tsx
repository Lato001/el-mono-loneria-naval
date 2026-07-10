import type { Review } from "../../../types/review";

const STARS = [0, 1, 2, 3, 4];

export function ReviewCard({
  avatar,
  title,
  author,
  stars,
  description,
}: Review) {
  const initial = author.charAt(0).toUpperCase();

  return (
    <article className="mx-auto flex h-full max-w-md flex-col overflow-hidden rounded-xl border border-sc-ocean-blue/15 bg-white transition-all duration-200 ease-out hover:-translate-y-1.5 hover:shadow-xl md:mx-0 md:max-w-none">
      <div className="flex items-center gap-5 border-b border-sc-ocean-blue/10 px-6 py-5 md:px-8 md:py-6">
        {avatar ? (
          <img
            src={avatar}
            alt={author}
            className="h-16 w-16 rounded-full object-cover"
          />
        ) : (
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-sc-ocean-blue text-xl font-bold text-white">
            {initial}
          </div>
        )}

        <div className="flex flex-col">
          <span className="font-poppins text-lg font-semibold text-sc-ocean-blue">
            {author}
          </span>
          <div className="flex items-center gap-1">
            {STARS.map((i) => (
              <span
                key={i}
                className={`text-xl md:text-2xl ${i < stars ? "text-pr-aquamarine" : "text-pr-aquamarine/20"}`}
              >
                ★
              </span>
            ))}
          </div>
        </div>
      </div>

      <div className="flex flex-1 flex-col justify-between p-6 md:p-8">
        <div>
          <h3 className="mb-3 text-xl font-bold text-sc-ocean-blue uppercase md:text-2xl">
            {title}
          </h3>

          <p className="text-base leading-relaxed text-sc-ocean-blue/70 md:text-lg">
            {description}
          </p>
        </div>

        <div className="border-t-2 border-dashed border-sc-ocean-blue/25" />
      </div>
    </article>
  );
}
