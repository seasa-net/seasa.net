import type { Locale } from "../i18n";
import { SITE } from "./site";

/**
 * DRAFT LEGAL TEXT. Structure and scope only.
 *
 * TODO(SEASA): this has NOT been reviewed by a lawyer and must be before launch.
 * Company details now come from the official CV, so no placeholders remain, but the
 * legal wording itself is still a draft. In Mexico the governing
 * instrument for personal data is the Aviso de Privacidad under the LFPDPPP, which is
 * why the privacy document is titled that way rather than "Privacy Policy".
 */
export type LegalDoc = {
	title: string;
	updated: string;
	intro: string;
	sections: { heading: string; body: string[] }[];
};

const UPDATED = "2026-08-16";

const es: Record<"privacy" | "terms", LegalDoc> = {
	privacy: {
		title: "Aviso de Privacidad",
		updated: UPDATED,
		intro: `${SITE.legalName}, con domicilio fiscal en ${SITE.address}, es responsable del tratamiento de sus datos personales conforme a la Ley Federal de Protección de Datos Personales en Posesión de los Particulares (LFPDPPP), su Reglamento y los Lineamientos del Aviso de Privacidad.`,
		sections: [
			{
				heading: "Datos que recabamos",
				body: [
					"A través de este sitio recabamos únicamente los datos que usted nos proporciona de forma directa al solicitar una cotización o contactarnos: nombre, correo electrónico, teléfono cuando lo indica, y la descripción del proyecto sobre el que consulta.",
					"No recabamos datos personales sensibles ni datos patrimoniales o financieros a través de este sitio.",
				],
			},
			{
				heading: "Finalidades del tratamiento",
				body: [
					"Finalidades primarias, necesarias para la relación: responder su solicitud, elaborar propuestas técnicas y económicas, dar seguimiento a proyectos y cumplir obligaciones contractuales y legales.",
					"Finalidades secundarias, que usted puede rechazar sin que afecte su solicitud: envío de información institucional, publicaciones técnicas y avisos sobre nuestros servicios.",
				],
			},
			{
				heading: "Transferencias",
				body: [
					"No transferimos sus datos personales a terceros sin su consentimiento, salvo en los supuestos previstos en el artículo 37 de la LFPDPPP, incluida la entrega de información a autoridades ambientales cuando la gestión de un trámite lo requiera.",
				],
			},
			{
				heading: "Derechos ARCO",
				body: [
					"Usted puede en todo momento ejercer sus derechos de Acceso, Rectificación, Cancelación y Oposición, así como revocar su consentimiento, escribiendo a " +
						SITE.email +
						".",
					"Su solicitud debe indicar su nombre, un medio para comunicarle la respuesta, los documentos que acrediten su identidad y una descripción clara de los datos respecto de los que busca ejercer el derecho.",
				],
			},
			{
				heading: "Cookies y tecnologías de rastreo",
				body: [
					"Este sitio no utiliza cookies de publicidad ni de rastreo de terceros. Se emplea almacenamiento local del navegador únicamente para recordar su preferencia de idioma y si ya vio la animación de entrada. Esa información no sale de su dispositivo.",
				],
			},
			{
				heading: "Cambios a este aviso",
				body: [
					"Cualquier modificación se publicará en esta misma página, indicando la fecha de la última actualización.",
				],
			},
		],
	},
	terms: {
		title: "Términos y Condiciones",
		updated: UPDATED,
		intro: `El uso de ${SITE.domain} implica la aceptación de los siguientes términos. Si no está de acuerdo con ellos, le pedimos no utilizar el sitio.`,
		sections: [
			{
				heading: "Objeto del sitio",
				body: [
					"Este sitio tiene una finalidad informativa e institucional. Describe los servicios, capacidades y proyectos de " +
						SITE.shortName +
						", y permite iniciar contacto comercial.",
				],
			},
			{
				heading: "Alcance de la información técnica",
				body: [
					"Los contenidos técnicos publicados aquí son descriptivos y no constituyen un dictamen, estudio, asesoría ni entregable contratable. Ningún contenido de este sitio sustituye un estudio formal firmado por personal técnico responsable.",
					"Las cifras, alcances y resultados que se presentan corresponden a proyectos específicos y no deben interpretarse como una garantía de resultados equivalentes en otros sitios o condiciones.",
				],
			},
			{
				heading: "Propiedad intelectual",
				body: [
					"Los textos, imágenes, videos, modelos, cartografía, documentos y demás materiales publicados son propiedad de " +
						SITE.legalName +
						" o se utilizan con autorización de su titular. Su reproducción o distribución requiere autorización previa por escrito.",
				],
			},
			{
				heading: "Enlaces a terceros",
				body: [
					"El sitio puede enlazar a recursos externos. No controlamos ni respondemos por su contenido, disponibilidad o políticas de privacidad.",
				],
			},
			{
				heading: "Disponibilidad",
				body: [
					"Procuramos mantener el sitio disponible y actualizado, sin garantizar continuidad ininterrumpida ni ausencia de errores.",
				],
			},
			{
				heading: "Legislación aplicable",
				body: [
					"Estos términos se rigen por la legislación mexicana. Para su interpretación y cumplimiento, las partes se someten a los tribunales competentes de Zitácuaro, Michoacán, renunciando a cualquier otro fuero.",
				],
			},
		],
	},
};

const en: Record<"privacy" | "terms", LegalDoc> = {
	privacy: {
		title: "Privacy Notice",
		updated: UPDATED,
		intro: `${SITE.legalName}, with registered address at ${SITE.address}, is responsible for the processing of your personal data under Mexico's Federal Law on Protection of Personal Data Held by Private Parties (LFPDPPP), its Regulations and the Privacy Notice Guidelines. This English version is provided for convenience; the Spanish text prevails.`,
		sections: [
			{
				heading: "Data we collect",
				body: [
					"Through this site we collect only the data you provide directly when requesting a quote or contacting us: name, email address, phone number where you supply it, and the description of the project you are enquiring about.",
					"We do not collect sensitive personal data, nor financial or asset data, through this site.",
				],
			},
			{
				heading: "Purposes of processing",
				body: [
					"Primary purposes, necessary for the relationship: responding to your enquiry, preparing technical and commercial proposals, following up on projects, and meeting contractual and legal obligations.",
					"Secondary purposes, which you may decline without affecting your enquiry: sending institutional information, technical publications and notices about our services.",
				],
			},
			{
				heading: "Transfers",
				body: [
					"We do not transfer your personal data to third parties without your consent, except in the cases set out in article 37 of the LFPDPPP, including submission to environmental authorities where a permitting procedure requires it.",
				],
			},
			{
				heading: "ARCO rights",
				body: [
					"You may at any time exercise your rights of Access, Rectification, Cancellation and Opposition, and withdraw your consent, by writing to " +
						SITE.email +
						".",
					"Your request must state your name, a means of replying to you, documents proving your identity, and a clear description of the data concerned.",
				],
			},
			{
				heading: "Cookies and tracking",
				body: [
					"This site uses no advertising or third-party tracking cookies. Browser local storage is used only to remember your language preference and whether you have already seen the intro animation. That information never leaves your device.",
				],
			},
			{
				heading: "Changes to this notice",
				body: [
					"Any change will be published on this page, stating the date it was last updated.",
				],
			},
		],
	},
	terms: {
		title: "Terms and Conditions",
		updated: UPDATED,
		intro: `Use of ${SITE.domain} implies acceptance of these terms. If you do not agree with them, please do not use the site. This English version is provided for convenience; the Spanish text prevails.`,
		sections: [
			{
				heading: "Purpose of the site",
				body: [
					"This site is informational and institutional. It describes the services, capabilities and projects of " +
						SITE.shortName +
						", and allows commercial contact to be initiated.",
				],
			},
			{
				heading: "Scope of technical information",
				body: [
					"Technical content published here is descriptive and does not constitute an opinion, study, advice or contractable deliverable. Nothing on this site replaces a formal study signed by responsible technical personnel.",
					"Figures, scopes and results shown correspond to specific projects and must not be read as a guarantee of equivalent results at other sites or under other conditions.",
				],
			},
			{
				heading: "Intellectual property",
				body: [
					"Texts, images, video, models, cartography, documents and other published material are the property of " +
						SITE.legalName +
						" or are used with the rights holder's permission. Reproduction or distribution requires prior written authorisation.",
				],
			},
			{
				heading: "Third-party links",
				body: [
					"The site may link to external resources. We neither control nor answer for their content, availability or privacy practices.",
				],
			},
			{
				heading: "Availability",
				body: [
					"We aim to keep the site available and up to date, without guaranteeing uninterrupted continuity or freedom from error.",
				],
			},
			{
				heading: "Governing law",
				body: [
					"These terms are governed by Mexican law. For their interpretation and performance the parties submit to the competent courts of Zitácuaro, Michoacán, waiving any other jurisdiction.",
				],
			},
		],
	},
};

export const LEGAL: Record<Locale, typeof es> = { es, en };
