import { Link } from '@/components/nav/Link.jsx';
import { NavBar } from '@/components/nav/NavBar.jsx';
import { Button } from '@aglio/ui/components/button';
import { PageContent, PageRoot } from '@aglio/ui/components/layouts';

export function NotFoundPage() {
	return (
		<PageContent>
			<div className="flex flex-col gap-3">
				<span>Page not found.</span>
				<Link to="/">
					<Button>Go home</Button>
				</Link>
			</div>
		</PageContent>
	);
}
