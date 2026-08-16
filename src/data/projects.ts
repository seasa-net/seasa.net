/**
 * Shared by the home-page Projects section and the project story pages, so the list,
 * the ids and the map keys can never drift apart. Ids match `SITES` in ./mexico.ts.
 *
 * State names are proper nouns and read the same in both languages, so they live here
 * rather than in the dictionary. Everything else is translated.
 */
export const PROJECTS = [
	{ id: "campeche", state: "Campeche" },
	{ id: "bcs", state: "Baja California Sur" },
	{ id: "guerrero", state: "Guerrero" },
	{ id: "michoacan", state: "Michoacán" },
	{ id: "oaxaca", state: "Oaxaca" },
] as const;

export type Project = (typeof PROJECTS)[number];
export type ProjectId = Project["id"];

export const isProjectId = (value: string | undefined): value is ProjectId =>
	PROJECTS.some((p) => p.id === value);
