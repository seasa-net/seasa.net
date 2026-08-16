import * as Dialog from "@radix-ui/react-dialog";
import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import type { MessageKey } from "../i18n";
import { useT } from "../i18n";
import { LangSwitch } from "./LangSwitch";
import { Logo } from "./Logo";

const NAV: { href: string; key: MessageKey }[] = [
	{ href: "/#nosotros", key: "nav.about" },
	{ href: "/#servicios", key: "nav.services" },
	{ href: "/#proyectos", key: "nav.projects" },
	{ href: "/#laboratorio", key: "nav.lab" },
];

/** True once the hero no longer sits behind the bar. */
function useScrolled(threshold = 24) {
	const [scrolled, setScrolled] = useState(false);
	useEffect(() => {
		const onScroll = () => setScrolled(window.scrollY > threshold);
		onScroll();
		window.addEventListener("scroll", onScroll, { passive: true });
		return () => window.removeEventListener("scroll", onScroll);
	}, [threshold]);
	return scrolled;
}

export function Header() {
	const t = useT();
	const scrolled = useScrolled();
	const { pathname } = useLocation();
	// Only the home route puts a dark hero behind the bar. Everywhere else the page
	// starts on white, so a transparent header with white text was invisible until you
	// scrolled. Transparency is a property of what is underneath, not of scroll alone.
	const solid = scrolled || pathname !== "/";
	const [open, setOpen] = useState(false);

	return (
		<header
			className={`fixed inset-x-0 top-0 z-40 transition-colors duration-300 ${
				solid
					? "border-abismo-900/10 border-b bg-white/85 text-abismo-900 backdrop-blur-md"
					: "border-transparent border-b bg-transparent text-white"
			}`}
		>
			<div className="mx-auto flex h-16 max-w-6xl items-center gap-6 px-5 sm:h-20 sm:px-8">
				<Link
					to="/"
					className="flex shrink-0 items-center gap-2.5 rounded-sm font-display text-xl tracking-[0.12em]"
				>
					<Logo animated className="h-8 w-8" />
					SEASA
				</Link>

				<nav
					aria-label={t("nav.sections")}
					className="ml-auto hidden items-center gap-7 lg:flex"
				>
					{NAV.map(({ href, key }) => (
						<Link
							key={href}
							to={href}
							className="font-medium text-[15px] text-current/75 transition-colors hover:text-current"
						>
							{t(key)}
						</Link>
					))}
				</nav>

				<div className="ml-auto flex items-center gap-3 lg:ml-0">
					<LangSwitch />

					<Link
						to="/#contacto"
						className={`hidden rounded-full px-4 py-2 font-semibold text-sm transition-colors sm:inline-block ${
							solid
								? "bg-abismo-900 text-white hover:bg-azul-800"
								: "bg-marca-verde text-abismo-900 hover:bg-verde-400"
						}`}
					>
						{t("nav.contact")}
					</Link>

					<Dialog.Root open={open} onOpenChange={setOpen}>
						<Dialog.Trigger
							aria-label={t("nav.menu")}
							className="-mr-2 grid h-10 w-10 place-content-center gap-[5px] rounded-full lg:hidden"
						>
							<span className="block h-px w-5 bg-current" />
							<span className="block h-px w-5 bg-current" />
							<span className="block h-px w-5 bg-current" />
						</Dialog.Trigger>

						{/* Radix handles the focus trap, scroll lock, Escape and aria wiring:
						    the parts of a mobile menu that are easy to get subtly wrong. */}
						<Dialog.Portal>
							<Dialog.Overlay className="fixed inset-0 z-50 bg-abismo-900/40 backdrop-blur-sm data-[state=open]:animate-[fade-in_0.2s_ease-out]" />
							<Dialog.Content className="fixed inset-y-0 right-0 z-50 flex w-[min(20rem,85vw)] flex-col gap-8 bg-white p-7 text-abismo-900 shadow-2xl data-[state=open]:animate-[panel-in_0.28s_cubic-bezier(0.2,0.7,0.3,1)]">
								<Dialog.Title className="sr-only">
									{t("nav.sections")}
								</Dialog.Title>
								<Dialog.Close
									aria-label={t("nav.close")}
									className="-mr-1 ml-auto grid h-9 w-9 place-content-center rounded-full text-2xl leading-none text-abismo-800/60 hover:text-abismo-900"
								>
									×
								</Dialog.Close>

								<nav className="flex flex-col gap-1">
									{NAV.map(({ href, key }) => (
										<Dialog.Close asChild key={href}>
											<a
												href={href}
												className="border-abismo-900/8 border-b py-3 font-display text-2xl"
											>
												{t(key)}
											</a>
										</Dialog.Close>
									))}
								</nav>

								<Dialog.Close asChild>
									<Link
										to="/#contacto"
										className="rounded-full bg-abismo-900 px-5 py-3 text-center font-semibold text-white"
									>
										{t("nav.contact")}
									</Link>
								</Dialog.Close>
							</Dialog.Content>
						</Dialog.Portal>
					</Dialog.Root>
				</div>
			</div>
		</header>
	);
}
