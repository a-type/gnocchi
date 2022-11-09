import { AdminCategoryManager } from '@/components/groceries/categories/AdminCategoryManager.jsx';
import { PageContent, PageRoot } from '@/components/layouts/index.jsx';
import { trpc } from '@/trpc.js';
import { Link } from 'react-router-dom';
import { NotFoundPage } from './NotFoundPage.jsx';

export function AdminPage() {
	const { data: isAdmin, isLoading } = trpc.useQuery(['auth.isProductAdmin']);

	if (!isLoading && !isAdmin) {
		return <NotFoundPage />;
	}

	return (
		<PageRoot>
			<PageContent>
				<Link to="/">Home</Link>
				<AdminCategoryManager />
			</PageContent>
		</PageRoot>
	);
}
