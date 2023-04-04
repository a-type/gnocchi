import { Link } from '@/components/nav/Link.jsx';
import { Box } from '@aglio/ui/components/box';
import { Button } from '@aglio/ui/components/button';
import { PageContent, PageRoot } from '@aglio/ui/components/layouts';

export function NotFoundPage() {
	return (
		<PageRoot>
			<PageContent>
				<Box direction="column" gap={3}>
					Page not found.{' '}
					<Link to="/">
						<Button>Go home</Button>
					</Link>
				</Box>
			</PageContent>
		</PageRoot>
	);
}
