import { sprinkles } from '@aglio/ui';
import { HamburgerMenuIcon } from '@radix-ui/react-icons';
import React, { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import {
	Dialog,
	DialogClose,
	DialogContent,
	Button,
	H1,
	H2,
	P,
	DialogActions,
} from '@aglio/ui';
import { InviteLinkButton } from './InviteLinkButton.jsx';

export interface SignupSuccessBannerProps {}

export function SignupSuccessBanner({}: SignupSuccessBannerProps) {
	const [searchParams] = useSearchParams();
	const hasSuccessParam = !!searchParams.get('success');
	const [open, setOpen] = useState(() => hasSuccessParam);

	return (
		<Dialog open={open} onOpenChange={setOpen}>
			<DialogContent className={sprinkles({ align: 'flex-start' })}>
				<H1>You're subscribed!</H1>
				<P>
					<Link
						target="_blank"
						rel="noopener noreferrer"
						className={sprinkles({ fontWeight: 'bold' })}
						to="/subscriber-features"
					>
						Click here
					</Link>{' '}
					to learn more about what you get with your subscription - including
					sync, recipe scanning, and more.
				</P>
				<InviteLinkButton color="primary" className={sprinkles({ my: 3 })} />
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
