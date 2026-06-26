import { getCollection } from "astro:content";

export async function getAllUpdates() {
	const updates = await getCollection("updates");
	return updates
		.filter((u) => !u.data.draft)
		.sort((a, b) => b.data.date.getTime() - a.data.date.getTime());
}

export async function getUpdateBySlug(slug: string) {
	const updates = await getCollection("updates");
	return updates.find((u) => u.id === slug);
}

export async function getAllWorks() {
	const works = await getCollection("works");
	return works.sort((a, b) => b.data.year - a.data.year);
}

export async function getWorkBySlug(slug: string) {
	const works = await getCollection("works");
	return works.find((w) => w.id === slug);
}

export async function getAllSnippets() {
	const snippets = await getCollection("snippets");
	return snippets;
}

export async function getSnippetBySlug(slug: string) {
	const snippets = await getCollection("snippets");
	return snippets.find((s) => s.id === slug);
}
