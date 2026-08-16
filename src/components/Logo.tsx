/**
 * SEASA mark, rebuilt from assets/logo_background1.png: a circle split by a wave.
 * green above (tierra), blue below (agua). `animated` runs the tide loop that
 * assets/logo.gif shows in 120 frames and 4.8 MB; this does it in a few hundred bytes.
 *
 * The path spans two full wave periods (x 0→200) so translating it exactly one
 * period (-100) loops seamlessly.
 */

export const WAVE = [
	"M 0 52",
	"C 16.7 44, 33.3 44, 50 52",
	"C 66.7 60, 83.3 60, 100 52",
	"C 116.7 44, 133.3 44, 150 52",
	"C 166.7 60, 183.3 60, 200 52",
].join(" ");

export function Logo({
	animated = false,
	className = "",
	title = "SEASA",
}: {
	animated?: boolean;
	className?: string;
	title?: string;
}) {
	return (
		<svg
			viewBox="0 0 100 100"
			role="img"
			aria-label={title}
			className={className}
		>
			<title>{title}</title>
			<defs>
				<clipPath id="seasa-seal">
					<circle cx="50" cy="50" r="50" />
				</clipPath>
			</defs>

			<g clipPath="url(#seasa-seal)">
				<rect width="100" height="100" className="fill-marca-verde" />

				<g className={animated ? "animate-tide" : undefined}>
					{/* Water body, then the white shoreline band drawn over its edge. */}
					<path d={`${WAVE} L 200 120 L 0 120 Z`} className="fill-marca-azul" />
					<path
						d={WAVE}
						fill="none"
						stroke="#fff"
						strokeWidth="3.5"
						strokeLinecap="round"
					/>
				</g>
			</g>
		</svg>
	);
}
