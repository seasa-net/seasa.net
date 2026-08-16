import {
	type CSSProperties,
	type ReactNode,
	useEffect,
	useRef,
	useState,
} from "react";

export type ForceFieldProps = {
	children: ReactNode;
	className?: string;
	/** Target cell size in px; the grid rounds to whole cells. */
	tile?: number;
	/** Radius of cursor influence over the tiles, in px. */
	radius?: number;
	/** Max tile displacement at the cursor, in px. */
	push?: number;
	/** Max tile rotation at the cursor, in degrees. */
	twist?: number;
	/** How far tiles shrink at the cursor, 0-1. */
	shrink?: number;
	/** Radius of influence over `data-force-item` content, in px. */
	itemRadius?: number;
	/** Max content displacement, in px. */
	itemPush?: number;
	/** Tile opacity at rest and at the cursor. */
	restOpacity?: number;
	peakOpacity?: number;
};

/**
 * A grid of tiles glued edge to edge, shoved away from the pointer with a
 * quadratic falloff. Anything inside marked `data-force-item` drifts too, so the
 * content breaks apart with the grid instead of floating above a separate effect.
 *
 * Pointer-driven, so it writes transforms straight to the DOM inside rAF, because routing
 * a few hundred tiles per frame through React state would re-render the section.
 * Desktop only: no fine pointer or reduced motion means the grid stays static.
 */
export function ForceField({
	children,
	className = "",
	tile = 56,
	radius = 230,
	push = 28,
	twist = 7,
	shrink = 0.14,
	itemRadius = 340,
	itemPush = 12,
	restOpacity = 0.4,
	peakOpacity = 1,
}: ForceFieldProps) {
	const root = useRef<HTMLDivElement>(null);
	const layer = useRef<HTMLDivElement>(null);
	const [cells, setCells] = useState({ cols: 0, rows: 0 });

	useEffect(() => {
		const el = root.current;
		if (!el) return;
		const ro = new ResizeObserver(([entry]) => {
			const { width, height } = entry.contentRect;
			const cols = Math.max(1, Math.round(width / tile));
			const rows = Math.max(1, Math.round(height / tile));
			// Keep the same object when the counts are unchanged, or every observer
			// callback would re-render and risk a ResizeObserver feedback loop.
			setCells((prev) =>
				prev.cols === cols && prev.rows === rows ? prev : { cols, rows },
			);
		});
		ro.observe(el);
		return () => ro.disconnect();
	}, [tile]);

	useEffect(() => {
		const el = root.current;
		const lay = layer.current;
		if (!el || !lay || !cells.cols) return;
		if (!matchMedia("(pointer: fine)").matches) return;
		if (matchMedia("(prefers-reduced-motion: reduce)").matches) return;

		let frame = 0;
		let px = 0;
		let py = 0;
		let active = false;
		// Measured on enter, not per frame: reading layout after writing transforms
		// would force a reflow on every move.
		let box = { w: 0, h: 0 };
		let items: { el: HTMLElement; x: number; y: number }[] = [];

		const set = (node: HTMLElement, value: string) => {
			if (node.style.transform !== value) node.style.transform = value;
		};

		const draw = () => {
			frame = 0;
			const cw = box.w / cells.cols;
			const ch = box.h / cells.rows;
			const tiles = lay.children;
			const fade = peakOpacity - restOpacity;

			for (let i = 0; i < tiles.length; i++) {
				const node = tiles[i] as HTMLElement;
				const dx = ((i % cells.cols) + 0.5) * cw - px;
				const dy = (Math.floor(i / cells.cols) + 0.5) * ch - py;
				const dist = Math.hypot(dx, dy);
				if (!active || dist > radius) {
					set(node, "");
					if (node.style.opacity) node.style.opacity = "";
					continue;
				}
				const f = (1 - dist / radius) ** 2;
				const n = dist || 1;
				set(
					node,
					`translate(${((dx / n) * f * push).toFixed(2)}px, ${((dy / n) * f * push).toFixed(2)}px) rotate(${((dx / n) * f * twist).toFixed(2)}deg) scale(${(1 - f * shrink).toFixed(3)})`,
				);
				node.style.opacity = (restOpacity + f * fade).toFixed(2);
			}

			for (const item of items) {
				const dx = item.x - px;
				const dy = item.y - py;
				const dist = Math.hypot(dx, dy);
				if (!active || dist > itemRadius) {
					set(item.el, "");
					continue;
				}
				const f = (1 - dist / itemRadius) ** 2;
				const n = dist || 1;
				set(
					item.el,
					`translate(${((dx / n) * f * itemPush).toFixed(2)}px, ${((dy / n) * f * itemPush).toFixed(2)}px)`,
				);
			}
		};

		const schedule = () => {
			if (!frame) frame = requestAnimationFrame(draw);
		};

		const measure = () => {
			const rect = el.getBoundingClientRect();
			box = { w: rect.width, h: rect.height };
			items = [...el.querySelectorAll<HTMLElement>("[data-force-item]")].map(
				(node) => {
					const r = node.getBoundingClientRect();
					return {
						el: node,
						x: r.left - rect.left + r.width / 2,
						y: r.top - rect.top + r.height / 2,
					};
				},
			);
		};

		const onEnter = () => {
			measure();
			active = true;
		};
		const onMove = (e: PointerEvent) => {
			const rect = el.getBoundingClientRect();
			px = e.clientX - rect.left;
			py = e.clientY - rect.top;
			active = true;
			schedule();
		};
		const onLeave = () => {
			active = false;
			schedule();
		};

		el.addEventListener("pointerenter", onEnter);
		el.addEventListener("pointermove", onMove);
		el.addEventListener("pointerleave", onLeave);
		return () => {
			el.removeEventListener("pointerenter", onEnter);
			el.removeEventListener("pointermove", onMove);
			el.removeEventListener("pointerleave", onLeave);
			if (frame) cancelAnimationFrame(frame);
		};
	}, [
		cells,
		radius,
		push,
		twist,
		shrink,
		itemRadius,
		itemPush,
		restOpacity,
		peakOpacity,
	]);

	return (
		<div ref={root} className={`relative ${className}`}>
			<div
				ref={layer}
				aria-hidden="true"
				className="pointer-events-none absolute inset-0 grid overflow-hidden"
				style={
					{
						gridTemplateColumns: `repeat(${cells.cols}, 1fr)`,
						gridTemplateRows: `repeat(${cells.rows}, 1fr)`,
						// Resting opacity lives here, not in the stylesheet, so clearing the
						// inline value on reset falls back to the prop rather than a constant.
						"--tile-rest": restOpacity,
					} as CSSProperties
				}
			>
				{Array.from({ length: cells.cols * cells.rows }, (_, i) => (
					// biome-ignore lint/suspicious/noArrayIndexKey: fixed-length decorative grid
					<span key={i} className="force-tile" />
				))}
			</div>
			<div className="relative">{children}</div>
		</div>
	);
}
