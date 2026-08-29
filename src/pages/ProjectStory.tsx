import { Link, Navigate, useParams } from "react-router-dom";
import { MexicoMap } from "../components/MexicoMap";
import { isProjectId, PROJECTS } from "../data/projects";
import type { MessageKey } from "../i18n";
import { useDocumentMeta, useT } from "../i18n";

/**
 * Shell only. The horizontal scroll narrative, timeline, media, monitoring stats and
 * the zoomable site map are the next pass; this exists so the Explore buttons lead
 * somewhere real and the route, the switcher and the data wiring are settled.
 */
export function ProjectStory() {
	const t = useT();
	const { id } = useParams();

	const project = PROJECTS.find((p) => p.id === id);
	// Hooks must run unconditionally, so the title is computed before any early return.
	useDocumentMeta(project ? project.state : t("title.projects"));

	if (!isProjectId(id) || !project) return <Navigate to="/" replace />;

	return (
		<article className="mx-auto max-w-6xl px-5 pt-32 pb-24 sm:px-8">
			<Link
				to="/#proyectos"
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
				{t("projects.back")}
			</Link>

			<p className="mt-10 font-semibold text-[11px] text-azul-700 uppercase tracking-[0.22em]">
				{t(`proj.${project.id}.place` as MessageKey)}
			</p>
			<h1 className="mt-4 font-display text-[clamp(2.2rem,5vw,3.6rem)] text-abismo-900 leading-[1.08]">
				{project.state}
			</h1>
			<p className="mt-5 max-w-2xl text-abismo-800/75 text-lg leading-relaxed">
				{t(`proj.${project.id}.summary` as MessageKey)}
			</p>

			<nav
				aria-label={t("projects.eyebrow")}
				className="mt-10 flex flex-wrap gap-2"
			>
				{PROJECTS.map((other) => (
					<Link
						key={other.id}
						to={`/proyectos/${other.id}`}
						aria-current={other.id === project.id ? "page" : undefined}
						className={`rounded-full border px-4 py-2 font-semibold text-sm transition-colors ${
							other.id === project.id
								? "border-abismo-900 bg-abismo-900 text-white"
								: "border-abismo-900/15 text-abismo-800 hover:border-abismo-900"
						}`}
					>
						{other.state}
					</Link>
				))}
			</nav>

			<div className="mt-12 rounded-2xl bg-azul-50/60 p-6">
				<MexicoMap activeId={project.id} label={t("projects.map")} />
			</div>

			<p className="mt-10 rounded-xl border border-abismo-900/10 border-dashed p-6 text-abismo-800/60">
				{t("projects.soon")}
			</p>
		</article>
	);
}
