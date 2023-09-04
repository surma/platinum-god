import { useCallback, useEffect, useRef, useState } from "preact/hooks";
import { isSSR } from "/static-remix";

import classes from "./style.module.css";

function onClick(ev) {
	const dialog = ev.target.closest("dialog");
	if (!dialog) return;
	if (!dialog.open) return;
	const bb = dialog.getBoundingClientRect();
	if (
		ev.layerX < 0 ||
		ev.layerY < 0 ||
		ev.layerX > bb.width ||
		ev.layerY > bb.height
	)
		hide();
}

let ref;
function show() {
	const d = ref.current;
	if (!d) return;
	if (d.hasAttribute("open")) {
		d.removeAttribute("open");
		d.close();
	}
	if (d.open === true) return;
	ref.current?.showModal();
}

function hide() {
	ref.current?.close();
}

function onClose(ev) {
	history.back();
}

export default function Dialog({ children }) {
	ref = useRef(null);
	useEffect(() => {
		show();
	}, []);
	return (
		<dialog
			ref={ref}
			className={classes.dialog}
			onClick={onClick}
			onClose={onClose}
			open={isSSR()}
		>
			<button onClick={hide} className={classes.close}>
				x
			</button>
			{children}
		</dialog>
	);
}
