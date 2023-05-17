import {
	Dialog,
	DialogActions,
	DialogClose,
	DialogContent,
} from '@aglio/ui/components/dialog';
import { H1, P } from '@aglio/ui/components/typography';
import { HamburgerMenuIcon } from '@radix-ui/react-icons';
import { useState } from 'react';
import { useSearchParams } from '@verdant-web/react-router';
import { InviteLinkButton } from './InviteLinkButton.jsx';
import { Button } from '@aglio/ui/components/button';
import { Link } from '@/components/nav/Link.jsx';

export interface SignupSuccessBannerProps {}

export function SignupSuccessBanner({}: SignupSuccessBannerProps) {
	const [searchParams] = useSearchParams();
	const hasSuccessParam = !!searchParams.get('success');
	const [open, setOpen] = useState(() => hasSuccessParam);

	return (
		<Dialog open={open} onOpenChange={setOpen}>
			<DialogContent className="items-start">
				<H1>You're subscribed!</H1>
				<P>
					<Link newTab className="font-bold" to="/welcome?upgrade=true">
						Click here
					</Link>{' '}
					to learn more about what you get with your subscription - including
					sync, recipe scanning, and more.
				</P>
				<InviteLinkButton color="primary" className="my-3" />
				<P>
					As a paid subscriber you can invite any number of people to shop and
					cook with you, for free.
				</P>
				<P size="sm">
					(You can find this option in the <HamburgerMenuIcon /> menu at any
					time. You can also manage or cancel your subscription there.)
				</P>
				<DialogActions>
					<DialogClose asChild>
						<Button color="primary">Got it</Button>
					</DialogClose>
				</DialogActions>
			</DialogContent>
		</Dialog>
	);
}
