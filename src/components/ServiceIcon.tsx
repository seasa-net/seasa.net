import type { ReactNode } from "react";

/* Single stroke weight, 24px grid, currentColor throughout, so the same glyph works
   in a card, in the cursor badge and blown up in the modal header. */
const PATHS: Record<string, ReactNode> = {
	// Impact statement: a filed document that has been checked off.
	document: (
		<>
			<path d="M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8z" />
			<path d="M14 3v5h5" />
			<path d="m9 15 2 2 4-4" />
		</>
	),
	// Artificial reef: a placed module colonised by organisms.
	reef: (
		<>
			<path d="M3 20h18" />
			<path d="M6 20a6 6 0 0 1 12 0" />
			<circle cx="12" cy="14.5" r="1.3" />
			<circle cx="8.8" cy="18" r="1" />
			<circle cx="15.2" cy="18" r="1" />
			<path d="M12 4v3M9 6l1.5 2M15 6l-1.5 2" />
		</>
	),
	// Bathymetry: echo sounding down through the water column.
	sonar: (
		<>
			<path d="M12 3v3" />
			<path d="M7.5 9.5a6 6 0 0 1 9 0" />
			<path d="M9 13.2a3.8 3.8 0 0 1 6 0" />
			<path d="M10.6 16.6a1.9 1.9 0 0 1 2.8 0" />
			<circle cx="12" cy="20" r="1.2" />
		</>
	),
	// Hydrology: a dendritic drainage network feeding one channel.
	river: (
		<>
			<path d="M12 21v-9" />
			<path d="M12 12 7.5 7.5" />
			<path d="M12 15.5 16.5 11" />
			<path d="M7.5 7.5 6 4M7.5 7.5 10 5" />
			<path d="M16.5 11 18 7.5M16.5 11 14 9" />
		</>
	),
	// Coastal modelling: swell arriving, sediment moving along the shore.
	coast: (
		<>
			<path d="M3 9c3 0 3.5-2.5 6-2.5S13.5 9 16.5 9 21 7 21 7" />
			<path d="M3 14c3 0 4-2 7-2s4 2 7 2 4-2 4-2" />
			<path d="M4 20h16" />
			<path d="m14 17.5 2.5 2.5-2.5 2.5" />
		</>
	),
	// Topography: elevation contours read from the air.
	contour: (
		<>
			<circle cx="12" cy="5" r="2" />
			<path d="M12 7v2" />
			<path d="M21 16.5c0 2.5-4 4.5-9 4.5s-9-2-9-4.5S7 12 12 12s9 2 9 4.5z" />
			<path d="M16 16.8c0-1.3-1.8-2.3-4-2.3s-4 1-4 2.3" />
		</>
	),
	// Rescue: a specimen lifted and replanted.
	sprout: (
		<>
			<path d="M12 21v-7" />
			<path d="M12 14c0-3 2-5 5-5 0 3-2 5-5 5z" />
			<path d="M12 16c0-3-2-5-5-5 0 3 2 5 5 5z" />
			<path d="M7 21h10" />
		</>
	),
	// Lab: a volume you can turn.
	cube: (
		<>
			<path d="M12 3 4 7.2v9.6L12 21l8-4.2V7.2z" />
			<path d="M4 7.2 12 11.5l8-4.3" />
			<path d="M12 11.5V21" />
		</>
	),
	// Lab: stacked georeferenced layers.
	layers: (
		<>
			<path d="m12 3 8.5 4.2L12 11.4 3.5 7.2z" />
			<path d="m3.5 12 8.5 4.2 8.5-4.2" />
			<path d="m3.5 16.8 8.5 4.2 8.5-4.2" />
		</>
	),
	// Lab: a full turn around a viewpoint.
	panorama: (
		<>
			<ellipse cx="12" cy="12" rx="9" ry="4.2" />
			<path d="M6.6 15.2a9 9 0 1 0 10.8 0" />
			<circle cx="12" cy="12" r="1.4" />
		</>
	),
	// Lab: a document you take away.
	download: (
		<>
			<path d="M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8z" />
			<path d="M14 3v5h5" />
			<path d="M12 11v6" />
			<path d="m9.5 14.5 2.5 2.5 2.5-2.5" />
		</>
	),
	// Renewables: array plus resource.
	solar: (
		<>
			<circle cx="17" cy="6" r="2.6" />
			<path d="M17 1.6v1M17 9.4v1M12.6 6h1M20.4 6h1M13.9 2.9l.7.7M20.1 2.9l-.7.7" />
			<path d="M4 20h12l-2.2-8H6.2z" />
			<path d="M9 12 8 20M11.4 16H4.8" />
		</>
	),
};

export type IconName = keyof typeof PATHS;

export function ServiceIcon({
	name,
	className = "",
}: {
	name: IconName;
	className?: string;
}) {
	return (
		<svg
			viewBox="0 0 24 24"
			fill="none"
			stroke="currentColor"
			strokeWidth={1.5}
			strokeLinecap="round"
			strokeLinejoin="round"
			aria-hidden="true"
			className={className}
		>
			{PATHS[name]}
		</svg>
	);
}
