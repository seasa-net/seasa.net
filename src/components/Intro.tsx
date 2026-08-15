import { useEffect, useState } from "react";
import { Logo } from "./Logo";

const KEY = "seasa:intro-seen";
const DAY = 86_400_000;
const HOLD = 2200; // curtain sits before it starts leaving
const FADE = 600; // keep in sync with duration-[600ms] below

function seenRecently() {
	try {
		const at = Number(localStorage.getItem(KEY));
		return at > 0 && Date.now() - at < DAY;
	} catch {
		return false; // private mode / storage blocked: just play the intro
	}
}

function skipIntro() {
	return (
		window.matchMedia("(prefers-reduced-motion: reduce)").matches ||
		seenRecently()
	);
}

export default function Intro() {
	// Resolved during the first render so returning visitors never see a flash.
	const [phase, setPhase] = useState<"shown" | "leaving" | "gone">(() =>
		skipIntro() ? "gone" : "shown",
	);

	useEffect(() => {
		if (phase !== "shown") return;
		const leave = () => setPhase("leaving");
		const timer = setTimeout(leave, HOLD);
		const onKey = (e: KeyboardEvent) => {
			if (e.key === "Escape") leave();
		};
		window.addEventListener("keydown", onKey);
		window.addEventListener("pointerdown", leave);
		return () => {
			clearTimeout(timer);
			window.removeEventListener("keydown", onKey);
			window.removeEventListener("pointerdown", leave);
		};
	}, [phase]);

	useEffect(() => {
		if (phase !== "leaving") return;
		try {
			localStorage.setItem(KEY, String(Date.now()));
		} catch {
			// storage blocked; the intro will simply play again next visit
		}
		const timer = setTimeout(() => setPhase("gone"), FADE);
		return () => clearTimeout(timer);
	}, [phase]);

	if (phase === "gone") return null;

	return (
		// Decorative: the real page is already in the DOM underneath and reachable
		// by assistive tech, so the curtain stays out of the accessibility tree.
		<div
			aria-hidden="true"
			className={`fixed inset-0 z-50 bg-[radial-gradient(120%_100%_at_50%_0%,var(--color-azul-50)_0%,#fff_55%)] transition-opacity duration-[600ms] ease-out ${
				phase === "leaving" ? "pointer-events-none opacity-0" : "opacity-100"
			}`}
		>
			<p className="intro-rise absolute top-5 right-5 flex items-center gap-2 text-abismo-800/70 text-[11px] uppercase tracking-[0.16em] sm:top-8 sm:right-8 sm:text-xs [animation-delay:0.4s]">
				<span>
					Orgullosamente <span className="text-abismo-900">100% mexicana</span>
				</span>
				<svg
					viewBox="0 0 28 16"
					className="h-3.5 w-6 rounded-[2px] ring-1 ring-abismo-900/10"
				>
					<title>Bandera de México</title>
					<rect width="28" height="16" fill="#fff" />
					<rect width="9.34" height="16" fill="#006847" />
					<rect x="18.66" width="9.34" height="16" fill="#ce1126" />
					<ellipse cx="14" cy="8" rx="2.4" ry="2.9" fill="#7d6a3a" />
				</svg>
			</p>

			<div className="grid h-full place-content-center justify-items-center gap-7 px-6">
				<Logo
					animated
					className="intro-seal h-28 w-28 drop-shadow-[0_8px_24px_rgba(5,42,56,0.12)] sm:h-32 sm:w-32"
				/>

				<div className="text-center">
					<p className="intro-rise font-display text-5xl text-abismo-900 leading-none tracking-[0.14em] sm:text-6xl [animation-delay:0.85s]">
						SEASA
					</p>
					<p className="intro-rise mt-3 text-abismo-800/60 text-[11px] uppercase tracking-[0.28em] sm:text-xs [animation-delay:1.05s]">
						Soluciones Ambientales
					</p>
				</div>

				<div className="intro-rise w-44 [animation-delay:1.2s]">
					<div className="h-px w-full overflow-hidden bg-abismo-900/10">
						<div className="intro-bar h-full w-full bg-linear-to-r from-azul-700 to-verde-500" />
					</div>
					<p className="mt-3 text-center text-abismo-800/45 text-[10px] uppercase tracking-[0.3em]">
						Cargando
					</p>
				</div>
			</div>
		</div>
	);
}
