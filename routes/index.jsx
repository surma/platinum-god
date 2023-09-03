import { Head } from "/static-remix";
import ItemGrid from "/components/item-grid/";
import { Dialog } from "/components/dialog/";

import items from "/assets/items.json";

export default function Index() {
	return (
		<>
			<h1>Index</h1>
			<Dialog />
			<ItemGrid items={items} />
		</>
	);
}
