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
		dialog.close();
}

function show(ref) {
	if (!ref) return;
	if (ref?.open) return;
	ref?.showModal();
}

function hide(ev) {
	ev.target.closest("dialog")?.close();
}

function onClose(ev) {
	history.back();
}

export default function Dialog({ children }) {
	return (
		<dialog
			ref={show}
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
