import { PageContent, PageRoot } from '@/components/layouts/index.jsx';
import { Box } from '@aglio/ui';
import { trpc } from '@/trpc.js';
import { Link, Outlet } from 'react-router-dom';
import { NotFoundPage } from './NotFoundPage.jsx';

export function AdminPage() {
	const { data: isAdmin, isLoading } = trpc.auth.isProductAdmin.useQuery();

	if (!isLoading && !isAdmin) {
		return <NotFoundPage />;
	}

	return (
		<PageRoot>
			<PageContent>
				<Box direction="row" gap={2} mb={6}>
					<Link to="/">Home</Link>
					<Link to="/admin/categories">Categories</Link>
					<Link to="/admin/plans">Plans</Link>
					<Link to="/admin/sync">Sync</Link>
				</Box>
				<Outlet />
			</PageContent>
		</PageRoot>
	);
}

export default AdminPage;
