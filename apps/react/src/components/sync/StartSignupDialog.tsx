import { Cross1Icon } from '@radix-ui/react-icons';
import { proxy, useSnapshot } from 'valtio';
import { Box } from '../primitives/box/Box.jsx';
import {
	Dialog,
	DialogClose,
	DialogContent,
	DialogTitle,
	DialogTrigger,
} from '../primitives/Dialog.js';
import { Button, H2, P, Span } from '../primitives/primitives.js';
import { LoginButton } from './LoginButton.js';

export interface StartSignupDialogProps {}

export const state = proxy({
	status: 'closed' as 'closed' | 'open',
});

export function StartSignupDialog({}: StartSignupDialogProps) {
	const { status } = useSnapshot(state);

	return (
		<Dialog
			open={status !== 'closed'}
			onOpenChange={(open) => {
				if (!open) {
					state.status = 'closed';
				}
			}}
		>
			<DialogContent width="md">
				<Box flexDirection="row" align="start" gap={2}>
					<DialogTitle css={{ flex: 1 }}>
						Subscribe for sync &amp; more
					</DialogTitle>
					<DialogClose asChild>
						<Button size="small" color="ghost">
							<Cross1Icon />
						</Button>
					</DialogClose>
				</Box>
				<P>Make Aglio your household's new grocery list.</P>
				<H2>Sync with family or friends so everyone's on the same page</H2>
				<P>Everyone you invite can add items to the list.</P>
				<H2>Team up at the store with live collaboration</H2>
				<P>
					New items show up on everyone's phone as they're added to the list.
					See who bought what as you go.
				</P>
				<H2>Add recipes from the web</H2>
				<P>
					Unlock the recipe scanner &mdash; just paste a URL and we'll add the
					ingredients for you.
				</P>
				{/* <H2>Coordinate with folks at home</H2>
				<P>
					Has the milk gone bad? Ask a question right in the app, and a friend
					or partner will get a push notification to check the fridge for you
					while you're at the store.
				</P> */}

				<Box gap={2} align="center" m="auto" mt={8}>
					<LoginButton color="primary" provider="google" returnTo="/">
						Start your subscription
					</LoginButton>
					<Span size="xs">
						$3 / month ($36 / year). 14 days free. Unlimited devices and
						collaborators.
					</Span>
				</Box>
			</DialogContent>
		</Dialog>
	);
}
