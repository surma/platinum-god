import { useState } from "preact/hooks";

import { Head } from "/static-remix";
import ItemGrid from "/components/item-grid/";
import Dialog from "/components/dialog/";
import Filter from "/components/filter/";

import items from "/assets/items.json";

export default function Index() {
	const [filteredItems, setFilteredItems] = useState(items);
	return (
		<>
			<a href="about.html">About</a>
			<Dialog />
			<Filter items={items} setItems={setFilteredItems} />
			<ItemGrid items={filteredItems} />
		</>
	);
}
