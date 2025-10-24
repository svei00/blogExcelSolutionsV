import { Link } from "react-router-dom";
import PropTypes from "prop-types";
import { categoryLabel } from "../config/categories";

// Chrome stays flat, content floats (REBUILD_PLAN 6b) - no per-card
// border, shadow, or rounded corners here. The hairline grid/divider
// lines that give the index its structure live on the PARENT container
// (Home.jsx/Search.jsx apply divide-x/divide-y + a border), not per
// card - that stays correct at any column count instead of a brittle
// border-right-on-every-cell trick that breaks the moment a row wraps
// differently at a different breakpoint.
export default function PostCard({ post, variant = "row" }) {
  const category = categoryLabel(post.category);

  // Never falls back to createdAt/updatedAt when unset (REBUILD_PLAN
  // 6b.2) - a card with no reviewedAt shows no date at all rather than
  // claiming a freshness it hasn't earned.
  const reviewed = post.reviewedAt
    ? new Date(post.reviewedAt).toLocaleDateString(undefined, {
        year: "numeric",
        month: "short",
      })
    : null;

  const categoryTag = (
    <div className="font-mono text-[11px] uppercase tracking-wide text-primaryText dark:text-primary">
      {category}
    </div>
  );

  const meta = (
    <div className="mt-1.5 flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
      <span>{post.readingMinutes} min</span>
      {reviewed && <span>&middot; Reviewed {reviewed}</span>}
    </div>
  );

  // No excerpt on the card by design (REBUILD_PLAN 6b.3) - titles here
  // are already descriptive ("Actualizador Dinámico de Impuestos.
  // Parte 2: Método Alternativo..."), so a two-line excerpt under a
  // two-line title would be redundancy, not information.
  //
  // Hover = surface tint + inset accent edge, like a selected cell in
  // Excel - never resize or animate anything. The prior card animated
  // image height on hover, forcing a layout reflow every frame.
  const hoverClasses =
    "transition-colors hover:bg-gray-50 dark:hover:bg-gray-800 hover:shadow-[inset_2px_0_0_theme(colors.secondary)]";

  if (variant === "grid") {
    return (
      <Link to={`/post/${post.slug}`} className={`group block p-4 ${hoverClasses}`}>
        <article>
          <div className="mb-3 aspect-video overflow-hidden bg-gray-100 dark:bg-gray-800">
            <img
              src={post.image}
              alt={post.imageAlt || post.title}
              loading="lazy"
              className="h-full w-full object-cover"
            />
          </div>
          <div className="mb-2">{categoryTag}</div>
          <h3 className="line-clamp-2 text-base font-medium leading-snug">
            {post.title}
          </h3>
          {meta}
        </article>
      </Link>
    );
  }

  return (
    <Link
      to={`/post/${post.slug}`}
      className={`group flex items-center gap-4 px-2 py-3 ${hoverClasses}`}
    >
      <article className="flex w-full min-w-0 items-center gap-4">
        <div className="aspect-[4/3] w-24 flex-shrink-0 overflow-hidden bg-gray-100 dark:bg-gray-800 sm:w-28">
          <img
            src={post.image}
            alt={post.imageAlt || post.title}
            loading="lazy"
            className="h-full w-full object-cover"
          />
        </div>
        <div className="min-w-0">
          {categoryTag}
          <h3 className="mt-1 line-clamp-2 text-base font-medium leading-snug">
            {post.title}
          </h3>
          {meta}
        </div>
      </article>
    </Link>
  );
}

PostCard.propTypes = {
  post: PropTypes.shape({
    slug: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    image: PropTypes.string,
    imageAlt: PropTypes.string,
    category: PropTypes.string,
    readingMinutes: PropTypes.number,
    reviewedAt: PropTypes.string,
  }).isRequired,
  variant: PropTypes.oneOf(["row", "grid"]),
};
