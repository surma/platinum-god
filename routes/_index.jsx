import { useState } from "preact/hooks";

import { Outlet, Head } from "/static-remix";

import ItemGrid from "/components/item-grid/";
import Filter from "/components/filter/";

import items from "/assets/items.json";

export default function Root() {
	this.componentWillUnmount = () => console.log("_index unmount");
	const [filteredItems, setFilteredItems] = useState(Object.values(items));
	return (
		<>
			{null && (
				<Head>
					<title>Ugly Platinum God</title>
					<meta name="viewport" content="initial-scale=1, width=device-width" />
				</Head>
			)}
			<a href="about.html">About</a>
			<Filter items={items} setItems={setFilteredItems} />
			<Outlet />
			<ItemGrid items={filteredItems} />
		</>
	);
}
