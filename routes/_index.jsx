import { useState } from "preact/hooks";

import { Outlet, Head } from "/static-remix";

import ItemGrid from "/components/item-grid/";
import Dialog from "/components/dialog/";
import Filter from "/components/filter/";

import items from "/assets/items.json";

export default function Root() {
	const [filteredItems, setFilteredItems] = useState(Object.values(items));
	return (
		<>
			<Head>
				<title>Ugly Platinum God</title>
				<meta name="viewport" content="initial-scale=1, width=device-width" />
			</Head>
			<a href="about.html">About</a>
			<Outlet />
			<Filter items={items} setItems={setFilteredItems} />
			<ItemGrid items={filteredItems} />
		</>
	);
}
