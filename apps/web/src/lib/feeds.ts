import { and, asc, desc, eq, or, sql } from "drizzle-orm";
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

export type FeedSort = "newest" | "oldest";

export interface PublicFeedsQuery {
	search?: string;
	tag?: string;
	sort?: FeedSort;
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

export async function getPublicFeedsData(
	page = 0,
	query: PublicFeedsQuery = {},
): Promise<{
	items: PublicFeed[];
	hasMore: boolean;
	tags: string[];
}> {
	const search = query.search?.trim().toLowerCase();
	const conditions = [eq(feeds.draft, 0)];

	if (query.tag) {
		conditions.push(eq(feeds.tag, query.tag));
	}

	if (search) {
		conditions.push(
			or(
				sql`instr(lower(${feeds.tag}), ${search}) > 0`,
				sql`instr(lower(${feeds.content}), ${search}) > 0`,
			)!,
		);
	}

	const [rows, tagRows] = await Promise.all([
		client
			.select()
			.from(feeds)
			.where(and(...conditions))
			.orderBy(query.sort === "oldest" ? asc(feeds.createdAt) : desc(feeds.createdAt))
			.limit(FEEDS_PAGE_SIZE + 1)
			.offset(page * FEEDS_PAGE_SIZE),
		client
			.select({ tag: feeds.tag })
			.from(feeds)
			.where(eq(feeds.draft, 0))
			.groupBy(feeds.tag)
			.orderBy(asc(feeds.tag)),
	]);

	const hasMore = rows.length > FEEDS_PAGE_SIZE;
	const items = (hasMore ? rows.slice(0, FEEDS_PAGE_SIZE) : rows).map((feed) => ({
		id: feed.id,
		tag: feed.tag,
		content: sanitizeContent(feed.content),
		createdAt: toISO(feed.createdAt),
	}));

	return { items, hasMore, tags: tagRows.map((row) => row.tag) };
}
