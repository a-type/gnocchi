import { trpc } from '@/trpc.js';
import { Outlet } from '@lo-fi/react-router';
import { NotFoundPage } from './NotFoundPage.jsx';
import { PageContent, PageRoot } from '@aglio/ui/components/layouts';
import { Box } from '@aglio/ui/components/box';
import { Link } from '@/components/nav/Link.jsx';

export function AdminPage() {
	const { data: isAdmin, isLoading } = trpc.auth.isProductAdmin.useQuery();

	if (!isLoading && !isAdmin) {
		return <NotFoundPage />;
	}

	return (
		<PageRoot>
			<PageContent>
				<Box direction="row" gap={2} mb={6}>
					<Link to="/admin/categories">Categories</Link>
					<Link to="/admin/foods">Foods</Link>
					<Link to="/admin/plans">Plans</Link>
					<Link to="/admin/sync">Sync</Link>
				</Box>
				<Outlet />
			</PageContent>
		</PageRoot>
	);
}

export default AdminPage;
