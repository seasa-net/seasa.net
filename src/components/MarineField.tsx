import type { CSSProperties } from "react";
import { MarineShape, type ShapeName } from "./MarineShape";

export type Sticker = {
	name: ShapeName;
	/** Position as a percentage of the section, so it scales with the layout. */
	x: number;
	y: number;
	/** Width in rem at desktop. Scales down fluidly, never disappears on mobile. */
	w: number;
	/** Base rotation in degrees, applied under the drift so the two never fight. */
	rot?: number;
	/** Mirror horizontally. Lets one fish face both ways without a second asset. */
	flip?: boolean;
	/** 0-1. Kept low: this is texture, never content. */
	op?: number;
	/** Drift cycle in seconds. Varying it stops the field pulsing in unison. */
	dur?: number;
	delay?: number;
	/** Drop on small screens, for the ones that would crowd the copy. */
	lgOnly?: boolean;
};

/**
 * Scatters marine artwork across a section as background texture.
 *
 * Everything is deterministic: positions, sizes, rotations and drift timings all come
 * from the caller, never from Math.random, so the field is identical on every render
 * and can be tuned by hand.
 *
 * Sizing is a clamp rather than a breakpoint, so the same sticker shrinks smoothly to
 * phone width instead of vanishing at `lg`.
 */
export function MarineField({
	items,
	className = "",
}: {
	items: Sticker[];
	className?: string;
}) {
	return (
		<div
			aria-hidden="true"
			className={`pointer-events-none absolute inset-0 -z-10 overflow-hidden ${className}`}
		>
			{items.map((s, i) => {
				const style: CSSProperties = {
					left: `${s.x}%`,
					top: `${s.y}%`,
					width: `clamp(${(s.w * 0.34).toFixed(2)}rem, ${(s.w * 1.11).toFixed(2)}vw, ${s.w}rem)`,
					opacity: s.op ?? 0.07,
					transform: `translate(-50%, -50%) rotate(${s.rot ?? 0}deg)${s.flip ? " scaleX(-1)" : ""}`,
				};
				const drift = {
					// Per-item timing keeps the field from breathing in unison.
					animationDuration: `${s.dur ?? 14}s`,
					animationDelay: `${s.delay ?? 0}s`,
				} as CSSProperties;
				return (
					<div
						// biome-ignore lint/suspicious/noArrayIndexKey: fixed decorative list
						key={`${s.name}-${i}`}
						style={style}
						className={`absolute ${s.lgOnly ? "hidden lg:block" : ""}`}
					>
						<div style={drift} className="marine-drift">
							<MarineShape name={s.name} className="h-auto w-full" />
						</div>
					</div>
				);
			})}
		</div>
	);
}
