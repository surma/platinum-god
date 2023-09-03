export function isSSR() {
	return !!import.meta.env.SSR;
}

export function wait(ms) {
	return new Promise((resolve) => setTimeout(resolve, ms));
}
