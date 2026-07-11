import type { Review } from "../../../types/review";
import { ReviewCard } from "../Card";
import { data } from "../../../mocks/data";

const reviews = data.Home.Reviews;
export function SplitReviews() {
  return (
    <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
      {reviews.slice(0, 3).map((r: Review) => (
        <ReviewCard key={r.id} {...r} />
      ))}
    </div>
  );
}
