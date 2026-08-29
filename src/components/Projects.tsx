import { useState } from "react";
import { Link } from "react-router-dom";
import coralColony from "../assets/coral-colony.jpg";
import reefAerial from "../assets/reef-line-aerial.jpg";
import reefDivers from "../assets/reef-module-divers.jpg";
import { PROJECTS, type ProjectId } from "../data/projects";
import type { MessageKey } from "../i18n";
import { useT } from "../i18n";
import { MarineField } from "./MarineField";
import { MexicoMap } from "./MexicoMap";
import { PhotoCarousel } from "./PhotoCarousel";

const msg = (id: ProjectId, part: "place" | "summary"): MessageKey =>
	`proj.${id}.${part}`;

export function Projects() {
	const t = useT();
	const [activeId, setActiveId] = useState<ProjectId>(PROJECTS[0].id);

	return (
		<section
			id="proyectos"
			className="relative isolate overflow-hidden bg-white py-24 sm:py-32"
		>
			{/* Background texture, decorative and well under the text contrast floor. */}
			<MarineField
				className="text-azul-700"
				items={[
					{
						name: "fish",
						x: 94,
						y: 16,
						w: 20,
						rot: -6,
						flip: true,
						op: 0.07,
						dur: 15,
					},
					{
						name: "fish",
						x: 84,
						y: 26,
						w: 11,
						rot: 4,
						flip: true,
						op: 0.05,
						dur: 12,
						delay: 1.8,
					},
					{
						name: "dolphin",
						x: 6,
						y: 62,
						w: 16,
						rot: 7,
						op: 0.06,
						dur: 18,
						delay: 2.5,
					},
					{
						name: "coral",
						x: 16,
						y: 94,
						w: 8,
						rot: -3,
						op: 0.06,
						dur: 14,
						delay: 0.6,
					},
					{
						name: "wave",
						x: 60,
						y: 6,
						w: 6,
						op: 0.05,
						dur: 13,
						delay: 3.4,
						lgOnly: true,
					},
				]}
			/>

			<div className="mx-auto max-w-6xl px-5 sm:px-8">
				<div className="max-w-3xl">
					<p className="font-semibold text-[11px] text-azul-700 uppercase tracking-[0.22em]">
						{t("projects.eyebrow")}
					</p>
					<h2 className="mt-5 text-balance font-display text-[clamp(1.9rem,3.6vw,2.9rem)] text-abismo-900 leading-[1.12]">
						{t("projects.title")}
					</h2>
					<p className="mt-6 text-abismo-800/70 text-lg leading-relaxed">
						{t("projects.lead")}
					</p>
				</div>

				<div className="mt-14 grid items-start gap-10 lg:grid-cols-[1.05fr_1fr] lg:gap-16">
					<div className="rounded-2xl bg-azul-50/60 p-4 sm:p-6 lg:sticky lg:top-28">
						<MexicoMap
							activeId={activeId}
							label={t("projects.map")}
							onSelect={setActiveId}
						/>
					</div>

					<ul className="flex flex-col">
						{PROJECTS.map((project) => {
							const open = project.id === activeId;
							return (
								<li
									key={project.id}
									// Hover drives it on desktop; focus covers the keyboard and
									// click covers touch, where hover does not exist.
									onPointerEnter={() => setActiveId(project.id)}
									onFocus={() => setActiveId(project.id)}
									className="border-abismo-900/10 border-b"
								>
									<button
										type="button"
										onClick={() => setActiveId(project.id)}
										aria-expanded={open}
										className="flex w-full items-center gap-4 py-5 text-left"
									>
										<span
											aria-hidden="true"
											className={`h-2 w-2 shrink-0 rounded-full transition-colors duration-300 ${
												open ? "bg-marca-verde" : "bg-abismo-900/20"
											}`}
										/>
										<span
											className={`grow font-display text-xl transition-colors duration-300 sm:text-2xl ${
												open ? "text-abismo-900" : "text-abismo-900/45"
											}`}
										>
											{project.state}
										</span>
										<span className="shrink-0 font-semibold text-[11px] text-abismo-800/50 uppercase tracking-[0.16em]">
											{t(msg(project.id, "place"))}
										</span>
									</button>

									{/* grid-rows 0fr -> 1fr animates to the content's natural height,
									    which plain CSS cannot do with height: auto. */}
									<div
										className={`grid transition-[grid-template-rows,opacity] duration-400 ease-out ${
											open
												? "grid-rows-[1fr] opacity-100"
												: "grid-rows-[0fr] opacity-0"
										}`}
									>
										<div className="overflow-hidden">
											<div className="pb-6 pl-6">
												<p className="text-abismo-800/75 leading-relaxed">
													{t(msg(project.id, "summary"))}
												</p>
												<Link
													to={`/proyectos/${project.id}`}
													tabIndex={open ? undefined : -1}
													className="mt-5 inline-flex items-center gap-2 rounded-full bg-abismo-900 px-5 py-2.5 font-semibold text-sm text-white transition-colors hover:bg-azul-800"
												>
													{t("projects.explore")}
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
									</div>
								</li>
							);
						})}
					</ul>
				</div>

				{/* After the map, not before it: the evidence follows the claim rather than
				    interrupting the heading. */}
				<div className="mt-16">
					<PhotoCarousel
						label={t("gallery.label")}
						prevLabel={t("gallery.prev")}
						nextLabel={t("gallery.next")}
						photos={[
							{
								src: reefAerial,
								alt: t("photo.aerial"),
								caption: t("photo.aerial"),
								width: 2178,
								height: 1247,
							},
							{
								src: reefDivers,
								alt: t("photo.divers"),
								caption: t("photo.divers"),
								width: 1280,
								height: 706,
							},
							{
								src: coralColony,
								alt: t("photo.coral"),
								caption: t("photo.coral"),
								width: 960,
								height: 1280,
							},
						]}
					/>
				</div>
			</div>
		</section>
	);
}
