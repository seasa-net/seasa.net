import * as Dialog from "@radix-ui/react-dialog";
import { useEffect, useState } from "react";
import type { MessageKey } from "../i18n";
import { useT } from "../i18n";
import { LangSwitch } from "./LangSwitch";
import { Logo } from "./Logo";

const NAV: { href: string; key: MessageKey }[] = [
	{ href: "#nosotros", key: "nav.about" },
	{ href: "#servicios", key: "nav.services" },
	{ href: "#proyectos", key: "nav.projects" },
	{ href: "#arrecifes", key: "nav.reefs" },
];

/** True once the hero no longer sits behind the bar, so the header can go from
    transparent-over-hero to an opaque light bar over the rest of the page. */
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
	const [open, setOpen] = useState(false);

	return (
		<header
			className={`fixed inset-x-0 top-0 z-40 transition-colors duration-300 ${
				scrolled
					? "border-abismo-900/10 border-b bg-white/85 text-abismo-900 backdrop-blur-md"
					: "border-transparent border-b bg-transparent text-white"
			}`}
		>
			<div className="mx-auto flex h-16 max-w-6xl items-center gap-6 px-5 sm:h-20 sm:px-8">
				<a
					href="#inicio"
					className="flex shrink-0 items-center gap-2.5 rounded-sm font-display text-xl tracking-[0.12em]"
				>
					<Logo animated className="h-8 w-8" />
					SEASA
				</a>

				<nav
					aria-label={t("nav.sections")}
					className="ml-auto hidden items-center gap-7 lg:flex"
				>
					{NAV.map(({ href, key }) => (
						<a
							key={href}
							href={href}
							className="font-medium text-[15px] text-current/75 transition-colors hover:text-current"
						>
							{t(key)}
						</a>
					))}
				</nav>

				<div className="ml-auto flex items-center gap-3 lg:ml-0">
					<LangSwitch />

					<a
						href="#contacto"
						className={`hidden rounded-full px-4 py-2 font-semibold text-sm transition-colors sm:inline-block ${
							scrolled
								? "bg-abismo-900 text-white hover:bg-azul-800"
								: "bg-marca-verde text-abismo-900 hover:bg-verde-400"
						}`}
					>
						{t("nav.contact")}
					</a>

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
									<a
										href="#contacto"
										className="rounded-full bg-abismo-900 px-5 py-3 text-center font-semibold text-white"
									>
										{t("nav.contact")}
									</a>
								</Dialog.Close>
							</Dialog.Content>
						</Dialog.Portal>
					</Dialog.Root>
				</div>
			</div>
		</header>
	);
}
