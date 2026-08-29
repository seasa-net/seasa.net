import { quoteMailto } from "../data/site";
import type { MessageKey } from "../i18n";
import { useT } from "../i18n";
import { WAVE } from "./Logo";
import { MarineField } from "./MarineField";

/*
 * Every figure below is counted from the official company CV (CV SEASA 2026.pdf),
 * not estimated:
 *   15+  earliest documented project is 2010, so 2010-2026.
 *   7    states with project work: Michoacán, Baja California Sur, Oaxaca, Guerrero,
 *        Campeche, Morelos, Veracruz.
 *   8    artificial reef projects: Bahía Magdalena (2011, 2018), Punta Abreojos (2012),
 *        La Bocana (2012), Playa Azul (2016), Oaxaca coast (2018), Isla Aguada (2024)
 *        and the 2026 confidential coastal project.
 * The previous "3,500+ modules" claim was invented and has been removed.
 */
const STATS: { value: string; key: MessageKey }[] = [
	{ value: "15+", key: "hero.stat.years" },
	{ value: "7", key: "hero.stat.states" },
	{ value: "8", key: "hero.stat.reefs" },
];

/**
 * The hero is the mark at page scale: land above, water below, meeting at a wave.
 * Reuses Logo's WAVE path so the shoreline here and the one inside the logo are
 * literally the same curve on the same tide.
 */
function Shoreline() {
	return (
		<svg
			aria-hidden="true"
			shapeRendering="geometricPrecision"
			/* Tile the period rather than stretching one across the whole viewport:
			   a stretched period flattens the edge to near-horizontal, which is where
			   antialiasing degenerates into visible stair-stepping. The viewBox is also
			   cropped to the wave band (y 40-72) so the crest-to-trough slope stays steep. */
			viewBox="0 40 400 32"
			preserveAspectRatio="none"
			className="-bottom-px absolute inset-x-0 h-[clamp(3rem,7vw,6.5rem)] w-full"
		>
			<g className="animate-tide">
				{[0, 200, 400].map((x) => (
					<path
						key={x}
						transform={`translate(${x} 0)`}
						d={`${WAVE} L 200 72 L 0 72 Z`}
						fill="#fff"
						/* Two abutting tiles each antialias their shared vertical edge to ~50%
						   coverage, which composites into a visible hairline. The stroke paints
						   over the join. */
						stroke="#fff"
						strokeWidth="0.5"
					/>
				))}
			</g>
		</svg>
	);
}

export function Hero() {
	const t = useT();

	return (
		<section
			id="inicio"
			className="relative isolate overflow-hidden bg-abismo-900 text-white"
		>
			{/* A manta drifting in the water column, well under the contrast floor so it
			    never competes with the headline. */}
			<MarineField
				className="text-marca-azul"
				items={[
					{ name: "dolphin", x: 88, y: 30, w: 30, rot: -8, op: 0.09, dur: 16 },
					{
						name: "fish",
						x: 72,
						y: 68,
						w: 9,
						rot: 6,
						flip: true,
						op: 0.1,
						dur: 11,
						delay: 1.5,
					},
					{
						name: "fish",
						x: 80,
						y: 78,
						w: 6,
						rot: -4,
						flip: true,
						op: 0.08,
						dur: 13,
						delay: 3,
					},
					{
						name: "fish",
						x: 18,
						y: 78,
						w: 7,
						rot: 3,
						op: 0.07,
						dur: 12,
						delay: 0.8,
						lgOnly: true,
					},
					{
						name: "wave",
						x: 12,
						y: 22,
						w: 7,
						rot: 0,
						op: 0.09,
						dur: 15,
						delay: 2.2,
					},
					{
						name: "coral",
						x: 40,
						y: 92,
						w: 8,
						rot: 2,
						op: 0.07,
						dur: 18,
						delay: 1,
					},
				]}
			/>

			{/* Depth, layered over the silhouette. */}
			<div
				aria-hidden="true"
				className="absolute inset-0 -z-10 bg-[radial-gradient(60%_50%_at_15%_0%,rgba(164,200,66,0.18),transparent_70%),radial-gradient(55%_55%_at_85%_35%,rgba(138,206,244,0.22),transparent_70%)]"
			/>

			<div className="mx-auto flex min-h-[100svh] max-w-6xl flex-col justify-center px-5 pt-28 pb-[clamp(5rem,12vw,9rem)] sm:px-8">
				<p className="flex items-center gap-3 font-medium text-[11px] text-marca-azul uppercase tracking-[0.22em] sm:text-xs">
					{t("hero.eyebrow")}
				</p>

				<h1 className="mt-6 max-w-4xl text-balance font-display text-[clamp(2.4rem,7vw,5rem)] leading-[1.04] tracking-[-0.01em]">
					{t("hero.title")}
				</h1>

				<p className="mt-7 max-w-2xl text-pretty text-lg text-white/70 leading-relaxed sm:text-xl">
					{t("hero.lead")}
				</p>

				<div className="mt-10 flex flex-wrap gap-3">
					<a
						href={quoteMailto(t("contact.subject"))}
						className="rounded-full bg-marca-verde px-6 py-3.5 font-semibold text-abismo-900 transition-colors hover:bg-verde-400"
					>
						{t("hero.cta.primary")}
					</a>
					<a
						href="#proyectos"
						className="rounded-full border border-white/25 px-6 py-3.5 font-semibold text-white transition-colors hover:border-white/60 hover:bg-white/5"
					>
						{t("hero.cta.secondary")}
					</a>
				</div>

				<dl className="mt-16 grid max-w-3xl grid-cols-1 gap-x-10 gap-y-6 border-white/10 border-t pt-8 sm:grid-cols-3">
					{STATS.map(({ value, key }) => (
						<div key={key}>
							<dt className="font-display text-4xl text-marca-azul tabular-nums sm:text-5xl">
								{value}
							</dt>
							<dd className="mt-1.5 text-sm text-white/60 leading-snug">
								{t(key)}
							</dd>
						</div>
					))}
				</dl>
			</div>

			<Shoreline />
		</section>
	);
}
