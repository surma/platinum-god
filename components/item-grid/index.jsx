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
		<div
			className={classes.item}
			style={`--bgimg: url(${sprites[item.icon.image]}); --bg-x: ${
				item.icon.offset[0]
			}; --bg-y: ${item.icon.offset[1]}`}
		></div>
	);
}
