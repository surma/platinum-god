import { promises as fs } from "node:fs";
import { chromium } from "playwright";

const baseUrl = new URL("https://platinumgod.co.uk/all-items");
const browser = await chromium.launch();
const page = await browser.newPage();
console.log("Opening platinumgod.co.uk...");
await page.goto(baseUrl.toString(), { waitUntil: "domcontentloaded" });
console.log("Scraping...");
const parsedItems = await page.evaluate(async () => {
	const items = [...document.querySelectorAll("li.textbox")];
	const parsedItems = items.map((item) => {
		const itemId = parseInt(item.dataset.sid, 10);
		const itemName = item.querySelector(".item-title").textContent;
		const description = [...item.querySelectorAll("p")]
			.filter((p) => p.classList.length == 0)
			.map((p) => p.textContent)
			.join("\n");
		const text = item.textContent;
		const cs = window.getComputedStyle(item.querySelector(":scope .item"));
		const image = cs.backgroundImage.slice(5, -2);
		const offset = cs.backgroundPosition
			.split(" ")
			.map((v) => parseInt(v.slice(0, -2), 10));
		return {
			itemId,
			itemName,
			description,
			icon: {
				image,
				offset,
			},
		};
	});
	return parsedItems;
});
await page.close();
await browser.close();
console.log("Saving items...");
const itemsFile = new URL("../assets/items.json", import.meta.url).pathname;
await fs.writeFile(itemsFile, JSON.stringify(parsedItems, null, "  "));
console.log("Downloading sprite maps...");
const bgImages = [...new Set(parsedItems.map((i) => i.icon.image))];
const spritemaps = await Promise.all(
	bgImages.map(async (url) => {
		const imageUrl = new URL(url, baseUrl);
		const filename = imageUrl.pathname.split("/").at(-1);
		return {
			url,
			filename,
			data: await fetch(imageUrl).then((r) => r.arrayBuffer()),
		};
	}),
);
console.log("Saving spritemaps...");
const loaderProps = await Promise.all(
	spritemaps.map(async ({ url, filename, data }) => {
		const spriteFile =
			new URL("../assets/", import.meta.url).pathname + filename;
		await fs.writeFile(spriteFile, new Uint8Array(data));
		const id = filename.replace(/[^a-z0-9]/gi, "_");
		return {
			filename,
			id,
			url,
			imp: `import ${id} from '/assets/${filename}';`,
		};
	}),
);
console.log("Saving spritemap loader...");
const loader = `
	${loaderProps.map(({ imp }) => imp).join("\n")}
	export default {
		${loaderProps.map(({ id, url }) => `${JSON.stringify(url)}: ${id}`).join(",\n")}
	}

`;
const spriteLoaderFile =
	new URL("../assets/", import.meta.url).pathname + "spriteloader.js";
await fs.writeFile(spriteLoaderFile, loader);
