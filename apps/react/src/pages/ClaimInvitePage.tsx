import { Box, Button, H1, P } from '@/components/primitives/primitives.js';
import { LoginButton } from '@/components/sync/LoginButton.js';
import { API_HOST_HTTP } from '@/config.js';
import { useAuth } from '@/contexts/AuthContext.js';
import { trpc } from '@/trpc.js';
import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';

export function ClaimInvitePage() {
	const { session } = useAuth();

	const navigate = useNavigate();

	const { inviteId } = useParams() as { inviteId: string };

	const { data: inviteInfo } = trpc.useQuery(['invites.details', inviteId]);

	const inviterName = inviteInfo?.inviterName || '...';

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
				<Box p={8} align="start">
					<P>You already have a subscription.</P>
					<P>
						By claiming this invite you will cancel your current subscription
						and join {inviterName}'s grocery list
					</P>
					<Button color="primary" onClick={claim}>
						Claim Invite
					</Button>
				</Box>
			);
		} else {
			return (
				<Box p={8} align="start">
					<H1>Join {inviterName}'s grocery list</H1>
					<Button color="primary" onClick={claim}>
						Claim Invite
					</Button>
				</Box>
			);
		}
	}

	return (
		<Box p={8}>
			<H1>Sign up to join {inviterName}'s grocery list</H1>
			<P>Collaborate on shopping together in the store or during the week.</P>
			<LoginButton
				color="primary"
				provider="google"
				returnTo={`/claim/${inviteId}`}
				inviteId={inviteId}
			>
				Sign up with Google
			</LoginButton>
		</Box>
	);
}
