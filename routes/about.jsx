import { useState } from "preact/hooks";

export default function Index() {
	return (
		<>
			<h1>Ugly Platinum God</h1>
			<a href="/">Back</a>
			<p>
				This site exposes the same data as{" "}
				<a href="https://platinumgod.co.uk">Platinum God</a>, but looks
				considerably worse. It also has a faster search, so that’s nice.
			</p>
			<p>
				Made with 😭 by <a href="https://twitter.com/dassurma">Surma</a>. Code
				on <a href="https://github.com/surma/platinum-god">GitHub</a>.
			</p>
		</>
	);
}
