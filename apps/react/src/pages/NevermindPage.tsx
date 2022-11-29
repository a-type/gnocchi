import { LogoutButton } from '@/components/sync/LogoutButton.js';
import { PageContent, PageRoot } from '@/components/layouts/index.js';
import { Box } from '@/components/primitives/box/Box.jsx';

export function NevermindPage() {
	return (
		<PageRoot>
			<PageContent>
				<Box>
					<h1>Nevermind?</h1>
					<p>
						You can still use Aglio to create your grocery list on this device,
						free forever.
					</p>
					<p>
						If you change your mind, you can sign up again at any time to sync
						your list to all your devices and share with everyone you shop with.
					</p>
					<LogoutButton color="primary">Back to your list</LogoutButton>
				</Box>
			</PageContent>
		</PageRoot>
	);
}
