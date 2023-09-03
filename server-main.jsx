import { promises as fs } from "node:fs";
import { render } from "preact-render-to-string";

import Root, {
	availableRoutes,
	loadRoute,
	HeadOutlet,
	headChildren,
} from "/static-remix";

async function main() {
	const root = new URL("../../", import.meta.url);

	const templatePath = new URL("./dist/index.html", root).pathname;
	const template = await fs.readFile(templatePath, "utf8");

	for (const route of availableRoutes.values()) {
		if (!route.isStatic) continue;
		if (route.pattern.endsWith("_index.html")) continue;
		const outFile = new URL(`dist/${route.pattern}`, root).pathname;
		console.log(`Rendering ${outFile}`);
		const { View, loaderData } = await loadRoute(route);
		const result = render(<Root initial={{ View, loaderData }} />);
		await fs.writeFile(
			outFile,
			template + render(<>{headChildren}</>) + result,
		);
	}
}

main();
