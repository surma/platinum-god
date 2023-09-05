import { promises as fs } from "node:fs";
import * as path from "node:path";
import { render } from "preact-render-to-string";

import Root, {
	availableRoutes,
	loadRoute,
	HeadOutlet,
	headChildren,
} from "/static-remix";

async function main() {
	const root = new URL("../../", import.meta.url);

	const ssrManifestPath = new URL("./dist/ssr-manifest.json", root).pathname;
	const manifest = JSON.parse(await fs.readFile(ssrManifestPath, "utf8"));

	const templatePath = new URL("./dist/index.html", root).pathname;
	const template = await fs.readFile(templatePath, "utf8");

	for (const route of availableRoutes.values()) {
		const cssDeps = (manifest[route.path.slice(1)] ?? []).filter((p) =>
			p.endsWith(".css"),
		);
		const cssLoader = cssDeps
			.map((p) => `<link rel="stylesheet" href="${p}" />`)
			.join("\n");
		const { View, loaderData, viewModule } = await loadRoute({ route });

		const staticRouteParams = viewModule.staticRouteParams ?? [{}];
		if (!route.isStatic && staticRouteParams.length <= 0) continue;

		for (const routeParams of staticRouteParams) {
			let outFilePath = route.pattern;
			for (const [key, value] of Object.entries(routeParams)) {
				outFilePath = outFilePath.replace(`$${key}`, value);
			}
			const outFile = new URL(`dist/${outFilePath}`, root).pathname;
			console.log(`Rendering ${outFilePath}`);
			const result = render(
				<Root initial={{ View, loaderData, routeParams }} />,
			);
			await fs.mkdir(path.dirname(outFile), { recursive: true });
			await fs.writeFile(
				outFile,
				template + cssLoader + render(<>{headChildren}</>) + result,
			);
		}
	}
}

main();
