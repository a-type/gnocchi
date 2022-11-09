import { PageContent, PageRoot } from '@/components/layouts/index.js';
import { Box, Button } from '@/components/primitives/primitives.jsx';
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
