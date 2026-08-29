import { LEGAL } from "../data/legal";
import { useDocumentMeta, useLocaleStore, useT } from "../i18n";

/** One component, two routes: the document is picked by prop, not duplicated. */
export function LegalPage({ doc }: { doc: "privacy" | "terms" }) {
	const t = useT();
	const locale = useLocaleStore((s) => s.locale);
	const content = LEGAL[locale][doc];
	useDocumentMeta(content.title);

	return (
		<article className="mx-auto max-w-3xl px-5 pt-32 pb-24 sm:px-8">
			<h1 className="font-display text-[clamp(2rem,4.5vw,3rem)] text-abismo-900 leading-[1.1]">
				{content.title}
			</h1>
			<p className="mt-4 text-abismo-800/60 text-sm">
				{t("legal.updated")}{" "}
				<time dateTime={content.updated}>{content.updated}</time>
			</p>

			<p className="mt-8 text-abismo-800/80 leading-relaxed">{content.intro}</p>

			{content.sections.map((section) => (
				<section key={section.heading} className="mt-10">
					<h2 className="font-display text-abismo-900 text-xl">
						{section.heading}
					</h2>
					{section.body.map((paragraph) => (
						<p
							key={paragraph.slice(0, 40)}
							className="mt-3 text-abismo-800/80 leading-relaxed"
						>
							{paragraph}
						</p>
					))}
				</section>
			))}

			<p className="mt-12 rounded-xl border border-coral-500/40 border-dashed bg-coral-500/5 p-5 text-abismo-800/75 text-sm leading-relaxed">
				{t("legal.review")}
			</p>
		</article>
	);
}
