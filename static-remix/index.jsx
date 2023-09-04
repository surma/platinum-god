import { createContext } from "preact";
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

export default function NotQuiteRemixApp({ initial }) {
	const [View, setView] = useState(() => initial?.View);
	const [loaderData, setLoaderData] = useState(initial?.loaderData);
	const [routeParams, setRouteParams] = useState(initial?.routeParams);

	async function activateRoute(route) {
		const { View, loaderData } = await loadRoute(route);
		setRouteParams(route.groups);
		setLoaderData(loaderData);
		setView(() => View);
	}

	useBrowserRouting(activateRoute);
	useEffect(() => activateRoute(routeForPath()), []);

	return (
		<HeadRoot>
			<RouteData.Provider value={{ loaderData, routeParams }}>
				<View />
			</RouteData.Provider>
		</HeadRoot>
	);
}
