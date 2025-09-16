// Deliberately duplicated from client/src/config/site.js, not imported
// from it. api/ and client/ are two independent deployable units - the
// client file could start using import.meta.env (a Vite-only transform)
// at any point, which would break instantly if required directly by
// plain Node here. Keep both files in sync by hand; it's two lines.
export const SITE_URL = "https://excelsolutionsv.com";
export const SITE_NAME = "Excel SolutionsV Blog";
