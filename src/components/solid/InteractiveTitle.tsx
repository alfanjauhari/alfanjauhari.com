import { BanIcon, MousePointer2Icon } from "lucide-solid";
import { createSignal, onCleanup, onMount } from "solid-js";

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

			ref.style.setProperty("--rx", `${current.y * -40}deg`);
			ref.style.setProperty("--ry", `${current.x * 40}deg`);

			raf = requestAnimationFrame(animate);
		};

		document.addEventListener("mousemove", onMove, { passive: true });
		raf = requestAnimationFrame(animate);

		onCleanup(() => {
			document.removeEventListener("mousemove", onMove);
			if (raf) cancelAnimationFrame(raf);
		});
	});

	return (
		<div class="relative w-full">
			<button
				class="absolute -top-12 left-0 z-20 flex items-center gap-2 text-xs font-mono uppercase tracking-widest cursor-pointer text-foreground hover:text-accent-foreground transition-colors"
				onClick={() => setEnabled((v) => !v)}
				type="button"
			>
				{enabled() ? <MousePointer2Icon class="size-4" /> : <BanIcon class="size-4" />}
				{enabled() ? "Motion On" : "Motion Off"}
			</button>

			<div class="relative flex justify-center items-center py-4" style={{ perspective: "2000px" }}>
				<div
					ref={ref}
					style={{
						"will-change": "transform",
						"transform-style": "preserve-3d",
						transform: enabled()
							? "rotateX(var(--rx)) rotateY(var(--ry))"
							: "rotateX(0deg) rotateY(0deg)",
						transition: enabled() ? "none" : "transform 0.3s ease",
					}}
				>
					<h1
						class="select-none font-serif text-[24vw] lg:text-[18vw] leading-[0.8] tracking-tighter"
						aria-label="Alfan Jauhari"
					>
						<div aria-hidden="true">
							Alfan <br />
							<span class="ml-[4vw] md:ml-[8vw] italic font-light">Jauhari</span>
						</div>
					</h1>

					{enabled() && (
						<h1
							class="absolute inset-0 -z-10 select-none font-serif text-[24vw] lg:text-[18vw] leading-[0.8] tracking-tighter"
							aria-label="Alfan Jauhari"
						>
							<div aria-hidden="true">
								Alfan <br />
								<span class="ml-[4vw] md:ml-[8vw] italic font-light">Jauhari</span>
							</div>
						</h1>
					)}
				</div>
			</div>
		</div>
	);
}
