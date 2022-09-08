import React from 'react';
import { Box } from 'components/primitives/primitives.js';
import { LogoutButton } from 'components/sync/LogoutButton.js';

export function NevermindPage() {
	return (
		<Box>
			<h1>Nevermind?</h1>
			<p>
				You can still use Aglio to create your grocery list on this device, free
				forever.
			</p>
			<p>
				If you change your mind, you can sign up again at any time to sync your
				list to all your devices and share with everyone you shop with.
			</p>
			<LogoutButton color="primary">Back to your list</LogoutButton>
		</Box>
	);
}