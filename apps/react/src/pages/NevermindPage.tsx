import { LogoutButton } from '@/components/sync/LogoutButton.js';
import { PageContent, PageRoot } from '@/components/layouts/index.js';
import { Box } from '@/components/primitives/box/Box.jsx';
import { H1, P } from '@/components/primitives/index.js';

export function NevermindPage() {
	return (
		<PageRoot>
			<PageContent>
				<Box>
					<H1>Nevermind?</H1>
					<P>
						You can still use Aglio to create your grocery list on this device,
						free forever.
					</P>
					<P>
						If you change your mind, you can sign up again at any time to sync
						your list to all your devices and share with everyone you shop with.
					</P>
					<LogoutButton color="primary">Back to your list</LogoutButton>
				</Box>
			</PageContent>
		</PageRoot>
	);
}
