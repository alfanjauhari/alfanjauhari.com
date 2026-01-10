export const STATIC_PATHS = [
  "/assets/",
  "/fonts/",
  "/sitemap.xml",
  "/sitemap.webmanifest",
];

export function isStaticRoutes(
  path: string,
  paths: string | string[] = STATIC_PATHS,
) {
  if (Array.isArray(paths)) {
    return paths.some((p) => path.startsWith(p));
  }

  return [...STATIC_PATHS, paths].some((p) => path.startsWith(p));
}
