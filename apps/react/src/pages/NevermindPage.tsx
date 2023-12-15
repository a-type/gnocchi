import { LogoutButton } from '@/components/auth/LogoutButton.js';
import { NavBar } from '@/components/nav/NavBar.jsx';
import { APP_NAME } from '@/config.js';
import { PageContent, PageRoot } from '@a-type/ui/components/layouts';
import { H1, P } from '@a-type/ui/components/typography';

export function NevermindPage() {
	return (
		<PageContent>
			<div>
				<H1>Nevermind?</H1>
				<P>
					You can still use {APP_NAME} to create your grocery list on this
					device, free forever.
				</P>
				<P>
					If you change your mind, you can sign up again at any time to sync
					your list to all your devices and share with everyone you shop with.
				</P>
				<LogoutButton color="primary">Back to your list</LogoutButton>
			</div>
		</PageContent>
	);
}

export default NevermindPage;
