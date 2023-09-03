import { Outlet, Head } from "/static-remix";

export default function Root() {
	return (
		<>
			<Head>
				<title>Platinum God</title>
			</Head>
			<Outlet />
		</>
	);
}
