import {
	APP_NAME,
	PRICE_MONTHLY_DOLLARS,
	PRICE_YEARLY_DOLLARS,
} from '@/config.js';
import { sprinkles } from '@aglio/ui/styles';
import { Cross1Icon } from '@radix-ui/react-icons';
import { proxy, useSnapshot } from 'valtio';
import { LoginButton } from './LoginButton.js';
import classNames from 'classnames';
import * as classes from './StartSignupDialog.css.js';
import { DemoFrame } from '@/components/promotional/DemoFrame.jsx';
import {
	Dialog,
	DialogActions,
	DialogClose,
	DialogContent,
	DialogTitle,
} from '@aglio/ui/components/dialog';
import { Box } from '@aglio/ui/components/box';
import { Button } from '@aglio/ui/components/button';
import { H2, P, Span } from '@aglio/ui/components/typography';

export interface StartSignupDialogProps {}

export const signupDialogState = proxy({
	status: 'closed' as 'closed' | 'open',
});

export function StartSignupDialog({}: StartSignupDialogProps) {
	const { status } = useSnapshot(signupDialogState);

	return (
		<Dialog
			open={status !== 'closed'}
			onOpenChange={(open) => {
				if (!open) {
					signupDialogState.status = 'closed';
				}
			}}
		>
			<DialogContent width="lg">
				<Box flexDirection="row" align="flex-start" gap={2}>
					<DialogTitle className={sprinkles({ flex: 1 })}>
						Upgrade for sync &amp; more
					</DialogTitle>
					<DialogClose asChild>
						<Button size="small" color="ghost">
							<Cross1Icon />
						</Button>
					</DialogClose>
				</Box>
				<P>Make {APP_NAME} your household's new grocery list.</P>
				<div className={classes.grid}>
					<div>
						<H2>Sync with family or friends so everyone's on the same page</H2>
						<P>Everyone you invite can add items to the list.</P>
						<H2>Team up at the store with live collaboration</H2>
						<P>
							New items show up on everyone's phone as they're added to the
							list. See who bought what as you go, and claim aisles to shop
							together efficiently.
						</P>
					</div>
					<DemoFrame demo="multiplayer-groceries" />
					<div>
						<H2>More recipe tools</H2>
						<P>
							Unlock the recipe scanner &mdash; just paste a URL and Gnocchi
							will create a copy of the recipe for you.
						</P>
						<P>
							Collaborate on cooking in real-time, assign steps to each cook,
							and stay on the same page.
						</P>
					</div>
					<DemoFrame demo="multiplayer-cooking" />
				</div>

				<DialogActions>
					<Box gap={2} align="center" m="auto" mt={1}>
						<LoginButton
							color="primary"
							returnTo="/"
							onClick={() => (signupDialogState.status = 'closed')}
						>
							Start your subscription
						</LoginButton>
						<Span size="xs">
							${PRICE_MONTHLY_DOLLARS} / month (${PRICE_YEARLY_DOLLARS} / year).
							14 days free. Unlimited devices and collaborators.
						</Span>
					</Box>
				</DialogActions>
			</DialogContent>
		</Dialog>
	);
}
