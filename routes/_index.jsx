import { Outlet, Head } from "/static-remix";

export default function Root() {
	return (
		<>
			<Head>
				<title>Ugly Platinum God</title>
				<meta name="viewport" content="initial-scale=1, width=device-width" />
			</Head>
			<Outlet />
		</>
	);
}
