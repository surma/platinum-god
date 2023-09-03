import { defineConfig } from "vite";

export default defineConfig({
	build: {
		target: "esnext",
	},
	esbuild: {
		jsxFactory: "h",
		jsxFragment: "Fragment",
		jsxInject: `
			import {h, Fragment} from "preact";
		`,
	},
});
