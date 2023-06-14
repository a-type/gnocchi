import { trpc } from '@/trpc.js';
import { Outlet } from '@verdant-web/react-router';
import { NotFoundPage } from './NotFoundPage.jsx';
import { PageContent } from '@aglio/ui/components/layouts';
import { Link } from '@/components/nav/Link.jsx';

export function AdminPage() {
	const { data: isAdmin, isLoading } = trpc.auth.isProductAdmin.useQuery();

	if (!isLoading && !isAdmin) {
		return <NotFoundPage />;
	}

	return (
		<PageContent>
			<div class="flex flex-row gap-2 mb-6">
				<Link to="/admin/categories">Categories</Link>
				<Link to="/admin/foods">Foods</Link>
				<Link to="/admin/plans">Plans</Link>
				<Link to="/admin/sync">Sync</Link>
			</div>
			<Outlet />
		</PageContent>
	);
}

export default AdminPage;
