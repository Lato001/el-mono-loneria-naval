import type { Review } from "../../../types/review";
import { IconStarFilled } from "@tabler/icons-react";
const STARS = [0, 1, 2, 3, 4];

export function ReviewCard({ avatar, title, author, description }: Review) {
  const initial = author.charAt(0).toUpperCase();

  return (
    <article className="mx-auto flex h-full max-w-4xl flex-col overflow-hidden rounded-xl border border-sc-ocean-blue/15 bg-white transition-all duration-200 ease-out hover:-translate-y-1.5 hover:shadow-xl md:mx-0 md:max-w-none">
      <div className="flex items-center gap-4 border-b border-sc-ocean-blue/10 px-6 py-5 md:gap-5 md:px-8 md:py-6">
        {avatar ? (
          <img
            src={avatar}
            alt={author}
            loading="lazy"
            className="h-14 w-14 rounded-full object-cover md:h-16 md:w-16"
          />
        ) : (
          <div className="flex h-14 w-14 items-center justify-center rounded-full bg-sc-ocean-blue text-lg font-bold text-white md:h-16 md:w-16 md:text-xl">
            {initial}
          </div>
        )}

        <div className="flex flex-col">
          <span className="font-poppins text-xl font-semibold text-sc-ocean-blue">
            {author}
          </span>
          <div className="flex items-center gap-1">
            {STARS.map((i) => (
              <span key={i} className={"text-amber-300"}>
                <IconStarFilled />
              </span>
            ))}
          </div>
        </div>
      </div>

      <div className="flex flex-1 flex-col justify-between p-6 md:p-8">
        <div>
          <h3 className="mb-3 text-xl font-poppins font-semibold text-sc-ocean-blue uppercase">
            {title}
          </h3>

          <p className="font-poppins font-medium text-lg  text-sc-ocean-blue/70 md:text-lg">
            {description}
          </p>
        </div>
      </div>
    </article>
  );
}
