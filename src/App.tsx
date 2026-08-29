import { useEffect } from "react";
import { BrowserRouter, Route, Routes, useLocation } from "react-router-dom";
import { About } from "./components/About";
import { CursorProvider } from "./components/cursor";
import { Footer } from "./components/Footer";
import { Header } from "./components/Header";
import { Hero } from "./components/Hero";
import Intro from "./components/Intro";
import { Lab } from "./components/Lab";
import { Projects } from "./components/Projects";
import { Services } from "./components/Services";
import { WordCloud } from "./components/WordCloud";
import { useDocumentMeta, useT } from "./i18n";
import { LabPage } from "./pages/LabPage";
import { LegalPage } from "./pages/LegalPage";
import { ProjectStory } from "./pages/ProjectStory";

/**
 * React Router does not scroll on navigation, so "/#servicios" from a project page
 * would change the URL and leave the viewport where it was. Handles both directions:
 * a hash scrolls to the section, a plain route change goes to the top.
 */
function ScrollToHash() {
	// Depend on the whole location rather than destructured fields: a route change with
	// no hash still has to scroll to the top, and `location` is a fresh object per
	// navigation, so the effect fires for both cases without an exhaustive-deps escape.
	const location = useLocation();

	useEffect(() => {
		if (location.hash) {
			document.querySelector(location.hash)?.scrollIntoView();
			return;
		}
		// Instant, not smooth: animating the whole page on a route change reads as lag.
		window.scrollTo({ top: 0, behavior: "instant" });
	}, [location]);

	return null;
}

function Home() {
	const t = useT();
	useDocumentMeta(t("title.home"));
	return (
		<>
			<Hero />
			<About />
			<Services />
			<Projects />
			<Lab />
		</>
	);
}

export default function App() {
	const t = useT();

	return (
		// Vite's BASE_URL keeps routing correct whether the site is served from a custom
		// domain at "/" or from a GitHub project page at "/<repo>/".
		<BrowserRouter basename={import.meta.env.BASE_URL}>
			<CursorProvider>
				<ScrollToHash />
				<Intro />
				<a
					href="#contenido"
					className="sr-only rounded-full bg-abismo-900 px-4 py-2 text-white focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-50"
				>
					{t("skip.content")}
				</a>
				<Header />
				<main id="contenido">
					<Routes>
						<Route path="/" element={<Home />} />
						<Route path="/proyectos/:id" element={<ProjectStory />} />
						<Route path="/laboratorio" element={<LabPage />} />
						<Route
							path="/aviso-de-privacidad"
							element={<LegalPage doc="privacy" />}
						/>
						<Route
							path="/terminos-y-condiciones"
							element={<LegalPage doc="terms" />}
						/>
					</Routes>
				</main>
				<WordCloud />
				<Footer />
			</CursorProvider>
		</BrowserRouter>
	);
}
