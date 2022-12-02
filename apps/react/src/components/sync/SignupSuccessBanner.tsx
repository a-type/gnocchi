import { HamburgerMenuIcon } from '@radix-ui/react-icons';
import React, { useEffect, useState } from 'react';
import { Dialog, DialogClose, DialogContent } from '../primitives/Dialog.js';
import { Button, H1, H2, P } from '../primitives/index.js';

export interface SignupSuccessBannerProps {}

export function SignupSuccessBanner({}: SignupSuccessBannerProps) {
	const hasSuccessParam =
		typeof window !== 'undefined' &&
		window.location.search?.includes('success=true');
	const [open, setOpen] = useState(hasSuccessParam);

	useEffect(() => {
		if (hasSuccessParam) {
			window.history.replaceState({}, document.title, window.location.pathname);
		}
	}, [hasSuccessParam]);

	return (
		<Dialog open={open} onOpenChange={setOpen}>
			<DialogContent>
				<H1>Sync activated!</H1>
				<P>
					Now your list will travel with you. Sign in from any device to add and
					update groceries.
				</P>
				<H2>Invite your family or friends</H2>
				<P>
					Use the <HamburgerMenuIcon /> menu to manage your plan and invite
					fellow grocery shoppers or household members.
				</P>
				<DialogClose asChild>
					<Button color="primary">Got it</Button>
				</DialogClose>
			</DialogContent>
		</Dialog>
	);
}
