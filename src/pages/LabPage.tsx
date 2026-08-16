import { Link } from "react-router-dom";
import { useT } from "../i18n";

/**
 * Shell only, like ProjectStory. The route exists so the Lab panel's call to action
 * leads somewhere real; the tool catalogue itself is a later pass.
 */
export function LabPage() {
	const t = useT();

	return (
		<article className="mx-auto max-w-6xl px-5 pt-32 pb-24 sm:px-8">
			<Link
				to="/#laboratorio"
				className="inline-flex items-center gap-2 font-semibold text-abismo-800/70 text-sm transition-colors hover:text-abismo-900"
			>
				<svg
					viewBox="0 0 24 24"
					fill="none"
					stroke="currentColor"
					strokeWidth={1.8}
					strokeLinecap="round"
					strokeLinejoin="round"
					aria-hidden="true"
					className="h-4 w-4"
				>
					<path d="M19 12H5" />
					<path d="m11 18-6-6 6-6" />
				</svg>
				{t("nav.lab")}
			</Link>

			<p className="mt-10 font-semibold text-[11px] text-azul-700 uppercase tracking-[0.22em]">
				{t("lab.eyebrow")}
			</p>
			<h1 className="mt-4 max-w-3xl text-balance font-display text-[clamp(2.2rem,5vw,3.6rem)] text-abismo-900 leading-[1.08]">
				{t("lab.title")}
			</h1>
			<p className="mt-5 max-w-2xl text-abismo-800/75 text-lg leading-relaxed">
				{t("lab.lead")}
			</p>

			<p className="mt-10 rounded-xl border border-abismo-900/10 border-dashed p-6 text-abismo-800/60">
				{t("lab.soon")}
			</p>
		</article>
	);
}
