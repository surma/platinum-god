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

function ItemDescription({ item }) {
	return (
		<>
			<h1>{item.itemName}</h1>
			{item.description.split("\n").map((l) => (
				<p>{l}</p>
			))}
		</>
	);
}

function Item({ item }) {
	return (
		<a
			href={`/item/${item.itemId}.html`}
			className={classes.item}
			style={`
				--bgimg: url(${sprites[item.icon.image]});
				--bg-x: ${item.icon.offset[0]}px; 
			  --bg-y: ${item.icon.offset[1]}px;
				--icon-width: ${item.icon.width}px;
				--icon-height: ${item.icon.height}px;
			`}
		></a>
	);
}
