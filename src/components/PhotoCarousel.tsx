import { useCallback, useEffect, useRef, useState } from "react";

export type Photo = {
	src: string;
	alt: string;
	caption: string;
	width: number;
	height: number;
};

/**
 * Evidence gallery.
 *
 * Built on native CSS scroll-snap rather than a carousel library: the browser already
 * gives touch swiping, momentum, keyboard arrow scrolling and reduced-motion handling
 * for free. The buttons and dots only drive `scrollTo`, so if the script never runs the
 * strip is still a perfectly usable scroller.
 *
 * The frame is 3:2 rather than 16:9 because the set mixes landscape and portrait
 * originals, and a wider frame would crop the portrait shots to roughly 40% of their
 * height.
 */
export function PhotoCarousel({
	photos,
	label,
	prevLabel,
	nextLabel,
}: {
	photos: Photo[];
	label: string;
	prevLabel: string;
	nextLabel: string;
}) {
	const track = useRef<HTMLDivElement>(null);
	const [index, setIndex] = useState(0);

	const goTo = useCallback((i: number) => {
		const el = track.current;
		if (!el) return;
		el.scrollTo({ left: i * el.clientWidth, behavior: "smooth" });
	}, []);

	useEffect(() => {
		const el = track.current;
		if (!el) return;
		// Derive the active slide from scroll position, so dragging, swiping and the
		// buttons all stay in sync without duplicating state.
		const onScroll = () => {
			setIndex(Math.round(el.scrollLeft / el.clientWidth));
		};
		el.addEventListener("scroll", onScroll, { passive: true });
		return () => el.removeEventListener("scroll", onScroll);
	}, []);

	const step = (delta: number) =>
		goTo(Math.min(photos.length - 1, Math.max(0, index + delta)));

	return (
		<section aria-label={label} className="relative">
			{/* Focusable on purpose. A scrollable region must be keyboard operable
			    (WCAG 2.1.1) and Chrome, unlike Firefox, does not focus overflow
			    containers automatically. The outer <section aria-label> already names it,
			    so no extra role is wanted here. */}
			<div
				ref={track}
				// biome-ignore lint/a11y/noNoninteractiveTabindex: scrollable region must be keyboard operable
				tabIndex={0}
				className="flex snap-x snap-mandatory overflow-x-auto overflow-y-hidden rounded-2xl [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
			>
				{photos.map((photo) => (
					<figure key={photo.src} className="w-full shrink-0 snap-center">
						<img
							src={photo.src}
							alt={photo.alt}
							width={photo.width}
							height={photo.height}
							loading="lazy"
							decoding="async"
							className="aspect-[3/2] w-full bg-azul-50 object-cover"
						/>
					</figure>
				))}
			</div>

			<div className="mt-3 flex items-start justify-between gap-6">
				<p className="text-abismo-800/60 text-sm">{photos[index]?.caption}</p>

				<div className="flex shrink-0 items-center gap-2">
					{photos.map((photo, i) => (
						<button
							key={photo.src}
							type="button"
							onClick={() => goTo(i)}
							aria-label={`${label} ${i + 1}`}
							aria-current={i === index}
							className={`h-1.5 rounded-full transition-all duration-300 ${
								i === index
									? "w-6 bg-abismo-900"
									: "w-1.5 bg-abismo-900/25 hover:bg-abismo-900/50"
							}`}
						/>
					))}
					<div className="ml-2 flex gap-1.5">
						<button
							type="button"
							onClick={() => step(-1)}
							disabled={index === 0}
							aria-label={prevLabel}
							className="grid h-8 w-8 place-content-center rounded-full border border-abismo-900/15 transition-colors hover:border-abismo-900 disabled:opacity-30 disabled:hover:border-abismo-900/15"
						>
							<svg
								viewBox="0 0 24 24"
								fill="none"
								stroke="currentColor"
								strokeWidth={1.8}
								strokeLinecap="round"
								strokeLinejoin="round"
								aria-hidden="true"
								className="h-4 w-4"
							>
								<path d="m14 6-6 6 6 6" />
							</svg>
						</button>
						<button
							type="button"
							onClick={() => step(1)}
							disabled={index === photos.length - 1}
							aria-label={nextLabel}
							className="grid h-8 w-8 place-content-center rounded-full border border-abismo-900/15 transition-colors hover:border-abismo-900 disabled:opacity-30 disabled:hover:border-abismo-900/15"
						>
							<svg
								viewBox="0 0 24 24"
								fill="none"
								stroke="currentColor"
								strokeWidth={1.8}
								strokeLinecap="round"
								strokeLinejoin="round"
								aria-hidden="true"
								className="h-4 w-4"
							>
								<path d="m10 6 6 6-6 6" />
							</svg>
						</button>
					</div>
				</div>
			</div>
		</section>
	);
}
