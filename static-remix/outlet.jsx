import { createContext, render } from "preact";
import { useContext, useEffect, useLayoutEffect, useState } from "preact/hooks";
import { isSSR } from "./utils.jsx";

export const OutletContext = createContext(null);

export function Outlet() {
	return useContext(OutletContext);
}

export let headChildren = [];
export const HeadContext = createContext({ list: [] });

const headOutletMarker = "headoutlet";

export function Head({ children }) {
	const childrenList = Array.isArray(children) ? children : [children];
	const ctx = useContext(HeadContext);
	ctx.list = [...ctx.list, ...childrenList];
	headChildren = [...headChildren, ...childrenList];
	return null;
}

export function HeadRoot({ children }) {
	if (isSSR()) {
		headChildren = [];
	} else {
		useEffect(() => {
			headChildren = [];
		}, [children]);
	}

	if (!isSSR()) {
		useLayoutEffect(() => {
			let headElem = [...document.head.childNodes].find(
				(n) => n.nodeType === 8 && n.data === headOutletMarker,
			);
			if (!headElem) {
				headElem = document.createComment(headOutletMarker);
				document.head.prepend(headElem);
			}
			while (headElem.previousSibling) headElem.previousSibling.remove();
			const c = document.createElement("div");
			render(<>{headChildren}</>, c);
			headElem.before(...c.childNodes);
		}, [headChildren]);
	}

	return (
		<HeadContext.Provider value={{ list: [] }}>{children}</HeadContext.Provider>
	);
}
