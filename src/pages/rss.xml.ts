import rss from "@astrojs/rss";
import { getAllUpdates } from "../lib/content";
import { SITE_URL, SITE_TITLE, SITE_DESCRIPTION } from "../constants";

export async function GET(context: { site: URL }) {
	const updates = await getAllUpdates();

	return rss({
		title: `${SITE_TITLE} — Updates`,
		description: SITE_DESCRIPTION,
		site: context.site,
		items: updates.map((update) => ({
			title: update.data.title,
			pubDate: update.data.date,
			description: update.data.summary,
			link: `/updates/${update.id}/`,
		})),
		customData: `<language>en-us</language>`,
	});
}
