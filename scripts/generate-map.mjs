import { readFileSync, writeFileSync } from "node:fs";

const geo = JSON.parse(readFileSync(new URL("./mexico-source.geo.json", import.meta.url), "utf8"));

// Approximate site coordinates for the five project states. These place the marker
// near the named location, not on a surveyed boundary; SEASA has to confirm them.
const SITES = {
  campeche: { lon: -91.55, lat: 18.65 },   // Laguna de Terminos
  bcs: { lon: -110.31, lat: 24.14 },       // Bahia de La Paz
  guerrero: { lon: -101.55, lat: 17.63 },  // Isla Ixtapa / Las Gatas, Zihuatanejo
  michoacan: { lon: -102.19, lat: 17.96 }, // Costa de Michoacan
  oaxaca: { lon: -96.13, lat: 15.75 },     // Bahias de Huatulco
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
const merc = ([lon, lat]) => [rad(lon), Math.log(Math.tan(Math.PI / 4 + rad(lat) / 2))];

const eachPoint = (geom, fn) => {
  const polys = geom.type === "Polygon" ? [geom.coordinates] : geom.coordinates;
  for (const poly of polys) for (const ring of poly) for (const pt of ring) fn(pt);
};

let minX = Infinity, maxX = -Infinity, minY = Infinity, maxY = -Infinity;
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
      let prev = "";
      let started = false;
      for (const pt of ring) {
        const [x, y] = project(pt);
        const s = `${x.toFixed(1)} ${y.toFixed(1)}`;
        if (s === prev) continue; // collapsed to the same pixel after rounding
        out.push((started ? "L" : "M") + s);
        started = true;
        prev = s;
      }
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
