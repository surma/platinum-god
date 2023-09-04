import { useState } from "preact/hooks";

import { useRouteParams } from "/static-remix";

import Dialog from "/components/dialog/";
import ItemIcon from "/components/item-icon";

import items from "/assets/items.json";

import classes from "./$id.style.module.css";

export const staticRouteParams = Object.keys(items).map((id) => ({ id }));

function ItemDescription({ id }) {
	const item = items[id];
	return (
		<>
			<h1 className={classes.title}>
				{item.name}
				<ItemIcon item={item} />
			</h1>
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
