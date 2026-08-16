import { MAP_HEIGHT, MAP_WIDTH, SITES, STATES } from "../data/mexico";
import type { ProjectId } from "../data/projects";

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
						onPointerEnter={
							isProject && onSelect
								? () => onSelect(state.id as ProjectId)
								: undefined
						}
						style={isProject && onSelect ? { cursor: "pointer" } : undefined}
					/>
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
