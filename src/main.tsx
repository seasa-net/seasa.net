import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";

// Restore a deep link that public/404.html had to bounce through the app root.
// Runs before React Router mounts so it reads the intended URL, not "/".
try {
	const redirect = sessionStorage.getItem("seasa:redirect");
	if (redirect) {
		sessionStorage.removeItem("seasa:redirect");
		history.replaceState(null, "", redirect);
	}
} catch {
	// storage blocked; the visitor just lands on the home page
}

// biome-ignore lint/style/noNonNullAssertion: #root is guaranteed by index.html
createRoot(document.getElementById("root")!).render(
	<StrictMode>
		<App />
	</StrictMode>,
);
