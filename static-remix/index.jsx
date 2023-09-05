import { createContext, hydrate as preactHydrate } from "preact";
import { useEffect, useState } from "preact/hooks";
import { HeadRoot } from "./outlet.jsx";
import {
	RouteData,
	useBrowserRouting,
	routeForPath,
	loadRoute,
} from "./routing.jsx";

export * from "./routing.jsx";
export * from "./outlet.jsx";
export * from "./utils.jsx";

export default function StaticRemixApp({ initial }) {
	const [render, setRender] = useState(() => initial?.render ?? (() => {}));
	const [loaderData, setLoaderData] = useState(initial?.loaderData);
	const [routeParams, setRouteParams] = useState(initial?.routeParams);

	async function activateRoute({ route, routeParams }) {
		const { loaderData, render } = await loadRoute(route);

		setLoaderData(loaderData);
		setRouteParams(routeParams);
		setRender(() => render);
	}

	useBrowserRouting(activateRoute);
	useEffect(() => {
		activateRoute(routeForPath());
	}, []);

	return (
		<HeadRoot>
			<RouteData.Provider value={{ loaderData, routeParams }}>
				{render()}
			</RouteData.Provider>
		</HeadRoot>
	);
}

export async function hydrate(node) {
	const { route, routeParams } = routeForPath();
	const { View, loaderData } = await loadRoute(route);
	preactHydrate(
		<StaticRemixApp initial={{ View, loaderData, routeParams }} />,
		node,
	);
}
