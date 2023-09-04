import { hydrate } from "preact";
import Root, { loadRoute, routeForPath } from "/static-remix";

async function main() {
	const { View, loaderData, routeParams } = await loadRoute(routeForPath());
	hydrate(<Root initial={{ View, loaderData, routeParams }} />, document.body);
}
main();
