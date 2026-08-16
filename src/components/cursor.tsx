import {
	createContext,
	type ReactNode,
	useContext,
	useEffect,
	useMemo,
	useRef,
	useState,
} from "react";

export type CursorHint = { icon?: ReactNode; label?: string };

type CursorApi = {
	show: (hint: CursorHint) => void;
	hide: () => void;
	suppress: (on: boolean) => void;
};

const CursorContext = createContext<CursorApi | null>(null);

/** Custom cursors are a pointing-device affordance only. */
function supported() {
	return (
		typeof matchMedia === "function" &&
		matchMedia("(pointer: fine)").matches &&
		!matchMedia("(prefers-reduced-motion: reduce)").matches
	);
}

/**
 * Renders one floating element that trails the pointer and shows whatever hint the
 * hovered region asked for. Mount it once, near the root.
 *
 * The follow loop writes `transform` straight to the node rather than going through
 * state, so pointer movement never re-renders the tree. Only the hint (which changes
 * on enter/leave, not on move) lives in state.
 */
export function CursorProvider({ children }: { children: ReactNode }) {
	const [hint, setHint] = useState<CursorHint | null>(null);
	// Suppression is separate from the hint on purpose. A nested control swallows the
	// badge while keeping the region's hint intact, so moving back out restores it
	// without the parent needing to re-fire pointerenter (which it never would).
	const [swallowed, setSwallowed] = useState(false);
	// Decided once in JS rather than with CSS variants, so touch and reduced-motion
	// visitors get no badge element at all instead of one hidden by a fragile rule.
	const [enabled] = useState(supported);
	const dot = useRef<HTMLDivElement>(null);

	const api = useMemo<CursorApi>(
		() => ({
			show: (next) => {
				setSwallowed(false);
				setHint(next);
			},
			hide: () => setHint(null),
			suppress: setSwallowed,
		}),
		[],
	);

	useEffect(() => {
		if (!enabled) return;
		const node = dot.current;
		if (!node) return;

		let frame = 0;
		let x = 0;
		let y = 0;
		let tx = 0;
		let ty = 0;
		let seeded = false;

		const loop = () => {
			frame = 0;
			// Ease toward the pointer so the badge trails slightly instead of sticking.
			x += (tx - x) * 0.22;
			y += (ty - y) * 0.22;
			node.style.transform = `translate3d(${x.toFixed(1)}px, ${y.toFixed(1)}px, 0)`;
			if (Math.abs(tx - x) > 0.3 || Math.abs(ty - y) > 0.3) {
				frame = requestAnimationFrame(loop);
			}
		};

		const onMove = (e: PointerEvent) => {
			tx = e.clientX;
			ty = e.clientY;
			if (!seeded) {
				// Jump to the first known position, otherwise it slides in from 0,0.
				seeded = true;
				x = tx;
				y = ty;
			}
			if (!frame) frame = requestAnimationFrame(loop);
		};

		window.addEventListener("pointermove", onMove, { passive: true });
		return () => {
			window.removeEventListener("pointermove", onMove);
			if (frame) cancelAnimationFrame(frame);
		};
	}, [enabled]);

	return (
		<CursorContext.Provider value={api}>
			{children}
			{enabled && (
				<div
					ref={dot}
					aria-hidden="true"
					className="pointer-events-none fixed top-0 left-0 z-[60]"
				>
					<div
						className={`-translate-x-1/2 -translate-y-1/2 flex items-center gap-2 rounded-full bg-abismo-900 py-2 pr-4 pl-2 text-white shadow-lg transition-[opacity,scale] duration-200 ease-out ${
							hint && !swallowed
								? "scale-100 opacity-100"
								: swallowed
									? "scale-0 opacity-0" // swallowed by a control: collapse into it
									: "scale-50 opacity-0"
						}`}
					>
						<span className="grid h-7 w-7 place-content-center rounded-full bg-marca-verde text-abismo-900">
							{hint?.icon}
						</span>
						<span className="whitespace-nowrap font-semibold text-xs uppercase tracking-[0.14em]">
							{hint?.label}
						</span>
					</div>
				</div>
			)}
		</CursorContext.Provider>
	);
}

/**
 * Spread the result onto any element to give it a custom cursor while hovered:
 * `<article {...useCursorTarget({ icon, label })}>`. Safe to call without a
 * provider mounted, in which case it is inert.
 */
export function useCursorTarget(hint: CursorHint) {
	const api = useContext(CursorContext);
	const { icon, label } = hint;
	return {
		"data-cursor-target": "" as const,
		onPointerEnter: () => api?.show({ icon, label }),
		onPointerLeave: () => api?.hide(),
	};
}

/**
 * Spread onto a control nested inside a cursor target to swallow the badge and hand
 * the pointer back its normal click affordance: `<button {...useCursorSwallow()}>`.
 * The region's hint is kept, so the badge returns when the pointer moves back out.
 */
export function useCursorSwallow() {
	const api = useContext(CursorContext);
	return {
		"data-cursor-swallow": "" as const,
		onPointerEnter: () => api?.suppress(true),
		onPointerLeave: () => api?.suppress(false),
	};
}
