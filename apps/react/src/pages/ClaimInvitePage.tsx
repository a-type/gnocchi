import { Box, Button } from 'components/primitives/primitives.js';
import { LoginButton } from 'components/sync/LoginButton.js';
import { useAuth } from 'contexts/AuthContext.js';
import React from 'react';
import { useParams } from 'react-router-dom';

export function ClaimInvitePage() {
	const { session } = useAuth();

	const { inviteId } = useParams() as { inviteId: string };

	if (session) {
		if (session.planId) {
			return (
				<Box>
					<div>You already have a subscription.</div>
					<div>
						By claiming this invite you will cancel your current subscription
						and join TODO:XXXX's plan
					</div>
					<Button>Claim Invite</Button>
					{/* TODO: make that button work */}
				</Box>
			);
		} else {
			return (
				<Box>
					<h1>Join XXXX's plan</h1>
					<Button>Claim Invite</Button>
					{/* TODO: make that button work */}
				</Box>
			);
		}
	}

	return (
		<Box>
			<h1>Sign up to join XXXX's plan</h1>
			<LoginButton provider="google" returnTo={`/claim/${inviteId}`}>
				Sign up with Google
			</LoginButton>
		</Box>
	);
}
