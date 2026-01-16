// Deliberately duplicated from client/src/config/site.js, not imported
// from it. api/ and client/ are two independent deployable units - the
// client file could start using import.meta.env (a Vite-only transform)
// at any point, which would break instantly if required directly by
// plain Node here. Keep both files in sync by hand; it's two lines.
export const SITE_URL = "https://excelsolutionsv.com";
export const SITE_NAME = "Excel SolutionsV Blog";

// Used by the BlogPosting JSON-LD's `author` (REBUILD_PLAN 11.B.3) -
// `sameAs` is the real E-E-A-T signal: it lets Google connect this
// content to a credentialed, real-world identity instead of an
// anonymous "Organization" byline, which is what every post's JSON-LD
// used before this. Real URLs, matching Footer.jsx's social links.
export const AUTHOR_NAME = "Ivan E. Villanueva";
export const AUTHOR_SAME_AS = [
  "https://www.linkedin.com/in/ivan-e-villanueva-26253157/",
  "https://www.github.com/svei00",
];
