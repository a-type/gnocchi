import { Box, Button } from '@/components/primitives/primitives.js';
import { LoginButton } from '@/components/sync/LoginButton.js';
import { API_HOST_HTTP } from '@/config.js';
import { useAuth } from '@/contexts/AuthContext.js';
import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';

export function ClaimInvitePage() {
	const { session } = useAuth();

	const navigate = useNavigate();

	const { inviteId } = useParams() as { inviteId: string };

	const claim = async () => {
		const res = await fetch(
			`${API_HOST_HTTP}/api/plan/invite/claim/${inviteId}`,
			{
				method: 'post',
				credentials: 'include',
			},
		);

		if (res.ok) {
			navigate('/');
		} else {
			alert('Error claiming invite');
		}
	};

	if (session) {
		if (session.planId) {
			return (
				<Box>
					<div>You already have a subscription.</div>
					<div>
						By claiming this invite you will cancel your current subscription
						and join TODO:XXXX's plan
					</div>
					<Button onClick={claim}>Claim Invite</Button>
				</Box>
			);
		} else {
			return (
				<Box>
					<h1>Join XXXX's plan</h1>
					<Button onClick={claim}>Claim Invite</Button>
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
