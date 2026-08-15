import { Header } from "./components/Header";
import { Hero } from "./components/Hero";
import Intro from "./components/Intro";
import { useT } from "./i18n";

export default function App() {
	const t = useT();

	return (
		<>
			<Intro />
			<a
				href="#contenido"
				className="sr-only rounded-full bg-abismo-900 px-4 py-2 text-white focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-50"
			>
				{t("skip.content")}
			</a>
			<Header />
			<main id="contenido">
				<Hero />
			</main>
		</>
	);
}
