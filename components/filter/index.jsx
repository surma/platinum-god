import { useCallback, useMemo } from "preact/hooks";

import classes from "./style.module.css";

export default function Filter({ items, setItems }) {
	const w = useMemo(() => {
		const { readable, writable } = new TransformStream();
		readable.pipeTo(
			new WritableStream({
				async write(ev) {
					const filters = ev.target.value
						.split(" ")
						.filter((v) => v.trim().length > 0);
					setItems(
						items.filter((item) =>
							filters.some(
								(filter) =>
									item.description.includes(filter) ||
									item.tags.includes(filter),
							),
						),
					);
				},
			}),
		);
		return writable;
	}, []);
	const onInput = useCallback((ev) => {
		const writer = w.getWriter();
		writer.write(ev);
		writer.releaseLock();
	}, []);
	return (
		<fieldset className={classes.filter}>
			<legend>Search</legend>
			<input type="search" onInput={onInput} className={classes.input} />
		</fieldset>
	);
}
