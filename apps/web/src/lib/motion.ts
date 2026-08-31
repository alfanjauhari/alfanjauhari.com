const REDUCED_MOTION_QUERY = "(prefers-reduced-motion: reduce)";
const FINE_POINTER_QUERY = "(hover: hover) and (pointer: fine)";

interface TiltState {
	currentX: number;
	currentY: number;
	targetX: number;
	targetY: number;
	raf: number | null;
}

function setTiltProperties(element: HTMLElement, x: number, y: number) {
	const maximumTilt = Number(element.dataset.tiltMax ?? 4);
	const parallax = Number(element.dataset.tiltParallax ?? 10);

	element.style.setProperty("--tilt-x", `${y * -maximumTilt}deg`);
	element.style.setProperty("--tilt-y", `${x * maximumTilt}deg`);
	element.style.setProperty("--parallax-x", `${x * parallax}px`);
	element.style.setProperty("--parallax-y", `${y * parallax}px`);
	element.style.setProperty("--parallax-x-soft", `${x * parallax * 0.35}px`);
	element.style.setProperty("--parallax-y-soft", `${y * parallax * 0.35}px`);
	element.style.setProperty("--pointer-x", `${(x + 1) * 50}%`);
	element.style.setProperty("--pointer-y", `${(y + 1) * 50}%`);
}

function setupPointerTilt(element: HTMLElement) {
	const state: TiltState = {
		currentX: 0,
		currentY: 0,
		targetX: 0,
		targetY: 0,
		raf: null,
	};

	const animate = () => {
		state.currentX += (state.targetX - state.currentX) * 0.14;
		state.currentY += (state.targetY - state.currentY) * 0.14;
		setTiltProperties(element, state.currentX, state.currentY);

		const moving =
			Math.abs(state.targetX - state.currentX) > 0.001 ||
			Math.abs(state.targetY - state.currentY) > 0.001;

		if (moving) {
			state.raf = requestAnimationFrame(animate);
		} else {
			state.raf = null;
		}
	};

	const requestTick = () => {
		if (state.raf === null) state.raf = requestAnimationFrame(animate);
	};

	const onPointerMove = (event: PointerEvent) => {
		const rect = element.getBoundingClientRect();
		state.targetX = ((event.clientX - rect.left) / rect.width) * 2 - 1;
		state.targetY = ((event.clientY - rect.top) / rect.height) * 2 - 1;
		element.dataset.tiltActive = "true";
		requestTick();
	};

	const onPointerLeave = () => {
		state.targetX = 0;
		state.targetY = 0;
		delete element.dataset.tiltActive;
		requestTick();
	};

	setTiltProperties(element, 0, 0);
	element.addEventListener("pointermove", onPointerMove, { passive: true });
	element.addEventListener("pointerleave", onPointerLeave, { passive: true });

	return () => {
		element.removeEventListener("pointermove", onPointerMove);
		element.removeEventListener("pointerleave", onPointerLeave);
		if (state.raf !== null) cancelAnimationFrame(state.raf);
	};
}

function setupRevealGroup(element: HTMLElement) {
	const observer = new IntersectionObserver(
		([entry]) => {
			if (!entry?.isIntersecting) return;
			element.dataset.motionVisible = "true";
			observer.disconnect();
		},
		{ rootMargin: "0px 0px -10%", threshold: 0.18 },
	);

	observer.observe(element);
	return () => observer.disconnect();
}

function setupTimeline(element: HTMLElement) {
	const entries = Array.from(element.querySelectorAll<HTMLElement>("[data-timeline-entry]"));
	let raf: number | null = null;

	const update = () => {
		const rect = element.getBoundingClientRect();
		const startLine = window.innerHeight * 0.75;
		const endLine = window.innerHeight * 0.35;
		const range = rect.height + startLine - endLine;
		const progress = Math.min(1, Math.max(0, (startLine - rect.top) / range));

		element.style.setProperty("--timeline-progress", progress.toFixed(3));

		for (const entry of entries) {
			const entryRect = entry.getBoundingClientRect();
			if (entryRect.top + entryRect.height * 0.35 <= startLine) {
				entry.dataset.timelineActive = "true";
			}
		}

		raf = null;
	};

	const requestUpdate = () => {
		if (raf === null) raf = requestAnimationFrame(update);
	};

	window.addEventListener("scroll", requestUpdate, { passive: true });
	window.addEventListener("resize", requestUpdate, { passive: true });
	requestUpdate();

	return () => {
		window.removeEventListener("scroll", requestUpdate);
		window.removeEventListener("resize", requestUpdate);
		if (raf !== null) cancelAnimationFrame(raf);
	};
}

export function initializeFooterWordmark(root: ParentNode = document) {
	const panel = root.querySelector<HTMLElement>("[data-page-panel]");
	const footer = root.querySelector<HTMLElement>("[data-footer]");
	const wordmark = root.querySelector<HTMLElement>("[data-footer-wordmark]");

	if (!panel || !footer || !wordmark) return () => undefined;

	if (window.matchMedia(REDUCED_MOTION_QUERY).matches) {
		wordmark.dataset.wordmarkVisible = "true";
		return () => undefined;
	}

	let raf: number | null = null;
	let revealed = false;

	const update = () => {
		const exposedFooter = Math.max(0, window.innerHeight - panel.getBoundingClientRect().bottom);
		const revealPoint = Math.min(120, footer.offsetHeight * 0.2);

		if (exposedFooter >= revealPoint) {
			wordmark.dataset.wordmarkVisible = "true";
			revealed = true;
			window.removeEventListener("scroll", requestUpdate);
			window.removeEventListener("resize", requestUpdate);
		}

		raf = null;
	};

	const requestUpdate = () => {
		if (raf === null && !revealed) raf = requestAnimationFrame(update);
	};

	window.addEventListener("scroll", requestUpdate, { passive: true });
	window.addEventListener("resize", requestUpdate, { passive: true });
	requestUpdate();

	return () => {
		window.removeEventListener("scroll", requestUpdate);
		window.removeEventListener("resize", requestUpdate);
		if (raf !== null) cancelAnimationFrame(raf);
	};
}

export function initializeMotion(root: ParentNode = document) {
	const reducedMotion = window.matchMedia(REDUCED_MOTION_QUERY).matches;
	const finePointer = window.matchMedia(FINE_POINTER_QUERY).matches;
	const cleanup: Array<() => void> = [];

	if (reducedMotion) {
		for (const element of root.querySelectorAll<HTMLElement>("[data-motion-reveal]")) {
			element.dataset.motionVisible = "true";
		}
		for (const timeline of root.querySelectorAll<HTMLElement>("[data-timeline]")) {
			timeline.style.setProperty("--timeline-progress", "1");
			for (const entry of timeline.querySelectorAll<HTMLElement>("[data-timeline-entry]")) {
				entry.dataset.timelineActive = "true";
			}
		}
		return () => undefined;
	}

	document.documentElement.dataset.motionReady = "true";

	if (finePointer) {
		for (const element of root.querySelectorAll<HTMLElement>("[data-pointer-tilt]")) {
			cleanup.push(setupPointerTilt(element));
		}
	}

	for (const element of root.querySelectorAll<HTMLElement>("[data-motion-reveal]")) {
		cleanup.push(setupRevealGroup(element));
	}

	for (const timeline of root.querySelectorAll<HTMLElement>("[data-timeline]")) {
		cleanup.push(setupTimeline(timeline));
	}

	return () => {
		for (const callback of cleanup) callback();
	};
}
