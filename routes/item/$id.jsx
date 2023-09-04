import { useState } from "preact/hooks";

import { useRouteParams } from "/static-remix";

import Dialog from "/components/dialog/";

import items from "/assets/items.json";

export const staticRouteParams = [{ id: 3 }];

function ItemDescription({ id }) {
	const item = items[id];
	return (
		<>
			<h1>{item.name}</h1>
			{item.description.split("\n").map((l) => (
				<p>{l}</p>
			))}
		</>
	);
}

export default function Item() {
	const params = useRouteParams();
	return (
		<>
			<Dialog>
				<ItemDescription id={params.id} />
			</Dialog>
		</>
	);
}
