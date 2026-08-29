import { MAP_HEIGHT, MAP_WIDTH, SITES, STATES } from "../data/mexico";
import type { ProjectId } from "../data/projects";
import { useCursor } from "./cursor";

function Pin() {
	return (
		<svg
			viewBox="0 0 24 24"
			fill="none"
			stroke="currentColor"
			strokeWidth={2}
			strokeLinecap="round"
			strokeLinejoin="round"
			aria-hidden="true"
			className="h-3 w-3"
		>
			<path d="M12 21s7-6.2 7-11a7 7 0 1 0-14 0c0 4.8 7 11 7 11Z" />
			<circle cx="12" cy="10" r="2.5" />
		</svg>
	);
}

/**
 * Static SVG, no projection at runtime: `src/data/mexico.ts` is generated once by
 * `scripts/generate-map.mjs`. States without projects render as inert background so the
 * five that matter carry all the contrast.
 */
export function MexicoMap({
	activeId,
	label,
	onSelect,
}: {
	activeId: ProjectId;
	label: string;
	onSelect?: (id: ProjectId) => void;
}) {
	const site = SITES[activeId];
	const cursor = useCursor();

	return (
		<svg
			viewBox={`0 0 ${MAP_WIDTH} ${MAP_HEIGHT}`}
			role="img"
			aria-label={label}
			className="h-auto w-full overflow-visible"
		>
			{STATES.map((state) => {
				const isProject = state.id !== null;
				const isActive = state.id === activeId;
				return (
					<path
						key={state.name}
						d={state.d}
						className={
							isActive
								? "fill-marca-azul stroke-abismo-900/30"
								: isProject
									? "fill-azul-100 stroke-abismo-900/20 transition-colors duration-300 hover:fill-marca-azul/60"
									: "fill-abismo-900/5 stroke-abismo-900/10"
						}
						strokeWidth={1}
						vectorEffect="non-scaling-stroke"
						onPointerEnter={() => {
							// Every state names itself in the cursor badge, projects or not,
							// so the map reads as a map rather than five clickable blobs.
							cursor?.show({ label: state.name, icon: <Pin />, compact: true });
							if (isProject && onSelect) onSelect(state.id as ProjectId);
						}}
						onPointerLeave={() => cursor?.hide()}
						style={isProject && onSelect ? { cursor: "pointer" } : undefined}
					>
						{/* Native fallback: touch devices and assistive tech never see the
						    custom badge, and this also gives the shape an accessible name. */}
						<title>{state.name}</title>
					</path>
				);
			})}

			{site && (
				<g className="pointer-events-none">
					{/* Two rings: a steady dot for the position and a pulse to draw the eye
					    when the selection changes. Keyed so the pulse restarts each time. */}
					<circle
						key={`${activeId}-pulse`}
						cx={site.x}
						cy={site.y}
						r={5}
						className="fill-none stroke-abismo-900 motion-safe:animate-[site-pulse_1.8s_ease-out_infinite]"
						strokeWidth={1.5}
						vectorEffect="non-scaling-stroke"
					/>
					<circle
						cx={site.x}
						cy={site.y}
						r={4}
						className="fill-abismo-900 stroke-white"
						strokeWidth={1.5}
						vectorEffect="non-scaling-stroke"
					/>
				</g>
			)}
		</svg>
	);
}
