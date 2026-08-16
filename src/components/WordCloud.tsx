import { useCallback, useLayoutEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { CLOUD } from "../data/cloud";
import { useLocaleStore, useT } from "../i18n";

const SIZE = {
	4: "font-display text-[clamp(1.4rem,3.2vw,2.4rem)]",
	3: "font-display text-[clamp(1.1rem,2.2vw,1.6rem)]",
	2: "text-base sm:text-lg",
	1: "text-sm",
} as const;

const TONE = [
	"text-abismo-900",
	"text-azul-700",
	"text-verde-800",
	"text-abismo-800/70",
	"text-azul-800",
] as const;

const GAP = 2; // px kept between boxes; this is the "no space" knob
const STEP = 0.08; // radians per spiral probe; finer finds tighter slots
const GROWTH = 3.5; // px of radius per radian
const SQUASH = 0.3; // <1 makes the cloud wider than it is tall

type Box = {
	el: HTMLElement;
	w: number;
	h: number;
	x: number;
	y: number;
	weight: number;
	vertical: boolean;
};

const overlaps = (a: Box, b: Box) =>
	a.x < b.x + b.w + GAP &&
	a.x + a.w + GAP > b.x &&
	a.y < b.y + b.h + GAP &&
	a.y + a.h + GAP > b.y;

/**
 * Real word-cloud packing rather than a wrapped list: each word is measured, then
 * placed at the first point along an Archimedean spiral where its box hits nothing
 * already placed. Heaviest words go first so they take the centre, vertical words go
 * before horizontal ones of the same weight, and the small words fill the leftovers.
 *
 * Deterministic: no randomness anywhere, so the same words always produce the same
 * cloud and it never reshuffles between renders.
 */
export function WordCloud() {
	const t = useT();
	const locale = useLocaleStore((s) => s.locale);
	const root = useRef<HTMLDivElement>(null);
	const [height, setHeight] = useState(0);
	const [ready, setReady] = useState(false);

	const pack = useCallback(() => {
		const container = root.current;
		if (!container) return;
		const width = container.clientWidth;
		if (!width) return;

		const nodes = Array.from(
			container.querySelectorAll<HTMLElement>("[data-cloud-item]"),
		);
		if (nodes.length === 0) return;

		// Measure at natural size. Clearing the transform first stops a previous pack
		// from being baked into the next measurement on resize or language change.
		const boxes: Box[] = nodes.map((el) => {
			el.style.transform = "";
			const r = el.getBoundingClientRect();
			return {
				el,
				w: r.width,
				h: r.height,
				x: 0,
				y: 0,
				weight: Number(el.dataset.weight ?? 1),
				vertical: el.dataset.axis === "y",
			};
		});

		const placed: Box[] = [];
		// Order matters more than the spiral itself. By visual weight first, so the
		// headline words claim the middle; then vertical words ahead of horizontal ones
		// at the same weight, because a tall narrow box left until late can only land on
		// the fringe, which is what made the vertical words look tacked on.
		const order = [...boxes].sort(
			(a, b) =>
				b.weight - a.weight ||
				Number(b.vertical) - Number(a.vertical) ||
				b.w * b.h - a.w * a.h,
		);

		for (const box of order) {
			const cx = width / 2;
			let done = false;

			for (let theta = 0; theta < 900; theta += STEP) {
				const radius = GROWTH * theta;
				box.x = cx + radius * Math.cos(theta) - box.w / 2;
				box.y = radius * Math.sin(theta) * SQUASH - box.h / 2;

				// Stay inside the column; the spiral simply keeps looking if it strays.
				if (box.x < 0 || box.x + box.w > width) continue;
				if (placed.some((other) => overlaps(box, other))) continue;

				done = true;
				break;
			}

			if (!done) {
				// Wider than the container, or genuinely nowhere to go: drop it underneath
				// everything rather than leaving it stacked at the origin.
				box.x = 0;
				box.y = placed.reduce((max, p) => Math.max(max, p.y + p.h + GAP), 0);
			}
			placed.push(box);
		}

		const top = Math.min(...placed.map((p) => p.y));
		const bottom = Math.max(...placed.map((p) => p.y + p.h));
		for (const p of placed) {
			p.el.style.transform = `translate(${Math.round(p.x)}px, ${Math.round(p.y - top)}px)`;
		}
		setHeight(Math.ceil(bottom - top));
		setReady(true);
	}, []);

	// Layout effect, not effect: packing runs before paint, so the words are never
	// visibly stacked at the origin first. Switching language swaps every label and
	// changes every box width, so the cloud has to be packed again after that renders.
	// biome-ignore lint/correctness/useExhaustiveDependencies: locale is the re-pack signal, not read in the body
	useLayoutEffect(() => {
		const container = root.current;
		if (!container) return;
		pack();

		let frame = 0;
		const repack = () => {
			// Coalesce: one ResizeObserver callback carries many entries, and a font swap
			// resizes every word at once.
			cancelAnimationFrame(frame);
			frame = requestAnimationFrame(pack);
		};

		// Observe the words themselves, not just the container. Two things resize a word
		// without resizing the container, and both used to leave the cloud overlapping:
		//   1. the fonts load with font-display: swap, so the first pack measures
		//      fallback metrics and every box gets wider a moment later;
		//   2. sizes are set in vw, so past the container's max-width the words keep
		//      growing with the viewport while the container width is pinned.
		// Transforms do not affect the observed box, so this cannot feed back on itself.
		const ro = new ResizeObserver(repack);
		ro.observe(container);
		for (const node of container.querySelectorAll("[data-cloud-item]")) {
			ro.observe(node);
		}

		// Belt and braces for browsers that report the swap late.
		document.fonts?.ready.then(repack).catch(() => {});

		return () => {
			cancelAnimationFrame(frame);
			ro.disconnect();
		};
	}, [pack, locale]);

	return (
		<section
			aria-label={t("cloud.title")}
			className="border-abismo-900/10 border-t bg-azul-50/40 py-16 sm:py-20"
		>
			<div className="mx-auto max-w-5xl px-5 sm:px-8">
				<div
					ref={root}
					className={`relative transition-opacity duration-300 ${ready ? "opacity-100" : "opacity-0"}`}
					style={{ height: height || undefined }}
				>
					<ul>
						{CLOUD.map((term, i) => {
							const label = locale === "en" ? term.en : term.es;
							// writing-mode, not rotate: the box itself becomes tall and narrow,
							// so the packer measures the space the word actually occupies.
							const orientation =
								term.axis === "y" ? "[writing-mode:vertical-rl]" : "";
							const className = `${SIZE[term.weight]} ${TONE[i % TONE.length]} ${orientation} leading-none`;
							return (
								<li
									key={`${term.es}-${locale}`}
									data-cloud-item
									data-weight={term.weight}
									data-axis={term.axis}
									className="absolute top-0 left-0 whitespace-nowrap"
								>
									{term.href ? (
										<Link
											to={term.href}
											className={`${className} underline-offset-4 transition-colors duration-200 hover:text-verde-700 hover:underline`}
										>
											{label}
										</Link>
									) : (
										<span className={className}>{label}</span>
									)}
								</li>
							);
						})}
					</ul>
				</div>
			</div>
		</section>
	);
}
