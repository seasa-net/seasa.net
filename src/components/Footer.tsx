import { Link } from "react-router-dom";
import { SITE } from "../data/site";
import type { MessageKey } from "../i18n";
import { useT } from "../i18n";
import { LangSwitch } from "./LangSwitch";
import { Logo } from "./Logo";

const SITEMAP: { to: string; key: MessageKey }[] = [
	{ to: "/", key: "footer.home" },
	{ to: "/#nosotros", key: "nav.about" },
	{ to: "/#servicios", key: "nav.services" },
	{ to: "/#proyectos", key: "nav.projects" },
	{ to: "/#laboratorio", key: "nav.lab" },
	{ to: "/laboratorio", key: "footer.labPage" },
];

const LEGAL_LINKS: { to: string; key: MessageKey }[] = [
	{ to: "/aviso-de-privacidad", key: "footer.privacy" },
	{ to: "/terminos-y-condiciones", key: "footer.terms" },
];

function Column({
	title,
	links,
}: {
	title: string;
	links: { to: string; key: MessageKey }[];
}) {
	const t = useT();
	return (
		<div>
			<h3 className="font-semibold text-[11px] text-white/50 uppercase tracking-[0.22em]">
				{title}
			</h3>
			<ul className="mt-4 space-y-2.5">
				{links.map(({ to, key }) => (
					<li key={to}>
						<Link
							to={to}
							className="text-sm text-white/75 transition-colors hover:text-marca-verde"
						>
							{t(key)}
						</Link>
					</li>
				))}
			</ul>
		</div>
	);
}

export function Footer() {
	const t = useT();

	return (
		<footer className="bg-abismo-900 text-white">
			<div className="mx-auto max-w-6xl px-5 py-16 sm:px-8 sm:py-20">
				<div className="grid gap-12 sm:grid-cols-2 lg:grid-cols-[1.4fr_1fr_1fr_1fr]">
					<div>
						<Link
							to="/"
							className="flex items-center gap-2.5 font-display text-xl tracking-[0.12em]"
						>
							<Logo animated className="h-8 w-8" />
							{SITE.shortName}
						</Link>
						<p className="mt-4 max-w-xs text-sm text-white/60 leading-relaxed">
							{SITE.legalName}
						</p>
						<p className="mt-4 text-sm text-white/60">{t("footer.tagline")}</p>

						{/* Same component as the header: it styles from `currentColor`, so it
						    reads correctly on dark without a variant. */}
						<LangSwitch className="mt-6" />
					</div>

					<Column title={t("footer.sitemap")} links={SITEMAP} />

					<div>
						<h3 className="font-semibold text-[11px] text-white/50 uppercase tracking-[0.22em]">
							{t("footer.contact")}
						</h3>
						<ul className="mt-4 space-y-2.5 text-sm">
							<li>
								<a
									href={`mailto:${SITE.email}`}
									className="text-white/75 transition-colors hover:text-marca-verde"
								>
									{SITE.email}
								</a>
							</li>
							<li className="text-white/60">
								{t("footer.phone")}:{" "}
								<a
									href={`tel:${SITE.phoneOffice.replace(/\s/g, "")}`}
									className="text-white/75 transition-colors hover:text-marca-verde"
								>
									{SITE.phoneOffice}
								</a>
							</li>
							<li className="text-white/60">
								{t("footer.mobile")}:{" "}
								<a
									href={`tel:${SITE.phoneMobile.replace(/\s/g, "")}`}
									className="text-white/75 transition-colors hover:text-marca-verde"
								>
									{SITE.phoneMobile}
								</a>
							</li>
							<li className="text-white/60">{SITE.address}</li>
							<li className="text-white/60">
								{t("footer.offices")}: {SITE.branches.join(" · ")}
							</li>
							<li>
								<a
									href={SITE.github}
									target="_blank"
									rel="noreferrer"
									className="inline-flex items-center gap-2 text-white/75 transition-colors hover:text-marca-verde"
								>
									<svg
										viewBox="0 0 16 16"
										fill="currentColor"
										aria-hidden="true"
										className="h-4 w-4"
									>
										<path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82a7.4 7.4 0 0 1 2-.27c.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.01 8.01 0 0 0 16 8c0-4.42-3.58-8-8-8z" />
									</svg>
									GitHub
								</a>
							</li>
						</ul>
					</div>

					<Column title={t("footer.legal")} links={LEGAL_LINKS} />
				</div>

				<div className="mt-14 flex flex-col gap-3 border-white/10 border-t pt-6 text-white/45 text-xs sm:flex-row sm:items-center sm:justify-between">
					<p>
						© {new Date().getFullYear()} {SITE.legalName}
					</p>
					<p>{SITE.domain}</p>
				</div>
			</div>
		</footer>
	);
}
