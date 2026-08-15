import Intro from "./components/Intro";

export default function App() {
	return (
		<>
			<Intro />
			<main className="mx-auto grid min-h-dvh max-w-3xl place-content-center gap-4 px-6 text-center">
				<p className="font-medium text-azul-700 text-sm uppercase tracking-[0.2em]">
					Soluciones Ambientales · Energía
				</p>
				<h1 className="font-display text-5xl text-abismo-900 leading-tight">
					SEASA
				</h1>
				<p className="text-abismo-800/70 text-lg">
					Sistemas de Energía Alternativa y Soluciones Ambientales.
				</p>
			</main>
		</>
	);
}
