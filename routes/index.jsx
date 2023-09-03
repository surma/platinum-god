import { Head } from "/static-remix";
import ItemGrid from "/components/item-grid/";

import items from "/assets/items.json";

export default function Index() {
	return (
		<>
			<h1>Index</h1>
			<ItemGrid items={items} />
		</>
	);
}
