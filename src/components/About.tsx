import type { MessageKey } from "../i18n";
import { useT } from "../i18n";
import { ForceField } from "./ForceField";

/* Misión takes the tierra half of the mark, Visión the agua half. The two brand
   colours carry the two statements instead of decorating them. */
const PILLARS = [
	{
		label: "about.mission.label",
		body: "about.mission.body",
		rule: "bg-marca-verde",
	},
	{
		label: "about.vision.label",
		body: "about.vision.body",
		rule: "bg-marca-azul",
	},
] satisfies { label: MessageKey; body: MessageKey; rule: string }[];

const VALUES = [
	["about.value.rigor", "about.value.rigor.body"],
	["about.value.transparency", "about.value.transparency.body"],
	["about.value.responsibility", "about.value.responsibility.body"],
	["about.value.innovation", "about.value.innovation.body"],
	["about.value.social", "about.value.social.body"],
	["about.value.results", "about.value.results.body"],
] satisfies [MessageKey, MessageKey][];

export function About() {
	const t = useT();

	return (
		<section id="nosotros" className="bg-white py-24 sm:py-32">
			<div className="mx-auto max-w-6xl px-5 sm:px-8">
				<div className="grid gap-12 lg:grid-cols-[minmax(0,24rem)_1fr] lg:gap-20">
					<div className="lg:sticky lg:top-28 lg:self-start">
						<p className="font-semibold text-[11px] text-azul-700 uppercase tracking-[0.22em]">
							{t("about.eyebrow")}
						</p>
						<h2 className="mt-5 text-balance font-display text-[clamp(1.9rem,3.6vw,2.9rem)] text-abismo-900 leading-[1.12]">
							{t("about.title")}
						</h2>
						<p className="mt-6 text-abismo-800/70 text-lg leading-relaxed">
							{t("about.lead")}
						</p>
					</div>

					{/* Stacked, not side by side: two columns inside this already-narrow
					    right rail gave each statement a ~250px measure, which shreds
					    display type into four-word lines. */}
					{/* The card's own padding pushed these statements ~28px further in than
					    the intro and the values, which reads as a misalignment on narrow
					    screens. Below sm they drop the card entirely and sit on the same
					    left edge as everything else; the framed treatment returns at sm. */}
					<div className="grid gap-10 self-start sm:gap-px sm:overflow-hidden sm:rounded-2xl sm:bg-abismo-900/10">
						{PILLARS.map(({ label, body, rule }) => (
							<article key={label} className="sm:bg-white sm:p-8">
								<span
									aria-hidden="true"
									className={`block h-1 w-10 rounded-full ${rule}`}
								/>
								<h3 className="mt-5 font-semibold text-[11px] text-abismo-800/60 uppercase tracking-[0.22em]">
									{t(label)}
								</h3>
								<p className="mt-4 text-pretty font-display text-abismo-900 text-xl leading-snug sm:text-[1.4rem]">
									{t(body)}
								</p>
							</article>
						))}
					</div>
				</div>

				{/* Full container width, not nested in the right rail: three columns here
				    give each blurb ~40 characters instead of ~32. */}
				<ForceField
					tile={20}
					className="mt-16 border-abismo-900/10 border-t pt-10 pb-12 sm:mt-20"
				>
					<h3
						data-force-item
						className="font-semibold text-[11px] text-abismo-800/60 uppercase tracking-[0.22em]"
					>
						{t("about.values.label")}
					</h3>
					<ul className="mt-8 grid gap-x-10 gap-y-9 sm:grid-cols-2 lg:grid-cols-3">
						{VALUES.map(([name, body], i) => (
							<li key={name} data-force-item className="flex gap-4">
								<span
									aria-hidden="true"
									className="pt-0.5 font-display text-azul-600 text-lg tabular-nums"
								>
									{String(i + 1).padStart(2, "0")}
								</span>
								<div>
									<h4 className="font-semibold text-abismo-900">{t(name)}</h4>
									<p className="mt-1.5 text-abismo-800/70 leading-relaxed">
										{t(body)}
									</p>
								</div>
							</li>
						))}
					</ul>
				</ForceField>
			</div>
		</section>
	);
}
