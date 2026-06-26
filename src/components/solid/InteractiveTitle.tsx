import { createSignal, onMount } from "solid-js";

export default function InteractiveTitle() {
	const [enabled, setEnabled] = createSignal(true);
	let ref!: HTMLDivElement;
	let raf: number | null = null;
	const target = { x: 0, y: 0 };
	const current = { x: 0, y: 0 };

	onMount(() => {
		if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
			setEnabled(false);
			return;
		}

		const onMove = (e: MouseEvent) => {
			target.x = e.clientX / window.innerWidth - 0.5;
			target.y = e.clientY / window.innerHeight - 0.5;
		};

		const animate = () => {
			current.x += (target.x - current.x) * 0.08;
			current.y += (target.y - current.y) * 0.08;

			const rx = current.y * -40;
			const ry = current.x * 40;

			ref.style.setProperty("--rx", `${rx}deg`);
			ref.style.setProperty("--ry", `${ry}deg`);

			raf = requestAnimationFrame(animate);
		};

		window.addEventListener("mousemove", onMove);
		raf = requestAnimationFrame(animate);

		return () => {
			window.removeEventListener("mousemove", onMove);
			if (raf) cancelAnimationFrame(raf);
		};
	});

	return (
		<div class="relative block w-full">
			<button
				class="absolute -top-12 left-0 z-20 flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-foreground hover:text-accent-foreground"
				onClick={() => setEnabled((v) => !v)}
				type="button"
			>
				{enabled() ? (
					<svg
						xmlns="http://www.w3.org/2000/svg"
						width="16"
						height="16"
						viewBox="0 0 24 24"
						fill="none"
						stroke="currentColor"
						stroke-width="2"
						stroke-linecap="round"
						stroke-linejoin="round"
						class="size-4"
					>
						<path d="m3 3 7.07 16.97 2.51-7.39 7.39-2.51L3 3z" />
						<path d="m13 13 6 6" />
					</svg>
				) : (
					<svg
						xmlns="http://www.w3.org/2000/svg"
						width="16"
						height="16"
						viewBox="0 0 24 24"
						fill="none"
						stroke="currentColor"
						stroke-width="2"
						stroke-linecap="round"
						stroke-linejoin="round"
						class="size-4"
					>
						<circle cx="12" cy="12" r="10" />
						<path d="m4.9 4.9 14.2 14.2" />
					</svg>
				)}
				{enabled() ? "Motion On" : "Motion Off"}
			</button>

			<div class="relative flex justify-center py-4 perspective-[2000px]">
				<div
					ref={ref}
					class="relative transform-gpu preserve-3d motion-safe:transition-transform motion-safe:duration-300 motion-safe:ease-out"
					style={{
						transform: enabled()
							? "rotateX(var(--rx)) rotateY(var(--ry))"
							: "rotateX(0deg) rotateY(0deg)",
					}}
				>
					{enabled() ? (
						<>
							<p class="invisible select-none font-serif text-[24vw] lg:text-[18vw] leading-[0.8] tracking-tighter">
								Alfan <br />
								<span class="ml-[4vw] md:ml-[8vw] italic font-light">
									Jauhari
								</span>
							</p>

							<h1 class="absolute inset-0 -z-10 select-none font-serif text-[24vw] lg:text-[18vw] leading-[0.8] tracking-tighter">
								Alfan <br />
								<span class="ml-[4vw] md:ml-[8vw] italic font-light">
									Jauhari
								</span>
							</h1>
						</>
					) : (
						<h1 class="select-none font-serif text-[24vw] lg:text-[18vw] leading-[0.8] tracking-tighter">
							Alfan <br />
							<span class="ml-[4vw] md:ml-[8vw] italic font-light">
								Jauhari
							</span>
						</h1>
					)}
				</div>
			</div>
		</div>
	);
}
