import { createContext } from "preact";
import { useContext, useEffect, useState } from "preact/hooks";
import { isSSR } from "./utils.jsx";
import { OutletContext } from "./outlet.jsx";

let URLPattern = globalThis.URLPattern;
if (!URLPattern) {
	URLPattern = (await import("urlpattern-polyfill")).URLPattern;
}

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
				? { exec: (p) => p.pathname === pattern }
				: new URLPattern(pattern.replace("$", ":"), DUMMY_DOMAIN);

			const route = {
				path,
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

	for (const pattern of routes.keys()) {
		if (pattern.endsWith("_index.html")) {
			routes.delete(pattern);
		}
	}
	return routes;
}

export const availableRoutes = getAllAvailableRoutes();
globalThis._availableRoutes = availableRoutes;

export function routeForPath(path) {
	if (!path && !isSSR()) path = new URL(location.toString()).pathname;
	// Trailing slash means a directory is being request, so we load the index.html.
	if (path.endsWith("/")) path += "index.html";

	for (const route of availableRoutes.values()) {
		const url = new URL(path, DUMMY_DOMAIN);
		const match = route.matcher.exec(url);
		if (!match) continue;

		return {
			route,
			routeParams: match.pathname?.groups,
		};
	}
}

export async function loadRawRoute(route) {
	try {
		if(!route.viewModule) route.viewModule = await route.factory();
		if (!route.viewModule?.default) {
			throw error(`Route ${route.pattern} does not have a default export`);
		}
		let View = route.viewModule.default;
		const loaderData = await route.viewModule.loader?.();
		return { View, loaderData };
	} catch (e) {
		return { View: () => <h1>Error: {e.message}</h1> };
	}
}

export async function loadRoute(route) {
	let { View, loaderData } = await loadRawRoute(route);
	if (!route.computedView) {
		route.computedView = () => {
			for (const parentRoute of route.parentRoutes) {
				const { View: ParentView } = await loadRawRoute(parentRoute);
				const ViewCopy = route.computedView;
				route.computedView = () => (
					<OutletContext.Provider value={<ViewCopy />}>
						{ParentView()}
					</OutletContext.Provider>
				);
			}
		};
	}
	return {
		View: route.computedView,
		loaderData,
		route,
	};
}

export function useBrowserRouting(activateRoute) {
	if (isSSR()) return;

	useEffect(() => {
		async function navigate(url, { push = true } = {}) {
			const route = routeForPath(url.pathname);
			if (push) history.pushState({}, null, url);
			await activateRoute(route);
		}

		async function onClick(ev) {
			const link = ev.target.closest("a");
			if (!link) return;
			const current = new URL(location.toString());
			const target = new URL(link.href);
			if (current.origin !== target.origin) return;
			ev.preventDefault();
			await navigate(target);
		}

		async function onPopState(ev) {
			const current = new URL(location.toString());
			await navigate(current, { push: false });
		}

		document.addEventListener("click", onClick);
		window.addEventListener("popstate", onPopState);
		return () => {
			document.removeEventListener("click", onClick);
			window.removeEventListener("popstate", onPopState);
		};
	}, []);
}
