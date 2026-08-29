/**
 * Company details, taken from the official company CV (CV SEASA 2026.pdf).
 * These are real and verified, not placeholders. Changing them here changes them
 * everywhere they appear.
 */
export const SITE = {
	legalName:
		"Sistemas de Energía Alternativa y Soluciones Ambientales, S.A. de C.V.",
	shortName: "SEASA",
	domain: "seasa.net",
	/** From the CV. A corporate address on the domain would present better. */
	email: "carmona.jaime@gmail.com",
	github: "https://github.com/seasa-net",
	legalRep: "M. en C. Jaime Carmona Contreras",
	phoneOffice: "+52 715 152 0159",
	phoneMobile: "+52 715 141 4354",
	phoneMobileAlt: "+52 443 397 4894",
	address: "Av. Hidalgo Pte 1bis, Zitácuaro, Michoacán, C.P. 61518",
	branches: [
		"La Paz, B.C.S.",
		"Chetumal, Quintana Roo",
		"Ixtapa Zihuatanejo, Guerrero",
	],
	sinceYear: 2010,
} as const;

/**
 * Quote links open the mail client rather than pointing at an on-page contact form:
 * there is no contact section yet, so "#contacto" was a dead anchor everywhere.
 * The subject is passed in so it can be translated by the caller.
 */
export const quoteMailto = (subject: string) =>
	`mailto:${SITE.email}?subject=${encodeURIComponent(subject)}`;
