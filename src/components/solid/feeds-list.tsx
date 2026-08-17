import { actions } from "astro:actions";
import { createSignal, For, onCleanup, onMount, Show } from "solid-js";
import type { PublicFeed } from "@/lib/feeds";
import { formatDate } from "@/lib/utils";

export function FeedsList(props: { initialItems: PublicFeed[]; initialHasMore: boolean }) {
	const [items, setItems] = createSignal<PublicFeed[]>(props.initialItems);
	const [hasMore, setHasMore] = createSignal(props.initialHasMore);
	const [loading, setLoading] = createSignal(false);
	const [page, setPage] = createSignal(0);
	let sentinel: HTMLDivElement | undefined;

	const loadMore = async () => {
		if (loading() || !hasMore()) return;

		setLoading(true);

		const next = page() + 1;
		const { data, error } = await actions.getPublicFeeds({ page: next });

		if (!error && data) {
			setItems((prev) => [...prev, ...data.items]);
			setHasMore(data.hasMore);
			setPage(next);
		}

		setLoading(false);
	};

	onMount(() => {
		const observer = new IntersectionObserver(
			(entries) => {
				if (entries[0].isIntersecting) {
					loadMore();
				}
			},
			{ rootMargin: "200px" }
		);

		if (sentinel) {
			observer.observe(sentinel);
		}

		onCleanup(() => observer.disconnect());
	});

	return (
		<div class="flex flex-col">
			<Show
				when={items().length > 0}
				fallback={
					<div class="py-24 flex flex-col items-center text-center gap-3">
						<p class="font-serif text-4xl text-foreground">Quiet for now.</p>
						<p class="text-foreground/80 max-w-sm">Nothing has been posted yet. Check back soon.</p>
					</div>
				}
			>
				<For each={items()}>
					{(feed) => (
						<article class="border-b border-border py-8 first:pt-0 last:border-b-0">
							<div class="flex items-center gap-4 mb-3">
								<span class="font-mono text-xs uppercase tracking-widest text-foreground/50">
									{formatDate(new Date(feed.createdAt))}
								</span>
								<span class="font-mono text-xxs uppercase tracking-widest border border-border px-2 py-0.5 text-foreground/60">
									{feed.tag}
								</span>
							</div>
							<div class="prose prose-sm dark:prose-invert max-w-2xl" innerHTML={feed.content} />
						</article>
					)}
				</For>

				<Show when={hasMore()}>
					<div ref={sentinel} class="py-8 flex justify-center">
						<Show when={loading()}>
							<span class="font-mono text-xs uppercase tracking-widest text-foreground/40">
								Loading...
							</span>
						</Show>
					</div>
				</Show>
			</Show>
		</div>
	);
}
