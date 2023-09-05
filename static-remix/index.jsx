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

globalThis._lastView = null;
export default function StaticRemixApp({ initial }) {
	const [View, setView] = useState(() => initial?.View);
	const [loaderData, setLoaderData] = useState(initial?.loaderData);
	const [routeParams, setRouteParams] = useState(initial?.routeParams);

	console.log("StaticRemix rerender", _lastView === View);
	_lastView = View;
	async function activateRoute({ route, routeParams }) {
		console.log(route);
		const { View, loaderData } = await loadRoute(route);

		setLoaderData(loaderData);
		setRouteParams(routeParams);
		setView(() => View);
	}

	useBrowserRouting(activateRoute);
	useEffect(() => {
		activateRoute(routeForPath());
	}, []);

	return (
		<RouteData.Provider value={{ loaderData, routeParams }}>
			{View()}
		</RouteData.Provider>
	);
	// return (
	// 	<HeadRoot>
	// 		<RouteData.Provider value={{ loaderData, routeParams }}>
	// 			<View />
	// 		</RouteData.Provider>
	// 	</HeadRoot>
	// );
}

export async function hydrate(node) {
	const { route, routeParams } = routeForPath();
	const { View, loaderData } = await loadRoute(route);
	preactHydrate(
		<StaticRemixApp initial={{ View, loaderData, routeParams }} />,
		node,
	);
}
