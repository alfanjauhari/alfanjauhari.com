import { desc, eq } from "drizzle-orm";
import sanitizeHtml from "sanitize-html";
import { client } from "../db/client";
import { feeds } from "../db/schemas/feeds";

export const FEEDS_PAGE_SIZE = 10;

export interface PublicFeed {
	id: string;
	tag: string;
	content: string;
	createdAt: string;
}

const toISO = (seconds: number) => new Date(seconds * 1000).toISOString();

const sanitizeContent = (html: string) =>
	sanitizeHtml(html, {
		allowedTags: [
			"p",
			"div",
			"a",
			"b",
			"strong",
			"i",
			"em",
			"u",
			"s",
			"strike",
			"blockquote",
			"br",
		],
		allowedAttributes: {
			a: ["href", "target", "rel"],
		},
	});

export async function getPublicFeedsData(page = 0): Promise<{
	items: PublicFeed[];
	hasMore: boolean;
}> {
	const rows = await client
		.select()
		.from(feeds)
		.where(eq(feeds.draft, 0))
		.orderBy(desc(feeds.createdAt))
		.limit(FEEDS_PAGE_SIZE + 1)
		.offset(page * FEEDS_PAGE_SIZE);

	const hasMore = rows.length > FEEDS_PAGE_SIZE;
	const items = (hasMore ? rows.slice(0, FEEDS_PAGE_SIZE) : rows).map((feed) => ({
		id: feed.id,
		tag: feed.tag,
		content: sanitizeContent(feed.content),
		createdAt: toISO(feed.createdAt),
	}));

	return { items, hasMore };
}
