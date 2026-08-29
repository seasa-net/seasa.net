/**
 * Guards the dictionary against the failure mode that shipped once: a scripted edit
 * that overwrote the Spanish strings with their English counterparts. TypeScript
 * cannot catch that, because both values are still valid strings.
 *
 * Run: npm run i18n
 */
import { readFileSync } from "node:fs";

const src = readFileSync(new URL("../src/i18n.ts", import.meta.url), "utf8");

const slice = (start, end) => {
	const i = src.indexOf(start);
	const j = src.indexOf(end, i);
	if (i < 0 || j < 0) throw new Error(`could not locate ${start}`);
	return src.slice(i, j);
};

const entries = (block) => {
	const out = new Map();
	const re = /"([a-z][a-zA-Z0-9._]*)":\s*\n?\s*"((?:[^"\\]|\\.)*)"/g;
	for (const m of block.matchAll(re)) out.set(m[1], m[2]);
	return out;
};

const es = entries(slice("const es = {", "\n} as const;"));
const en = entries(
	slice("const en: Record<keyof typeof es, string> = {", "\n};"),
);

const problems = [];

for (const key of es.keys())
	if (!en.has(key)) problems.push(`missing in en: ${key}`);
for (const key of en.keys())
	if (!es.has(key)) problems.push(`missing in es: ${key}`);

// Place names are legitimately identical across locales; prose is not.
const PROPER_NOUN = /\.(place|cursor)$/;
for (const [key, value] of es) {
	if (PROPER_NOUN.test(key)) continue;
	if (value.length > 24 && en.get(key) === value) {
		problems.push(`identical in both locales, likely untranslated: ${key}`);
	}
}

if (problems.length > 0) {
	console.error(`i18n check failed (${problems.length}):`);
	for (const p of problems) console.error(`  - ${p}`);
	process.exit(1);
}
console.log(`i18n ok: ${es.size} keys, both locales complete and distinct`);
