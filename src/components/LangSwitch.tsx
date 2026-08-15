import { LOCALES, useLocaleStore, useT } from "../i18n";

/** Two languages, so a segmented toggle beats a dropdown: both options stay visible
    and it is one tap instead of two. */
export function LangSwitch({ className = "" }: { className?: string }) {
	const t = useT();
	const locale = useLocaleStore((s) => s.locale);
	const setLocale = useLocaleStore((s) => s.setLocale);

	return (
		<fieldset
			className={`flex items-center gap-0.5 rounded-full border border-current/15 p-0.5 ${className}`}
			aria-label={t("lang.label")}
		>
			{LOCALES.map((code) => (
				<button
					key={code}
					type="button"
					lang={code}
					aria-pressed={locale === code}
					onClick={() => setLocale(code)}
					className={`rounded-full px-2.5 py-1 font-medium text-xs uppercase tracking-wider transition-colors ${
						locale === code
							? "bg-current/15 text-current"
							: // 70% is the floor: on the light header this is 4.98:1, and /55 was 3.31:1.
								"text-current/70 hover:text-current"
					}`}
				>
					{code}
				</button>
			))}
		</fieldset>
	);
}
