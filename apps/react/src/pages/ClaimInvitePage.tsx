import { PageContent, PageRoot } from '@/components/layouts/index.js';
import { Box } from '@aglio/ui';
import { Button, H1, P } from '@aglio/ui';
import { LoginButton } from '@/components/sync/LoginButton.js';
import { API_HOST_HTTP } from '@/config.js';
import { useAuth } from '@/contexts/AuthContext.js';
import { trpc } from '@/trpc.js';
import { useNavigate, useParams } from 'react-router-dom';

export function ClaimInvitePage() {
	const { session, isSubscribed, refetch } = useAuth();

	const navigate = useNavigate();

	const { inviteId } = useParams() as { inviteId: string };

	const { data: inviteInfo } = trpc.invites.details.useQuery(inviteId);

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
			refetch();
			navigate('/');
		} else {
			alert('Error claiming invite');
		}
	};

	if (session) {
		if (isSubscribed) {
			return (
				<PageRoot>
					<PageContent>
						<Box p={2} align="start">
							<P>You already have a subscription.</P>
							<P>
								By claiming this invite you will cancel your current
								subscription and join {inviterName}'s grocery list
							</P>
							<Button align="end" color="primary" onClick={claim}>
								Claim Invite
							</Button>
						</Box>
					</PageContent>
				</PageRoot>
			);
		} else {
			return (
				<PageRoot>
					<PageContent>
						<Box p={2} align="start">
							<H1>Join {inviterName}'s grocery list</H1>
							<P>
								Your current list will be deleted, and you'll begin syncing your
								groceries and recipes with {inviterName}.
							</P>
							<Button align="end" color="primary" onClick={claim}>
								Claim Invite
							</Button>
						</Box>
					</PageContent>
				</PageRoot>
			);
		}
	}

	return (
		<PageRoot>
			<PageContent>
				<Box p={2}>
					<H1>Sign up to join {inviterName}'s grocery list</H1>
					<P>
						Collaborate on shopping together in the store or during the week.
					</P>
					<LoginButton
						align="end"
						color="primary"
						returnTo={`/claim/${inviteId}`}
						inviteId={inviteId}
					>
						Sign up
					</LoginButton>
				</Box>
			</PageContent>
		</PageRoot>
	);
}

export default ClaimInvitePage;
