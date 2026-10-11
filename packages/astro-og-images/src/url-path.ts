export function normalizeBasePath(base: string) {
	return new URL(base, "https://og-image.invalid").pathname;
}
