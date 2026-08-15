import { create } from "zustand";

export const LOCALES = ["es", "en"] as const;
export type Locale = (typeof LOCALES)[number];

/* Spanish is the source language: `en` is typed against it, so a missing or
   stray English key is a compile error rather than a blank string in production. */
const es = {
	"nav.about": "Nosotros",
	"nav.services": "Servicios",
	"nav.projects": "Proyectos",
	"nav.reefs": "Arrecifes Azteca",
	"nav.contact": "Cotizar",
	"nav.menu": "Abrir menú",
	"nav.close": "Cerrar menú",
	"nav.sections": "Secciones",
	"lang.label": "Idioma",
	"hero.eyebrow": "Consultoría ambiental · Restauración marina · Energía",
	"hero.title": "Soluciones ambientales que se comprueban en campo.",
	"hero.lead":
		"Manifestaciones de impacto ambiental, arrecifes artificiales, oceanografía, hidrología y sistemas de energía alternativa. Ejecución técnica verificable en el litoral mexicano.",
	"hero.cta.primary": "Solicitar cotización",
	"hero.cta.secondary": "Ver proyectos",
	"hero.stat.years": "años de ejecución técnica",
	"hero.stat.states": "estados con proyectos",
	"hero.stat.modules": "módulos arrecifales instalados",
	"skip.content": "Saltar al contenido",
} as const;

const en: Record<keyof typeof es, string> = {
	"nav.about": "About",
	"nav.services": "Services",
	"nav.projects": "Projects",
	"nav.reefs": "Azteca Reefs",
	"nav.contact": "Get a quote",
	"nav.menu": "Open menu",
	"nav.close": "Close menu",
	"nav.sections": "Sections",
	"lang.label": "Language",
	"hero.eyebrow": "Environmental consulting · Marine restoration · Energy",
	"hero.title": "Environmental solutions proven in the field.",
	"hero.lead":
		"Environmental impact statements, artificial reefs, oceanography, hydrology and alternative energy systems. Verifiable technical delivery across the Mexican coastline.",
	"hero.cta.primary": "Request a quote",
	"hero.cta.secondary": "View projects",
	"hero.stat.years": "years of field execution",
	"hero.stat.states": "states with active projects",
	"hero.stat.modules": "reef modules installed",
	"skip.content": "Skip to content",
};

const dict = { es, en };
export type MessageKey = keyof typeof es;

function isLocale(value: string | null): value is Locale {
	return LOCALES.includes(value as Locale);
}

/* URL wins over storage so a shared link always opens in the language it was shared in.
   ponytail: `?lang=` keeps this router-free on static hosting. Move to /es/ + /en/ path
   prefixes when a router lands — path prefixes index better and are what BRAND.md wants. */
function initialLocale(): Locale {
	const fromUrl = new URLSearchParams(window.location.search).get("lang");
	if (isLocale(fromUrl)) return fromUrl;
	try {
		const stored = localStorage.getItem("seasa:locale");
		if (isLocale(stored)) return stored;
	} catch {
		// storage blocked; fall through to the browser preference
	}
	return navigator.language.startsWith("en") ? "en" : "es";
}

function persist(locale: Locale) {
	document.documentElement.lang = locale;
	try {
		localStorage.setItem("seasa:locale", locale);
	} catch {
		// storage blocked; the choice just will not survive a reload
	}
	const url = new URL(window.location.href);
	url.searchParams.set("lang", locale);
	window.history.replaceState(null, "", url);
}

type LocaleStore = {
	locale: Locale;
	setLocale: (locale: Locale) => void;
};

export const useLocaleStore = create<LocaleStore>((set) => {
	const locale = initialLocale();
	document.documentElement.lang = locale;
	return {
		locale,
		setLocale: (next) => {
			persist(next);
			set({ locale: next });
		},
	};
});

/** `const t = useT()` then `t("nav.about")`. Keys are checked at compile time. */
export function useT() {
	const locale = useLocaleStore((s) => s.locale);
	return (key: MessageKey) => dict[locale][key];
}
