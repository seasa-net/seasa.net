/**
 * The site's vocabulary, as a weighted cloud. Translations live inline rather than in
 * the flat dictionary because a word list is easier to maintain when each term sits
 * next to its pair, and because 25 terms would add 50 near-duplicate keys.
 *
 * `weight` 1-4 drives size and emphasis. `href` is set only where the term maps to a
 * real destination, so the rest render as plain text instead of dead links.
 */
export type CloudTerm = {
	es: string;
	en: string;
	weight: 1 | 2 | 3 | 4;
	href?: string;
	/** Set on short terms only: a long word set vertically makes the row enormous. */
	axis?: "y";
};

export const CLOUD: CloudTerm[] = [
	{
		es: "Arrecifes artificiales",
		en: "Artificial reefs",
		weight: 4,
		href: "/#servicios",
	},
	{
		es: "Impacto ambiental",
		en: "Environmental impact",
		weight: 4,
		href: "/#servicios",
	},
	{ es: "Carbono azul", en: "Blue carbon", weight: 4 },
	{ es: "Restauración marina", en: "Marine restoration", weight: 3 },
	{ es: "Oceanografía", en: "Oceanography", weight: 3, href: "/#servicios" },
	{ es: "Batimetría", en: "Bathymetry", weight: 3, axis: "y" },
	{
		es: "Hidrología",
		en: "Hydrology",
		weight: 3,
		href: "/#servicios",
	},
	{
		es: "Modelación costera",
		en: "Coastal modelling",
		weight: 3,
		href: "/#servicios",
	},
	{ es: "Fotogrametría", en: "Photogrammetry", weight: 2 },
	{ es: "Topografía", en: "Topography", weight: 2 },
	{
		es: "Rescate de flora y fauna",
		en: "Flora and fauna rescue",
		weight: 2,
		href: "/#servicios",
	},
	{
		es: "Energías renovables",
		en: "Renewable energy",
		weight: 3,
		href: "/#servicios",
	},
	{ es: "Monitoreo", en: "Monitoring", weight: 3, axis: "y" },
	{ es: "Línea base", en: "Baseline", weight: 1 },
	{ es: "Colonización biológica", en: "Biological colonisation", weight: 2 },
	{ es: "Biodiversidad", en: "Biodiversity", weight: 2 },
	{ es: "Infraestructura azul", en: "Blue infrastructure", weight: 3 },
	{ es: "Protección costera", en: "Coastal protection", weight: 2 },
	{ es: "Zona federal", en: "Federal zone", weight: 1 },
	{ es: "Transectos", en: "Transects", weight: 1 },
	{ es: "Georreferenciación", en: "Georeferencing", weight: 1 },
	{ es: "Recuperación pesquera", en: "Fishery recovery", weight: 2 },
	{ es: "Proyectos", en: "Projects", weight: 3, href: "/#proyectos" },
	{
		es: "Laboratorio digital",
		en: "Digital lab",
		weight: 3,
		href: "/#laboratorio",
	},
	{ es: "Nosotros", en: "About us", weight: 2, href: "/#nosotros" },
];
