import { createContext } from "preact";
import { useContext, useEffect, useState } from "preact/hooks";
import { isSSR } from "./utils.jsx";
import { OutletContext } from "./outlet.jsx";

export const RouteData = createContext(null);

export function useLoaderData() {
	return useContext(RouteData)?.loaderData;
}

export function useRouteParams() {
	return useContext(RouteData)?.routeParams ?? {};
}

const DUMMY_DOMAIN = "https://example.com";

export function getAllAvailableRoutes() {
	const rawRoutes = import.meta.glob("/routes/**/*.(js|jsx|ts|tsx)");
	const routes = new Map(
		Object.entries(rawRoutes).map(([path, factory]) => {
			// Cut of "/routes/ at the start
			let pattern = path.slice("/routes".length);
			// Replace file extension with ".html"
			pattern = pattern.replace(/\..+$/g, ".html");
			const isStatic = !pattern.includes("$");

			const matcher = isSSR()
				? { exec: (p) => p === pattern }
				: new URLPattern(pattern.replace("$", ":"), DUMMY_DOMAIN);

			const route = {
				matcher,
				isStatic,
				pattern,
				factory,
			};

			return [pattern, route];
		}),
	);

	function loadParentsForRoute(route) {
		const potentialParentIndexRoutes = route.pattern
			.split("/")
			.map((_, i, arr) => [...arr.slice(0, i + 1), "_index.html"].join("/"));

		const parentIndexRoutes = potentialParentIndexRoutes
			.map((r) => routes.get(r))
			.filter(Boolean);
		parentIndexRoutes.reverse();
		return parentIndexRoutes;
	}

	for (const route of routes.values()) {
		route.parentRoutes = loadParentsForRoute(route);
	}

	for (const route of routes.values()) {
		if (route.pattern.endsWith("_index.html")) {
			routes.delete(route.pattern);
		}
	}
	return routes;
}

export const availableRoutes = getAllAvailableRoutes();

export function routeForPath(path) {
	if (!path && !isSSR()) path = new URL(location.toString()).pathname;
	// Trailing slash means a directory is being request, so we load the index.html.
	if (path.endsWith("/")) path += "index.html";

	for (const route of availableRoutes.values()) {
		const url = new URL(path, DUMMY_DOMAIN);
		const match = route.matcher.exec(url);
		if (!match) continue;

		return {
			...route,
			groups: match.pathname?.groups,
		};
	}
}

export async function loadRawRoute(route) {
	const viewModule = await route.factory();
	if (!viewModule?.default) {
		console.error(`Route ${route.pattern} does not have a default export`);
		return { View: () => <h1>Error</h1> };
	}
	let View = viewModule.default;
	const loaderData = await viewModule.loader?.();
	return { View, loaderData };
}

export async function loadRoute(route) {
	let { View, loaderData } = await loadRawRoute(route);
	for (const parentRoute of route.parentRoutes) {
		const { View: ParentView } = await loadRawRoute(parentRoute);
		const ViewCopy = View;
		View = () => (
			<OutletContext.Provider value={<ViewCopy />}>
				<ParentView />
			</OutletContext.Provider>
		);
	}
	return { View, loaderData };
}

export function useBrowserRouting(activateRoute) {
	if (isSSR()) return;

	async function onNavigate(ev) {
		if (!ev.canIntercept) return;
		const currentUrl = new URL(location.toString());
		const destinationUrl = new URL(ev.destination.url);
		if (currentUrl.origin != destinationUrl.origin) return;
		const route = routeForPath(destinationUrl.pathname);
		if (!route) throw Error(`No route matched ${destinationUrl.pathname}`);
		ev.intercept({
			handler: async () => activateRoute(route),
		});
	}
	useEffect(() => {
		navigation.addEventListener("navigate", onNavigate);
		return () => navigation.removeEventListener("navigate", onNavigate);
	}, []);
}
