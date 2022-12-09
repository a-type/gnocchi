import { PageContent, PageRoot } from '@/components/layouts/index.jsx';
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
				<Link to="/">Home</Link>
				<Link to="/admin/categories">Categories</Link>
				<Link to="/admin/feature-flags">Feature Flags</Link>
				<Outlet />
			</PageContent>
		</PageRoot>
	);
}
