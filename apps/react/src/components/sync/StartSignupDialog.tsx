import {
	APP_NAME,
	PRICE_MONTHLY_DOLLARS,
	PRICE_YEARLY_DOLLARS,
} from '@/config.js';
import { Cross1Icon } from '@radix-ui/react-icons';
import { useSnapshot } from 'valtio';
import { LoginButton } from './LoginButton.js';
import { DemoFrame } from '@/components/promotional/DemoFrame.jsx';
import {
	Dialog,
	DialogActions,
	DialogClose,
	DialogContent,
	DialogTitle,
} from '@a-type/ui/components/dialog';
import { Button } from '@a-type/ui/components/button';
import { H2, P } from '@a-type/ui/components/typography';
import { signupDialogState } from '@/components/sync/state.js';

export interface StartSignupDialogProps {}

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
				<div className="flex flex-row items-start gap-2">
					<DialogTitle className="flex-1">
						Upgrade for sync &amp; more
					</DialogTitle>
					<DialogClose asChild>
						<Button size="small" color="ghost">
							<Cross1Icon />
						</Button>
					</DialogClose>
				</div>
				<P className="mb-4">
					Make {APP_NAME} your household's new grocery list.
				</P>
				<div className="grid grid-cols-[1fr] gap-3 md:grid-cols-[2fr_1fr]">
					<div className="flex flex-col">
						<H2 className="mb-2">
							Sync with family or friends so everyone's on the same page
						</H2>
						<P className="mb-4">
							Everyone you invite can add items to the list.
						</P>
						<H2 className="mb-2">
							Team up at the store with live collaboration
						</H2>
						<P>
							New items show up on everyone's phone as they're added to the
							list. See who bought what as you go, and claim aisles to shop
							together efficiently.
						</P>
					</div>
					<DemoFrame demo="multiplayer-groceries" />
					<div>
						<H2 className="mb-2">More recipe tools</H2>
						<P className="mb-4">
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
					<div className="flex flex-col gap-2 items-center m-auto mt-1">
						<LoginButton
							color="primary"
							returnTo="/"
							onClick={() => (signupDialogState.status = 'closed')}
						>
							Join the club
						</LoginButton>
						<span className="text-xs">
							${PRICE_MONTHLY_DOLLARS} / month (${PRICE_YEARLY_DOLLARS} / year).
							14 days free. Unlimited devices and collaborators.
						</span>
					</div>
				</DialogActions>
			</DialogContent>
		</Dialog>
	);
}
