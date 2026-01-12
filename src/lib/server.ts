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

export const DEV_ASSETS_PATHS = [
  "/node_modules/",
  "/src/",
  "/.content-collections/",
  "/@vite/",
  "/@tanstack-start/",
];

export function isDevAssetsRoutes(
  path: string,
  paths: string | string[] = DEV_ASSETS_PATHS,
) {
  if (Array.isArray(paths)) {
    return paths.some((p) => path.startsWith(p));
  }

  return [...DEV_ASSETS_PATHS, paths].some((p) => path.startsWith(p));
}
