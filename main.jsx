import { hydrate } from "/static-remix";

import "preact/devtools";
if (import.meta.env.DEV) {
	await import("preact/debug");
}

hydrate(document.body);
