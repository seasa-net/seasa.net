import { readFileSync, writeFileSync } from "node:fs";

const geo = JSON.parse(
	readFileSync(new URL("./mexico-source.geo.json", import.meta.url), "utf8"),
);

// Site coordinates for the five project states, taken from the place names in the
// company CV. They locate the named town or bay, not a surveyed project boundary.
const SITES = {
	campeche: { lon: -91.55, lat: 18.65 }, // Laguna de Terminos
	bcs: { lon: -110.31, lat: 24.14 }, // Bahia de La Paz
	guerrero: { lon: -101.55, lat: 17.63 }, // Isla Ixtapa / Las Gatas, Zihuatanejo
	michoacan: { lon: -102.35, lat: 17.99 }, // Playa Azul, Lazaro Cardenas
	oaxaca: { lon: -96.13, lat: 15.75 }, // Bahias de Huatulco
};

// GeoJSON "name" -> our id. Everything else renders as inert background.
const IDS = {
	Campeche: "campeche",
	"Baja California Sur": "bcs",
	Guerrero: "guerrero",
	"Michoacán de Ocampo": "michoacan",
	Oaxaca: "oaxaca",
};

const rad = (d) => (d * Math.PI) / 180;
// Web Mercator. Mexico sits between ~14N and ~33N, where the distortion is mild.
const merc = ([lon, lat]) => [
	rad(lon),
	Math.log(Math.tan(Math.PI / 4 + rad(lat) / 2)),
];

const eachPoint = (geom, fn) => {
	const polys = geom.type === "Polygon" ? [geom.coordinates] : geom.coordinates;
	for (const poly of polys)
		for (const ring of poly) for (const pt of ring) fn(pt);
};

let minX = Infinity,
	maxX = -Infinity,
	minY = Infinity,
	maxY = -Infinity;
for (const f of geo.features) {
	eachPoint(f.geometry, (pt) => {
		const [x, y] = merc(pt);
		if (x < minX) minX = x;
		if (x > maxX) maxX = x;
		if (y < minY) minY = y;
		if (y > maxY) maxY = y;
	});
}

const WIDTH = 1000;
const MIN_STEP = 1.1; // map units between kept vertices
const scale = WIDTH / (maxX - minX);
const HEIGHT = Math.round((maxY - minY) * scale);
const project = (pt) => {
	const [x, y] = merc(pt);
	return [(x - minX) * scale, (maxY - y) * scale];
};

// One decimal is ~0.4km at this scale: far finer than a 1000px-wide map can show,
// and it roughly halves the string length versus full precision.
const toPath = (geom) => {
	const polys = geom.type === "Polygon" ? [geom.coordinates] : geom.coordinates;
	const out = [];
	for (const poly of polys) {
		for (const ring of poly) {
			let lastX = NaN;
			let lastY = NaN;
			let started = false;
			const kept = [];
			for (const pt of ring) {
				const [x, y] = project(pt);
				// Drop vertices closer than a device pixel at any sane display size. The map
				// is never wider than ~700px on screen, so MIN_STEP units is sub-pixel there.
				if (
					started &&
					Math.abs(x - lastX) < MIN_STEP &&
					Math.abs(y - lastY) < MIN_STEP
				) {
					continue;
				}
				kept.push(`${x.toFixed(1)} ${y.toFixed(1)}`);
				started = true;
				lastX = x;
				lastY = y;
			}
			// A ring needs three distinct points to enclose any area.
			if (kept.length < 3) continue;
			for (let i = 0; i < kept.length; i++) out.push((i ? "L" : "M") + kept[i]);
			started = kept.length > 0;
			if (started) out.push("Z");
		}
	}
	return out.join("");
};

const states = geo.features
	.map((f) => ({
		name: f.properties.state_name,
		id: IDS[f.properties.state_name] ?? null,
		d: toPath(f.geometry),
	}))
	.filter((s) => s.d.length > 0);

const sites = Object.fromEntries(
	Object.entries(SITES).map(([id, { lon, lat }]) => {
		const [x, y] = project([lon, lat]);
		return [id, { x: +x.toFixed(1), y: +y.toFixed(1) }];
	}),
);

const body = `// GENERATED FILE. Do not edit by hand.
// Source: public lon/lat state boundaries, projected to Web Mercator and
// flattened to SVG paths by scripts/generate-map.mjs so nothing has to project at runtime.

export const MAP_WIDTH = ${WIDTH};
export const MAP_HEIGHT = ${HEIGHT};

/** Every Mexican state. \`id\` is set only where SEASA has projects. */
export const STATES: { name: string; id: string | null; d: string }[] = ${JSON.stringify(states)};

/** Approximate site markers in map units. Confirm the real coordinates with SEASA. */
export const SITES: Record<string, { x: number; y: number }> = ${JSON.stringify(sites)};
`;

writeFileSync(process.argv[2], body);
console.log(
	`states=${states.length} matched=${states.filter((s) => s.id).length} ` +
		`viewBox=0 0 ${WIDTH} ${HEIGHT} bytes=${body.length}`,
);
