import type { Review } from "../../../types/review";
import { ReviewCard } from "../Card";
import { data } from "../../../mocks/data";

const reviewImageGlob = import.meta.glob("../../../assets/img/review-profiles/*", {
  eager: true,
  import: "default",
}) as Record<string, string>;

const reviewImageMap: Record<string, string> = Object.fromEntries(
  Object.entries(reviewImageGlob).map(([path, url]) => [
    path.split("/").pop()!.replace(/\.[^.]+$/, ""),
    url,
  ]),
);

const avatarKeyByReviewId: Record<string, string> = {
  r1: "review-01",
  r2: "review-02",
  r3: "review-03",
};

const reviews = data.Home.Reviews.map((r) => ({
  ...r,
  avatar: reviewImageMap[avatarKeyByReviewId[r.id]] ?? "",
}));

export function SplitReviews() {
  return (
    <div className="grid grid-cols-1 gap-6 md:grid-cols-3 md:gap-8">
      {reviews.slice(0, 3).map((r: Review) => (
        <ReviewCard key={r.id} {...r} />
      ))}
    </div>
  );
}
