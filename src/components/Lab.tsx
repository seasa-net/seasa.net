import { Link } from "react-router-dom";
import type { MessageKey } from "../i18n";
import { useT } from "../i18n";
import { MarineField } from "./MarineField";
import { type IconName, ServiceIcon } from "./ServiceIcon";

/* The short code is the mark here, as in the original brief. The icon supports it
   rather than replacing it, so the panel reads at a glance without eight words. */
const TOOLS = [
	{ id: "3d", code: "3D", icon: "cube" },
	{ id: "gis", code: "GIS", icon: "layers" },
	{ id: "360", code: "360", icon: "panorama" },
	{ id: "pdf", code: "PDF", icon: "download" },
] as const satisfies readonly { id: string; code: string; icon: IconName }[];

type ToolId = (typeof TOOLS)[number]["id"];

const msg = (id: ToolId, part: "name" | "body"): MessageKey =>
	`lab.${id}.${part}`;

export function Lab() {
	const t = useT();

	return (
		<section id="laboratorio" className="bg-white pb-24 sm:pb-32">
			<div className="mx-auto max-w-6xl px-5 sm:px-8">
				{/* A single dark panel rather than a full-bleed section: this is a taste of
				    the lab, not a chapter, and BRAND.md puts the brand at its loudest on
				    abismo-900. */}
				<div className="relative isolate overflow-hidden rounded-3xl bg-abismo-900 px-6 py-12 text-white sm:px-10 sm:py-14">
					<div
						aria-hidden="true"
						className="-z-10 absolute inset-0 bg-[radial-gradient(60%_100%_at_12%_0%,rgba(164,200,66,0.2),transparent_65%),radial-gradient(55%_100%_at_88%_100%,rgba(138,206,244,0.24),transparent_65%)]"
					/>
					<MarineField
						className="text-marca-azul"
						items={[
							{ name: "wave", x: 93, y: 82, w: 9, op: 0.14, dur: 13 },
							{
								name: "fish",
								x: 84,
								y: 22,
								w: 7,
								rot: -6,
								flip: true,
								op: 0.12,
								dur: 11,
								delay: 1.4,
							},
							{
								name: "coral",
								x: 8,
								y: 86,
								w: 7,
								rot: 3,
								op: 0.1,
								dur: 16,
								delay: 2.6,
							},
						]}
					/>

					<div className="max-w-2xl">
						<p className="font-semibold text-[11px] text-marca-azul uppercase tracking-[0.22em]">
							{t("lab.eyebrow")}
						</p>
						<h2 className="mt-4 text-balance font-display text-[clamp(1.7rem,3vw,2.4rem)] leading-[1.15]">
							{t("lab.title")}
						</h2>
						<p className="mt-5 text-white/70 leading-relaxed">
							{t("lab.lead")}
						</p>
					</div>

					<ul className="mt-10 grid gap-x-8 gap-y-8 sm:grid-cols-2 lg:grid-cols-4">
						{TOOLS.map((tool) => (
							<li key={tool.id} className="border-white/15 border-t pt-5">
								<div className="flex items-center gap-3">
									<span className="font-display text-2xl text-marca-verde leading-none">
										{tool.code}
									</span>
									<ServiceIcon
										name={tool.icon}
										className="h-5 w-5 text-white/45"
									/>
								</div>
								<h3 className="mt-3 font-semibold text-[15px]">
									{t(msg(tool.id, "name"))}
								</h3>
								<p className="mt-1.5 text-sm text-white/60 leading-relaxed">
									{t(msg(tool.id, "body"))}
								</p>
							</li>
						))}
					</ul>

					<Link
						to="/laboratorio"
						className="mt-10 inline-flex items-center gap-2 rounded-full bg-marca-verde px-5 py-3 font-semibold text-abismo-900 text-sm transition-colors hover:bg-verde-400"
					>
						{t("lab.cta")}
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
							<path d="M5 12h14" />
							<path d="m13 6 6 6-6 6" />
						</svg>
					</Link>
				</div>
			</div>
		</section>
	);
}
