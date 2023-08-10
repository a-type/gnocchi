import { DemoFrame } from '@/components/promotional/DemoFrame.jsx';
import { LoginButton } from '@/components/sync/LoginButton.js';
import { API_HOST_HTTP } from '@/config.js';
import { useAuth } from '@/hooks/useAuth.jsx';
import { usePageTitle } from '@/hooks/usePageTitle.jsx';
import { trpc } from '@/trpc.js';
import { Button } from '@aglio/ui/components/button';
import { PageContent, PageRoot } from '@aglio/ui/components/layouts';
import { H1, P } from '@aglio/ui/components/typography';
import { useNavigate, useParams } from '@verdant-web/react-router';

export function ClaimInvitePage() {
	const { data, refetch } = useAuth();
	const { session, isSubscribed } = data || {};

	usePageTitle('Claim Invite');

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
						<div className="flex flex-col items-start p-2">
							<P>You already have a subscription.</P>
							<P>
								By claiming this invite you will cancel your current
								subscription and join {inviterName}'s grocery list
							</P>
							<Button align="end" color="primary" onClick={claim}>
								Claim Invite
							</Button>
						</div>
					</PageContent>
				</PageRoot>
			);
		} else {
			return (
				<PageRoot>
					<PageContent>
						<div className="flex flex-col items-start p-2">
							<H1>Join {inviterName}'s grocery list</H1>
							<P>
								Your current list will be deleted, and you'll begin syncing your
								groceries and recipes with {inviterName}.
							</P>
							<Button align="end" color="primary" onClick={claim}>
								Claim Invite
							</Button>
						</div>
					</PageContent>
				</PageRoot>
			);
		}
	}

	return (
		<PageRoot>
			<PageContent>
				<div className="flex flex-col p-2 gap-6">
					<img src="/android-chrome-192x192.png" className="w-40px h-40px" />

					<H1>Sign up to join {inviterName}'s grocery list</H1>
					<div className="flex flex-row gap-4">
						<DemoFrame demo="multiplayer-groceries" />
						<DemoFrame demo="multiplayer-cooking" />
					</div>
					<P>
						Collaborate on shopping together in the store or during the week.
					</P>
					<P>
						Collect recipes and cook as a team with live progress tracking and
						step assignment.
					</P>
					<LoginButton
						align="end"
						color="primary"
						returnTo={`/claim/${inviteId}`}
						inviteId={inviteId}
					>
						Sign up
					</LoginButton>
				</div>
			</PageContent>
		</PageRoot>
	);
}

export default ClaimInvitePage;
