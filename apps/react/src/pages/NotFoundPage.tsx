import { PageContent, PageRoot } from '@/components/layouts/index.js';
import { Box } from '@/components/primitives/box/Box.jsx';
import { Button } from '@/components/primitives/index.js';
import { Link } from 'react-router-dom';

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
