import ItemIcon from "/components/item-icon/";

import classes from "./style.module.css";
import sprites from "/assets/spriteloader.js";

export default function ItemGrid({ items }) {
	return (
		<div className={classes.grid}>
			{items.map((item) => (
				<Item item={item} />
			))}
		</div>
	);
}

function Item({ item }) {
	return (
		<a href={`/item/${item.id}.html`} className={classes.item}>
			<ItemIcon item={item} />
		</a>
	);
}
