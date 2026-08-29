import { useEffect } from "react";
import { create } from "zustand";

export const LOCALES = ["es", "en"] as const;
export type Locale = (typeof LOCALES)[number];

/* Spanish is the source language: `en` is typed against it, so a missing or
   stray English key is a compile error rather than a blank string in production. */
const es = {
	"nav.about": "Nosotros",
	"nav.services": "Servicios",
	"nav.projects": "Proyectos",
	"nav.lab": "Laboratorio",
	"nav.contact": "Cotizar",
	"contact.subject": "Solicitud de cotización",
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
	"hero.stat.reefs": "proyectos de arrecifes artificiales",
	"about.eyebrow": "Nosotros",
	"about.title": "Ingeniería, ciencia y ejecución en un mismo equipo.",
	"about.lead":
		"SEASA reúne consultoría ambiental, ciencia costera y obra en campo bajo una sola dirección técnica. Un estudio, el permiso que lo acompaña y la restauración que sigue responden al mismo criterio y a la misma evidencia.",
	"about.mission.label": "Misión",
	"about.mission.body":
		"Otorgar servicios de manera integral que atiendan todas las necesidades de nuestros clientes, a través de la diversificación de los servicios y de un trabajo multidisciplinario, para garantizar la calidad en el servicio y ser más competitivos en el mercado mediante la innovación y la mejora continua, utilizando de manera sustentable los recursos naturales.",
	"about.vision.label": "Visión",
	"about.vision.body":
		"Ser una empresa plenamente identificada por el sector productivo, empresarial y gubernamental en México, bajo principios de seriedad, profesionalismo y responsabilidad, para el desarrollo integral de proyectos sustentables que resuelvan las necesidades de nuestros clientes y mejoren el planeta.",
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
	"services.eyebrow": "Servicios",
	"services.title": "Ocho áreas técnicas, una sola dirección de proyecto.",
	"services.lead":
		"Cada servicio se entrega con metodología documentada, normatividad aplicable y evidencia de campo. La mayoría de los proyectos combina varios de ellos.",
	"services.more": "Detalles",
	"services.includes": "Qué incluye",
	"services.close": "Cerrar",

	"svc.mia.name": "Manifestación de Impacto Ambiental",
	"svc.mia.summary":
		"MIA Particular, Regional y General; estudios técnicos justificativos, requerimientos, matrices de impacto y programas de vigilancia ambiental.",
	"svc.mia.detail":
		"Integramos el expediente completo que revisa la autoridad: descripción del proyecto, línea base ambiental, identificación y valoración de impactos, medidas de mitigación y el programa de vigilancia que después debe cumplirse. El documento se redacta para resistir revisión técnica, requerimientos de información y consulta pública.",
	"svc.mia.points":
		"MIA Particular, Regional y General|Estudio Técnico Justificativo (ETJ)|Matrices de impacto y medidas de mitigación|Programa de Vigilancia Ambiental|Atención a requerimientos de la autoridad",
	"svc.mia.cursor": "MIA",

	"svc.reefs.name": "Arrecifes Artificiales",
	"svc.reefs.summary":
		"Diseño, fabricación, colocación, monitoreo, colonización biológica, fichas técnicas, resultados pesqueros y restauración marina.",
	"svc.reefs.detail":
		"Diseñamos y fabricamos módulos arrecifales, los colocamos georreferenciados en el sitio autorizado y damos seguimiento a su colonización biológica. El objetivo no es instalar estructura, sino documentar que el sustrato se convierte en hábitat: fijación de organismos, peces asociados y evolución de la comunidad.",
	"svc.reefs.points":
		"Diseño estructural del módulo|Fabricación y traslado|Colocación y georreferenciación|Monitoreo de colonización|Fichas técnicas y reportes",
	"svc.reefs.cursor": "Arrecife",

	"svc.ocean.name": "Oceanografía y Batimetría",
	"svc.ocean.summary":
		"Caracterización marina, corrientes, oleaje, sedimentos, perfiles batimétricos, mapeo submarino y estudios de línea base.",
	"svc.ocean.detail":
		"Levantamos la información física del sitio marino: corrientes, oleaje, mareas, sedimentos y profundidad. Estos datos sostienen la línea base de una MIA, el diseño de obra costera y cualquier modelo posterior. Sin ellos, el resto del estudio es estimación.",
	"svc.ocean.points":
		"Corrientes, oleaje y mareas|Perfiles batimétricos|Caracterización de sedimentos|Mapeo submarino|Estudios de línea base",
	"svc.ocean.cursor": "Sondeo",

	"svc.hydro.name": "Hidrología e Hidráulica",
	"svc.hydro.summary":
		"Microcuencas, escurrimientos, zonas federales, cauces, riesgo hidrológico, obras de drenaje y manejo de avenidas.",
	"svc.hydro.detail":
		"Delimitamos microcuencas y calculamos escurrimientos para establecer cuánta agua llega al sitio, por dónde y con qué frecuencia. De ahí se derivan zonas federales, cauces, riesgo hidrológico y el dimensionamiento de obras de drenaje y manejo de avenidas.",
	"svc.hydro.points":
		"Delimitación de microcuencas|Cálculo de escurrimientos|Zonas federales y cauces|Riesgo hidrológico|Obras de drenaje y manejo de avenidas",
	"svc.hydro.cursor": "Cuenca",

	"svc.coastal.name": "Modelación Costera",
	"svc.coastal.summary":
		"Erosión litoral, transporte sedimentario, dinámica de playas, escenarios de oleaje, protección costera y restauración de línea de costa.",
	"svc.coastal.detail":
		"Modelamos cómo se mueve la costa: erosión litoral, transporte de sedimentos y respuesta de la playa ante distintos escenarios de oleaje. Sirve para evaluar obras de protección y para anticipar el efecto de un proyecto sobre la línea de costa antes de construirlo.",
	"svc.coastal.points":
		"Erosión litoral|Transporte de sedimentos|Dinámica de playas|Escenarios de oleaje|Protección y restauración de línea de costa",
	"svc.coastal.cursor": "Oleaje",

	"svc.geo.name": "Geofísica y Topografía",
	"svc.geo.summary":
		"Levantamientos, fotogrametría con dron, modelos digitales, cartografía, georreferenciación y análisis espacial.",
	"svc.geo.detail":
		"Levantamos el terreno con topografía convencional y fotogrametría con dron, y lo entregamos como modelo digital de elevación, cartografía y capas georreferenciadas. Es la base espacial sobre la que se apoyan los demás estudios y el seguimiento de obra.",
	"svc.geo.points":
		"Levantamientos topográficos|Fotogrametría con dron|Modelos digitales de elevación|Cartografía y georreferenciación|Análisis espacial (SIG)",
	"svc.geo.cursor": "Dron",

	"svc.wildlife.name": "Rescate de Flora y Fauna",
	"svc.wildlife.summary":
		"Inventarios, muestreos, rescate, reubicación, seguimiento de supervivencia, informes y cumplimiento de condicionantes.",
	"svc.wildlife.detail":
		"Ejecutamos los inventarios y muestreos previos, el rescate y la reubicación de ejemplares, y el seguimiento de supervivencia posterior. Es la etapa donde las condicionantes se cumplen o no se cumplen, y donde el registro documental pesa tanto como el trabajo en campo.",
	"svc.wildlife.points":
		"Inventarios y muestreos|Rescate y reubicación|Seguimiento de supervivencia|Informes de cumplimiento|Atención a condicionantes",
	"svc.wildlife.cursor": "Rescate",

	"svc.energy.name": "Energías Renovables",
	"svc.energy.summary":
		"Diseño de sistemas solares, integración energética, eficiencia, sistemas híbridos y soluciones para proyectos remotos.",
	"svc.energy.detail":
		"Diseñamos sistemas solares y esquemas híbridos, dimensionados a partir del consumo real y del recurso disponible en el sitio. Se aplica sobre todo en proyectos remotos o en instalaciones que deben operar con independencia de la red.",
	"svc.energy.points":
		"Diseño de sistemas solares|Integración energética|Eficiencia y consumo|Sistemas híbridos|Soluciones para sitios remotos",
	"svc.energy.cursor": "Solar",

	"projects.eyebrow": "Proyectos",
	"projects.title": "Presencia técnica en el litoral mexicano.",
	"projects.lead":
		"Selecciona un estado para ubicarlo en el mapa y ver el alcance del trabajo realizado ahí.",
	"projects.explore": "Explorar proyecto",
	"projects.map": "Mapa de proyectos por estado",
	"projects.back": "Volver a proyectos",
	"photo.aerial":
		"Línea de módulos arrecifales colocada en el lecho marino, registrada desde dron.",
	"photo.coral":
		"Colonia de coral establecida sobre el sustrato, registrada durante monitoreo.",
	"gallery.label": "Evidencia de campo",
	"gallery.prev": "Imagen anterior",
	"gallery.next": "Imagen siguiente",
	"title.suffix": "SEASA",
	"title.home": "Soluciones ambientales y energía",
	"title.lab": "Laboratorio digital",
	"title.projects": "Proyectos",
	"meta.description":
		"SEASA. Consultoría ambiental, manifestaciones de impacto ambiental, arrecifes artificiales fijadores de carbono, oceanografía, hidrología y energías renovables en México.",
	"photo.divers":
		"Trabajo de buceo sobre un módulo arrecifal durante el monitoreo.",
	"projects.soon": "La ficha completa de este proyecto está en preparación.",

	"proj.campeche.place": "Isla Aguada",
	"proj.campeche.summary":
		"Construcción, hundimiento y colocación de arrecifes artificiales como compensación ambiental por la extracción de hidrocarburos (2024).",
	"proj.bcs.place": "La Paz y Los Cabos",
	"proj.bcs.summary":
		"Arrecifes en Bahía Magdalena, Punta Abreojos y La Bocana; MIA para desarrollos costeros, bancos de material pétreo, hidrología y modelación de transporte litoral.",
	"proj.guerrero.place": "Zihuatanejo de Azueta",
	"proj.guerrero.summary":
		"Manifestación de Impacto Ambiental del proyecto RCS Don Elpidio, ingresada y autorizada por SEMARNAT (2023).",
	"proj.michoacan.place": "Playa Azul y Zitácuaro",
	"proj.michoacan.summary":
		"Arrecifes artificiales en Playa Azul, lonjas pesqueras, acuacultura y el Programa de Ordenamiento Ecológico Local de Zitácuaro.",
	"proj.oaxaca.place": "Costa de Oaxaca",
	"proj.oaxaca.summary":
		"MIA regional para el desarrollo territorial de la costa mediante arrecifes artificiales para la sustentabilidad pesquera (2018).",

	"lab.eyebrow": "Laboratorio digital",
	"lab.title":
		"Herramientas que convierten el trabajo de campo en evidencia consultable.",
	"lab.lead":
		"Modelos, mapas, recorridos y documentos generados en proyectos reales. Una muestra aquí; el catálogo completo en el laboratorio.",
	"lab.cta": "Entrar al laboratorio",
	"lab.soon": "El laboratorio completo está en preparación.",

	"lab.3d.name": "Modelos tridimensionales",
	"lab.3d.body": "Visualización de módulos, predios, obras y estructuras.",
	"lab.gis.name": "Mapas interactivos",
	"lab.gis.body":
		"Proyectos georreferenciados, polígonos, transectos y estaciones.",
	"lab.360.name": "Recorridos virtuales",
	"lab.360.body": "Fotogrametría, videos de dron y recorridos submarinos.",
	"lab.pdf.name": "Centro de descargas",
	"lab.pdf.body": "Fichas técnicas, folletos, presentaciones y publicaciones.",

	"cloud.title": "Mapa de palabras del sitio",
	"footer.home": "Inicio",
	"footer.labPage": "Catálogo del laboratorio",
	"footer.sitemap": "Mapa del sitio",
	"footer.contact": "Contacto",
	"footer.legal": "Legal",
	"footer.privacy": "Aviso de privacidad",
	"footer.terms": "Términos y condiciones",
	"footer.tagline": "Ingeniería ambiental con evidencia de campo.",
	"footer.phone": "Oficina",
	"footer.mobile": "Celular",
	"footer.offices": "Oficinas",
	"legal.updated": "Última actualización:",
	"legal.review":
		"Documento en borrador. Requiere revisión legal antes de publicarse y contiene marcadores entre corchetes que SEASA debe completar.",

	"skip.content": "Saltar al contenido",
} as const;

const en: Record<keyof typeof es, string> = {
	"nav.about": "About",
	"nav.services": "Services",
	"nav.projects": "Projects",
	"nav.lab": "Lab",
	"nav.contact": "Get a quote",
	"contact.subject": "Quote request",
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
	"hero.stat.reefs": "artificial reef projects",
	"about.eyebrow": "About us",
	"about.title": "Engineering, science and execution in one team.",
	"about.lead":
		"SEASA brings environmental consulting, coastal science and field execution under a single technical direction. A study, the permit that accompanies it and the restoration that follows answer to the same criteria and the same evidence.",
	"about.mission.label": "Mission",
	"about.mission.body":
		"To provide services in an integrated way that meet every one of our clients' needs, through diversification of services and multidisciplinary work, guaranteeing quality of service and making us more competitive in the market through innovation and continuous improvement, using natural resources sustainably.",
	"about.vision.label": "Vision",
	"about.vision.body":
		"To be a company fully recognised by the productive, business and government sectors in Mexico, working under principles of seriousness, professionalism and responsibility, for the integrated development of sustainable projects that meet our clients' needs and improve the planet.",
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
	"services.eyebrow": "Services",
	"services.title": "Eight technical areas, one project direction.",
	"services.lead":
		"Every service ships with documented methodology, the applicable regulation and field evidence. Most projects combine several of them.",
	"services.more": "Details",
	"services.includes": "What it covers",
	"services.close": "Close",

	"svc.mia.name": "Environmental Impact Statement",
	"svc.mia.summary":
		"MIA Particular, Regional and General; technical justification studies, information requests, impact matrices and environmental monitoring programmes.",
	"svc.mia.detail":
		"We assemble the full file the authority reviews: project description, environmental baseline, identification and valuation of impacts, mitigation measures and the monitoring programme that must be met afterwards. The document is written to withstand technical review, requests for further information and public consultation.",
	"svc.mia.points":
		"MIA Particular, Regional and General|Technical Justification Study (ETJ)|Impact matrices and mitigation measures|Environmental Monitoring Programme|Response to authority information requests",
	"svc.mia.cursor": "EIS",

	"svc.reefs.name": "Artificial Reefs",
	"svc.reefs.summary":
		"Design, fabrication, placement, monitoring, biological colonisation, technical sheets, fishery results and marine restoration.",
	"svc.reefs.detail":
		"We design and fabricate reef modules, place them georeferenced on the authorised site and track their biological colonisation. The goal is not to install structure but to document that the substrate becomes habitat: organism settlement, associated fish and the evolution of the community.",
	"svc.reefs.points":
		"Structural module design|Fabrication and transport|Placement and georeferencing|Colonisation monitoring|Technical sheets and reports",
	"svc.reefs.cursor": "Reef",

	"svc.ocean.name": "Oceanography and Bathymetry",
	"svc.ocean.summary":
		"Marine characterisation, currents, waves, sediments, bathymetric profiles, underwater mapping and baseline studies.",
	"svc.ocean.detail":
		"We capture the physical information of the marine site: currents, waves, tides, sediments and depth. This data underpins the baseline of an impact statement, the design of coastal works and any model that follows. Without it, the rest of the study is estimation.",
	"svc.ocean.points":
		"Currents, waves and tides|Bathymetric profiles|Sediment characterisation|Underwater mapping|Baseline studies",
	"svc.ocean.cursor": "Survey",

	"svc.hydro.name": "Hydrology and Hydraulics",
	"svc.hydro.summary":
		"Micro-catchments, runoff, federal zones, watercourses, hydrological risk, drainage works and flood management.",
	"svc.hydro.detail":
		"We delimit micro-catchments and calculate runoff to establish how much water reaches the site, along which path and how often. Federal zones, watercourses, hydrological risk and the sizing of drainage and flood-management works all follow from that.",
	"svc.hydro.points":
		"Micro-catchment delimitation|Runoff calculation|Federal zones and watercourses|Hydrological risk|Drainage and flood-management works",
	"svc.hydro.cursor": "Basin",

	"svc.coastal.name": "Coastal Modelling",
	"svc.coastal.summary":
		"Shoreline erosion, sediment transport, beach dynamics, wave scenarios, coastal protection and shoreline restoration.",
	"svc.coastal.detail":
		"We model how the coast moves: shoreline erosion, sediment transport and beach response under different wave scenarios. It is used to evaluate protection works and to anticipate a project's effect on the shoreline before it is built.",
	"svc.coastal.points":
		"Shoreline erosion|Sediment transport|Beach dynamics|Wave scenarios|Coastal protection and shoreline restoration",
	"svc.coastal.cursor": "Waves",

	"svc.geo.name": "Geophysics and Topography",
	"svc.geo.summary":
		"Surveys, drone photogrammetry, digital models, cartography, georeferencing and spatial analysis.",
	"svc.geo.detail":
		"We survey the terrain with conventional topography and drone photogrammetry, and deliver it as a digital elevation model, cartography and georeferenced layers. It is the spatial base every other study and construction follow-up rests on.",
	"svc.geo.points":
		"Topographic surveys|Drone photogrammetry|Digital elevation models|Cartography and georeferencing|Spatial analysis (GIS)",
	"svc.geo.cursor": "Drone",

	"svc.wildlife.name": "Flora and Fauna Rescue",
	"svc.wildlife.summary":
		"Inventories, sampling, rescue, relocation, survival monitoring, reporting and compliance with permit conditions.",
	"svc.wildlife.detail":
		"We run the prior inventories and sampling, the rescue and relocation of specimens, and the survival monitoring that follows. This is the stage where permit conditions are met or missed, and where the documentary record weighs as much as the field work.",
	"svc.wildlife.points":
		"Inventories and sampling|Rescue and relocation|Survival monitoring|Compliance reporting|Response to permit conditions",
	"svc.wildlife.cursor": "Rescue",

	"svc.energy.name": "Renewable Energy",
	"svc.energy.summary":
		"Solar system design, energy integration, efficiency, hybrid systems and solutions for remote projects.",
	"svc.energy.detail":
		"We design solar systems and hybrid schemes, sized from actual consumption and the resource available on site. It applies above all to remote projects or to installations that must run independently of the grid.",
	"svc.energy.points":
		"Solar system design|Energy integration|Efficiency and consumption|Hybrid systems|Solutions for remote sites",
	"svc.energy.cursor": "Solar",

	"projects.eyebrow": "Projects",
	"projects.title": "Technical presence along the Mexican coast.",
	"projects.lead":
		"Select a state to locate it on the map and see the scope of the work carried out there.",
	"projects.explore": "Explore project",
	"projects.map": "Map of projects by state",
	"projects.back": "Back to projects",
	"photo.aerial":
		"Line of reef modules placed on the seabed, recorded by drone.",
	"photo.coral":
		"Coral colony established on the substrate, recorded during monitoring.",
	"gallery.label": "Field evidence",
	"gallery.prev": "Previous image",
	"gallery.next": "Next image",
	"title.suffix": "SEASA",
	"title.home": "Environmental solutions and energy",
	"title.lab": "Digital lab",
	"title.projects": "Projects",
	"meta.description":
		"SEASA. Environmental consulting, environmental impact statements, carbon-fixing artificial reefs, oceanography, hydrology and renewable energy in Mexico.",
	"photo.divers": "Dive work on a reef module during monitoring.",
	"projects.soon": "The full record for this project is in preparation.",

	"proj.campeche.place": "Isla Aguada",
	"proj.campeche.summary":
		"Construction, sinking and placement of artificial reefs as environmental compensation for hydrocarbon extraction (2024).",
	"proj.bcs.place": "La Paz and Los Cabos",
	"proj.bcs.summary":
		"Reefs at Bahía Magdalena, Punta Abreojos and La Bocana; impact statements for coastal developments, aggregate banks, hydrology and littoral transport modelling.",
	"proj.guerrero.place": "Zihuatanejo de Azueta",
	"proj.guerrero.summary":
		"Environmental Impact Statement for the RCS Don Elpidio project, filed and authorised by SEMARNAT (2023).",
	"proj.michoacan.place": "Playa Azul and Zitácuaro",
	"proj.michoacan.summary":
		"Artificial reefs at Playa Azul, fishery halls, aquaculture and the Local Ecological Zoning Programme for Zitácuaro.",
	"proj.oaxaca.place": "Oaxaca coast",
	"proj.oaxaca.summary":
		"Regional impact statement for territorial development of the coast through artificial reefs for fishery sustainability (2018).",

	"lab.eyebrow": "Digital lab",
	"lab.title": "Tools that turn field work into evidence anyone can consult.",
	"lab.lead":
		"Models, maps, walkthroughs and documents produced on real projects. A sample here; the full catalogue in the lab.",
	"lab.cta": "Enter the lab",
	"lab.soon": "The full lab is in preparation.",

	"lab.3d.name": "Three-dimensional models",
	"lab.3d.body": "Visualisation of modules, sites, works and structures.",
	"lab.gis.name": "Interactive maps",
	"lab.gis.body": "Georeferenced projects, polygons, transects and stations.",
	"lab.360.name": "Virtual walkthroughs",
	"lab.360.body": "Photogrammetry, drone video and underwater tours.",
	"lab.pdf.name": "Download centre",
	"lab.pdf.body":
		"Technical sheets, brochures, presentations and publications.",

	"cloud.title": "Site word map",
	"footer.home": "Home",
	"footer.labPage": "Lab catalogue",
	"footer.sitemap": "Site map",
	"footer.contact": "Contact",
	"footer.legal": "Legal",
	"footer.privacy": "Privacy notice",
	"footer.terms": "Terms and conditions",
	"footer.tagline": "Environmental engineering backed by field evidence.",
	"footer.phone": "Office",
	"footer.mobile": "Mobile",
	"footer.offices": "Offices",
	"legal.updated": "Last updated:",
	"legal.review":
		"Draft document. It requires legal review before publication and contains bracketed placeholders for SEASA to complete.",

	"skip.content": "Skip to content",
};

const dict = { es, en };
export type MessageKey = keyof typeof es;

function isLocale(value: string | null): value is Locale {
	return LOCALES.includes(value as Locale);
}

/* URL wins over storage so a shared link always opens in the language it was shared in.
   ponytail: `?lang=` keeps this router-free on static hosting. Move to /es/ + /en/ path
   prefixes when a router lands. Path prefixes index better and are what BRAND.md wants. */
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

/**
 * Sets the document title and meta description for a page.
 *
 * These live outside React's tree in index.html, so nothing was updating them: every
 * route and both languages shared one hardcoded Spanish title. The browser tab is part
 * of the translation surface, and it is what search engines index.
 */
export function useDocumentMeta(title: string) {
	const t = useT();
	const locale = useLocaleStore((s) => s.locale);
	const description = t("meta.description");
	useEffect(() => {
		document.title = `${title} | ${t("title.suffix")}`;
		document.documentElement.lang = locale;
		let tag = document.querySelector<HTMLMetaElement>(
			'meta[name="description"]',
		);
		if (!tag) {
			tag = document.createElement("meta");
			tag.name = "description";
			document.head.appendChild(tag);
		}
		tag.content = description;
	}, [title, description, locale, t]);
}

/**
 * Bullet lists live as one pipe-separated string so the dictionary stays a flat
 * `Record<MessageKey, string>` and English keeps its compile-time completeness check.
 */
export function useTList() {
	const t = useT();
	return (key: MessageKey) => t(key).split("|");
}
