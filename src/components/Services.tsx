import * as Dialog from "@radix-ui/react-dialog";
import { useState } from "react";
import reefDivers from "../assets/reef-module-divers.jpg";
import { quoteMailto } from "../data/site";
import type { MessageKey } from "../i18n";
import { useT, useTList } from "../i18n";
import { useCursorSwallow, useCursorTarget } from "./cursor";
import { MarineField } from "./MarineField";
import { type IconName, ServiceIcon } from "./ServiceIcon";

/* `photo` is set only where SEASA has supplied real field evidence. Services without
   one keep the branded header; no stock imagery is ever substituted. */
const PHOTOS: Partial<Record<string, string>> = { reefs: reefDivers };

const SERVICES = [
	{ id: "mia", icon: "document" },
	{ id: "reefs", icon: "reef" },
	{ id: "ocean", icon: "sonar" },
	{ id: "hydro", icon: "river" },
	{ id: "coastal", icon: "coast" },
	{ id: "geo", icon: "contour" },
	{ id: "wildlife", icon: "sprout" },
	{ id: "energy", icon: "solar" },
] as const satisfies readonly { id: string; icon: IconName }[];

type Service = (typeof SERVICES)[number];
type ServiceId = Service["id"];
type Part = "name" | "summary" | "detail" | "points" | "cursor";

/* Declaring the return type as MessageKey is the whole safety mechanism: TypeScript
   expands the template literal across every id and part, so a missing dictionary entry
   fails the build instead of rendering an empty string. */
const msg = (id: ServiceId, part: Part): MessageKey => `svc.${id}.${part}`;

function Card({
	service,
	index,
	onOpen,
}: {
	service: Service;
	index: number;
	onOpen: () => void;
}) {
	const t = useT();
	const cursor = useCursorTarget({
		icon: <ServiceIcon name={service.icon} className="h-4 w-4" />,
		label: t(msg(service.id, "cursor")),
	});
	const swallow = useCursorSwallow();

	return (
		<article
			{...cursor}
			className="group flex grow basis-[19rem] flex-col rounded-2xl border border-abismo-900/10 bg-white p-6 transition-[border-color,box-shadow,transform] duration-300 hover:-translate-y-1 hover:border-marca-azul hover:shadow-[0_18px_40px_-24px_rgb(5_42_56/0.45)]"
		>
			<div className="flex items-start justify-between gap-4">
				<span className="grid h-11 w-11 place-content-center rounded-xl bg-azul-50 text-azul-700 transition-colors duration-300 group-hover:bg-marca-verde group-hover:text-abismo-900">
					<ServiceIcon name={service.icon} className="h-6 w-6" />
				</span>
				<span
					aria-hidden="true"
					className="font-display text-abismo-900/25 text-lg tabular-nums"
				>
					{String(index + 1).padStart(2, "0")}
				</span>
			</div>

			<h3 className="mt-5 text-balance font-display text-abismo-900 text-xl leading-snug">
				{t(msg(service.id, "name"))}
			</h3>
			<p className="mt-3 grow text-abismo-800/70 text-sm leading-relaxed">
				{t(msg(service.id, "summary"))}
			</p>

			<button
				type="button"
				onClick={onOpen}
				{...swallow}
				className="mt-6 inline-flex w-fit items-center gap-2 rounded-full border border-abismo-900/15 py-2 pr-4 pl-3 font-semibold text-abismo-900 text-sm transition-colors hover:border-abismo-900 hover:bg-abismo-900 hover:text-white"
			>
				<svg
					viewBox="0 0 24 24"
					fill="none"
					stroke="currentColor"
					strokeWidth={1.7}
					strokeLinecap="round"
					aria-hidden="true"
					className="h-4 w-4"
				>
					<circle cx="12" cy="12" r="9" />
					<path d="M12 11v5" />
					<path d="M12 8h.01" />
				</svg>
				{t("services.more")}
			</button>
		</article>
	);
}

export function Services() {
	const t = useT();
	const tList = useTList();
	const [openId, setOpenId] = useState<ServiceId | null>(null);
	const active = SERVICES.find((s) => s.id === openId) ?? null;

	return (
		<section
			id="servicios"
			className="relative isolate overflow-hidden bg-azul-50/50 py-24 sm:py-32"
		>
			<MarineField
				className="text-verde-800"
				items={[
					{ name: "coral", x: 4, y: 88, w: 14, rot: -4, op: 0.08, dur: 17 },
					{
						name: "coral",
						x: 96,
						y: 20,
						w: 9,
						rot: 6,
						flip: true,
						op: 0.06,
						dur: 14,
						delay: 2,
					},
					{
						name: "fish",
						x: 90,
						y: 74,
						w: 8,
						rot: -5,
						flip: true,
						op: 0.07,
						dur: 12,
						delay: 1.2,
					},
					{
						name: "wave",
						x: 22,
						y: 12,
						w: 6,
						op: 0.06,
						dur: 16,
						delay: 3,
						lgOnly: true,
					},
				]}
			/>

			<div className="mx-auto max-w-6xl px-5 sm:px-8">
				<div className="max-w-3xl">
					<p className="font-semibold text-[11px] text-azul-700 uppercase tracking-[0.22em]">
						{t("services.eyebrow")}
					</p>
					<h2 className="mt-5 text-balance font-display text-[clamp(1.9rem,3.6vw,2.9rem)] text-abismo-900 leading-[1.12]">
						{t("services.title")}
					</h2>
					<p className="mt-6 text-abismo-800/70 text-lg leading-relaxed">
						{t("services.lead")}
					</p>
				</div>

				<div className="mt-14 flex flex-wrap gap-5">
					{SERVICES.map((service, i) => (
						<Card
							key={service.id}
							service={service}
							index={i}
							onOpen={() => setOpenId(service.id)}
						/>
					))}
				</div>
			</div>

			{/* One Dialog for eight cards: the open service is state, so there is a single
			    portal, overlay and focus trap rather than eight idle copies. */}
			<Dialog.Root
				open={active !== null}
				onOpenChange={(next) => !next && setOpenId(null)}
			>
				<Dialog.Portal>
					<Dialog.Overlay className="fixed inset-0 z-50 bg-abismo-900/70 backdrop-blur-sm data-[state=open]:animate-[fade-in_0.2s_ease-out]" />
					<Dialog.Content className="-translate-x-1/2 -translate-y-1/2 fixed top-1/2 left-1/2 z-50 max-h-[88svh] w-[min(38rem,calc(100vw-2rem))] overflow-y-auto rounded-2xl bg-white shadow-2xl data-[state=open]:animate-[modal-in_0.25s_cubic-bezier(0.2,0.7,0.3,1)]">
						{active && (
							<>
								{/* Photo and header are one block, not two. The photo is the header's
								    background with a scrim over it, so there is no orphaned white caption
								    strip between them and the modal reads as image then body. */}
								{/* No radius of its own. Dialog.Content is already rounded and clips (it has
								    overflow-y-auto), so rounding this too draws a second curve a hair
								    inside the first and the parent's white shows through the gap. */}
								<div className="relative overflow-hidden bg-abismo-900">
									{PHOTOS[active.id] ? (
										<>
											<img
												src={PHOTOS[active.id]}
												// Decorative here: the visible caption below carries the
												// description, so a duplicate alt would just be read twice.
												alt=""
												loading="lazy"
												decoding="async"
												className="absolute inset-0 h-full w-full object-cover"
											/>
											{/* Opaque at the bottom where the title sits, so white text keeps
											    its contrast whatever the photo is doing. */}
											<div
												aria-hidden="true"
												className="photo-scrim absolute inset-0"
											/>
										</>
									) : (
										<div
											aria-hidden="true"
											className="absolute inset-0 bg-[radial-gradient(70%_120%_at_85%_10%,rgba(164,200,66,0.28),transparent_65%),radial-gradient(60%_100%_at_10%_90%,rgba(138,206,244,0.3),transparent_65%)]"
										/>
									)}

									{/* pt-44 only when there is a photo: that is the band of image left
									    visible above the text. */}
									<div
										className={`relative px-7 pb-7 ${PHOTOS[active.id] ? "pt-44" : "pt-8"}`}
									>
										<div className="flex items-start gap-5">
											<span className="grid h-14 w-14 shrink-0 place-content-center rounded-xl bg-white/10 text-marca-verde backdrop-blur-sm">
												<ServiceIcon name={active.icon} className="h-8 w-8" />
											</span>
											<div>
												<Dialog.Title className="text-balance font-display text-2xl text-white leading-snug">
													{t(msg(active.id, "name"))}
												</Dialog.Title>
												<Dialog.Description className="mt-2 text-sm text-white/70 leading-relaxed">
													{t(msg(active.id, "summary"))}
												</Dialog.Description>
											</div>
										</div>
										{PHOTOS[active.id] && (
											<p className="mt-5 border-white/15 border-t pt-3 text-[11px] text-white/55 leading-relaxed">
												{t("photo.divers")}
											</p>
										)}
									</div>
								</div>

								<div className="px-7 py-7">
									<p className="text-abismo-800/80 leading-relaxed">
										{t(msg(active.id, "detail"))}
									</p>

									<h4 className="mt-8 font-semibold text-[11px] text-abismo-800/60 uppercase tracking-[0.22em]">
										{t("services.includes")}
									</h4>
									<ul className="mt-4 grid gap-2.5 sm:grid-cols-2">
										{tList(msg(active.id, "points")).map((point) => (
											<li key={point} className="flex gap-2.5 text-sm">
												<span
													aria-hidden="true"
													className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-marca-verde"
												/>
												<span className="text-abismo-800/80 leading-relaxed">
													{point}
												</span>
											</li>
										))}
									</ul>

									<div className="mt-8 flex flex-wrap gap-3">
										<Dialog.Close asChild>
											<a
												href={quoteMailto(t("contact.subject"))}
												className="rounded-full bg-abismo-900 px-5 py-2.5 font-semibold text-sm text-white transition-colors hover:bg-azul-800"
											>
												{t("nav.contact")}
											</a>
										</Dialog.Close>
										<Dialog.Close className="rounded-full border border-abismo-900/15 px-5 py-2.5 font-semibold text-abismo-900 text-sm transition-colors hover:border-abismo-900">
											{t("services.close")}
										</Dialog.Close>
									</div>
								</div>
							</>
						)}
					</Dialog.Content>
				</Dialog.Portal>
			</Dialog.Root>
		</section>
	);
}
