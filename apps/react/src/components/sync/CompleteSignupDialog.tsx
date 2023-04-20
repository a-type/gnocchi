import { SubscriptionError } from '@aglio/tools';
import { useAuth } from '@/hooks/useAuth.jsx';
import { LogoutButton } from '../auth/LogoutButton.js';
import { SubscribeButton } from './SubscribeButton.js';
import { H2, P } from '@aglio/ui/components/typography';
import { Dialog, DialogContent } from '@aglio/ui/components/dialog';
import { Box } from '@aglio/ui/components/box';
import {
	CollapsibleContent,
	CollapsibleRoot,
	CollapsibleTrigger,
} from '@aglio/ui/components/collapsible';
import { Button } from '@aglio/ui/components/button';
import { TextLink } from '@/components/nav/Link.jsx';
import { sprinkles } from '@aglio/ui/styles';

export interface CompleteSignupDialogProps {}

export function CompleteSignupDialog({}: CompleteSignupDialogProps) {
	const { data } = useAuth();
	const { session, subscriptionStatus } = data || {};

	const open =
		!!session && subscriptionStatus === SubscriptionError.NoSubscription;

	return (
		<Dialog open={open}>
			<DialogContent className={sprinkles({ gap: 2 })}>
				<H2>Complete Signup</H2>
				<P>
					Now that you're signed in, finish creating your subscription to start
					syncing and sharing your list!
				</P>
				<SubscribeButton />
				<P>
					Or, if you changed your mind about subscribing, you can just log out
					and keep using your list on this device.
				</P>
				<LogoutButton>Log out</LogoutButton>
				<Box mt={4}>
					<CollapsibleRoot>
						<CollapsibleTrigger asChild>
							<Button color="ghost" size="small">
								What happened to my subscription?
							</Button>
						</CollapsibleTrigger>
						<CollapsibleContent>
							<P>
								If you're paying for a subscription and you didn't cancel,{' '}
								<TextLink to="mailto:hi@gnocchi.club">contact me</TextLink> and
								I'll get it sorted out.
							</P>
							<P>
								If you were a member of someone else's subscription, it's
								possible they removed you.
							</P>
							<P>
								If you think this is a mistake, please{' '}
								<TextLink to="mailto:hi@gnocchi.club">contact me</TextLink>.
							</P>
						</CollapsibleContent>
					</CollapsibleRoot>
				</Box>
			</DialogContent>
		</Dialog>
	);
}
