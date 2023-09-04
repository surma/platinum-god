import classes from "./style.module.css";
import sprites from "/assets/spriteloader.js";

export default function ItemIcon({ item, className = "", style = "" }) {
	return (
		<div
			className={classes.icon + " " + className}
			style={`
				--bgimg: url(${sprites[item.icon.image]});
				--bg-x: ${item.icon.offset[0]}px; 
				--bg-y: ${item.icon.offset[1]}px;
				--icon-width: ${item.icon.width}px;
				--icon-height: ${item.icon.height}px;
			`}
		/>
	);
}
