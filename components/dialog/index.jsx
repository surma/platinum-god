import { useCallback, useEffect, useRef, useState } from "preact/hooks";

import classes from "./style.module.css";

function onClick(ev) {
	if (!ref.current) return;
	if (!ref.current.open) return;
	const bb = ref.current.getBoundingClientRect();
	if (
		ev.layerX < 0 ||
		ev.layerY < 0 ||
		ev.layerX > bb.width ||
		ev.layerY > bb.height
	)
		hide();
}

let ref;
let content, setContent;
export default function Dialog() {
	ref = useRef(null);
	[content, setContent] = useState(null);

	return (
		<dialog ref={ref} className={classes.dialog} onClick={onClick}>
			<button onClick={() => hide()} className={classes.close}>
				x
			</button>
			{content}
		</dialog>
	);
}

export function show(children) {
	if (!ref.current) return;
	setContent(children);
	ref.current.showModal();
}

export function hide() {
	if (!ref.current) return;
	ref.current.close();
}
