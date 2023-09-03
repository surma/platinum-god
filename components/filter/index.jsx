import { useCallback, useMemo } from "preact/hooks";
import { isSSR } from "/static-remix";

import classes from "./style.module.css";

export default function Filter({ items, setItems }) {
	const w = useMemo(() => {
		const { readable, writable } = new TransformStream();
		readable.pipeTo(
			new WritableStream({
				async write(ev) {
					const filters = ev.target.value
						.split(" ")
						.filter((v) => v.trim().length > 0)
						.map((v) => v.toLowerCase());
					if (filters.length <= 0) return setItems(items);
					setItems(
						items.filter((item) =>
							filters.some(
								(filter) =>
									item.description.toLowerCase().includes(filter) ||
									item.tags.toLowerCase().includes(filter) ||
									item.itemName.toLowerCase().includes(filter),
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
			{!isSSR() && (
				<>
					<legend>Search</legend>
					<input type="search" onInput={onInput} className={classes.input} />
				</>
			)}
		</fieldset>
	);
}
