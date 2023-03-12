import { SubscriptionError } from '@aglio/tools';
import {
	Box,
	Button,
	CollapsibleContent,
	CollapsibleRoot,
	CollapsibleTrigger,
	Dialog,
	DialogContent,
	P,
	TextLink,
	sprinkles,
} from '@aglio/ui';
import { useAuth } from '@/contexts/AuthContext.js';
import { LogoutButton } from '../auth/LogoutButton.js';
import { SubscribeButton } from './SubscribeButton.js';
import { H2 } from '@aglio/ui';

export interface CompleteSignupDialogProps {}

export function CompleteSignupDialog({}: CompleteSignupDialogProps) {
	const { session, subscriptionStatus } = useAuth();

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
								<TextLink href="mailto:hi@gnocchi.club">contact me</TextLink>{' '}
								and I'll get it sorted out.
							</P>
							<P>
								If you were a member of someone else's subscription, it's
								possible they removed you.
							</P>
							<P>
								If you think this is a mistake, please{' '}
								<TextLink href="mailto:hi@gnocchi.club">contact me</TextLink>.
							</P>
						</CollapsibleContent>
					</CollapsibleRoot>
				</Box>
			</DialogContent>
		</Dialog>
	);
}
