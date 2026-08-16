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
	"about.eyebrow": "Nosotros",
	"about.title": "Ingeniería, ciencia y ejecución en un mismo equipo.",
	"about.lead":
		"SEASA reúne consultoría ambiental, ciencia costera y obra en campo bajo una sola dirección técnica. Un estudio, el permiso que lo acompaña y la restauración que sigue responden al mismo criterio y a la misma evidencia.",
	"about.mission.label": "Misión",
	"about.mission.body":
		"Diseñar, gestionar y ejecutar soluciones ambientales técnicamente sólidas que contribuyan al cumplimiento normativo, la restauración ecológica y el desarrollo sostenible.",
	"about.vision.label": "Visión",
	"about.vision.body":
		"Ser referente nacional en consultoría ambiental, restauración marina, ingeniería costera y tecnologías aplicadas al monitoreo de ecosistemas.",
	"about.values.label": "Valores",
	"about.value.rigor": "Rigor técnico",
	"about.value.rigor.body":
		"Metodología documentada y datos reproducibles en cada entrega.",
	"about.value.transparency": "Transparencia",
	"about.value.transparency.body":
		"Alcances, tiempos y limitaciones declarados desde la propuesta.",
	"about.value.responsibility": "Responsabilidad ambiental",
	"about.value.responsibility.body":
		"El cumplimiento normativo es el piso del trabajo, no la meta.",
	"about.value.innovation": "Innovación aplicada",
	"about.value.innovation.body":
		"Fotogrametría, modelación y monitoreo al servicio del proyecto, no del catálogo.",
	"about.value.social": "Compromiso social",
	"about.value.social.body":
		"Trabajo con las comunidades costeras y pesqueras, no por encima de ellas.",
	"about.value.results": "Resultados verificables",
	"about.value.results.body":
		"Monitoreo posterior que demuestra el efecto ecológico logrado.",
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
	"about.eyebrow": "About us",
	"about.title": "Engineering, science and execution in one team.",
	"about.lead":
		"SEASA brings environmental consulting, coastal science and field execution under a single technical direction. A study, the permit that accompanies it and the restoration that follows answer to the same criteria and the same evidence.",
	"about.mission.label": "Mission",
	"about.mission.body":
		"To design, manage and execute technically sound environmental solutions that advance regulatory compliance, ecological restoration and sustainable development.",
	"about.vision.label": "Vision",
	"about.vision.body":
		"To be the national reference in environmental consulting, marine restoration, coastal engineering and applied ecosystem-monitoring technology.",
	"about.values.label": "Values",
	"about.value.rigor": "Technical rigour",
	"about.value.rigor.body":
		"Documented methodology and reproducible data in every deliverable.",
	"about.value.transparency": "Transparency",
	"about.value.transparency.body":
		"Scope, timelines and limitations stated from the proposal onward.",
	"about.value.responsibility": "Environmental responsibility",
	"about.value.responsibility.body":
		"Regulatory compliance is the floor of the work, not the goal.",
	"about.value.innovation": "Applied innovation",
	"about.value.innovation.body":
		"Photogrammetry, modelling and monitoring in service of the project, not the catalogue.",
	"about.value.social": "Social commitment",
	"about.value.social.body":
		"Working with coastal and fishing communities, not over them.",
	"about.value.results": "Verifiable results",
	"about.value.results.body":
		"Follow-up monitoring that demonstrates the ecological effect achieved.",
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
