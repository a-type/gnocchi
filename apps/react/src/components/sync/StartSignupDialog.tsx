import { Cross1Icon } from '@radix-ui/react-icons';
import React, { ReactNode } from 'react';
import {
	Dialog,
	DialogClose,
	DialogContent,
	DialogTitle,
	DialogTrigger,
} from '../primitives/Dialog.js';
import { Box, Button, H2, P, Span } from '../primitives/primitives.js';
import { LoginButton } from './LoginButton.js';

export interface StartSignupDialogProps {
	children: ReactNode;
}

export function StartSignupDialog({ children }: StartSignupDialogProps) {
	return (
		<Dialog>
			<DialogTrigger asChild>{children}</DialogTrigger>
			<DialogContent>
				<Box direction="row" align="start" gap={2}>
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
				<H2>Sync with family or roommates so everyone's on the same page</H2>
				<P>Everyone you invite can add items to the list.</P>
				<H2>Team up at the store with live collaboration</H2>
				<P>
					See who's buying what, assign aisles, and easily tell fellow shoppers
					where to meet up.
				</P>
				<H2>Coordinate with folks at home</H2>
				<P>
					Has the milk gone bad? Ask a question right in the app, and a friend
					or partner will get a push notification to check the fridge for you
					while you're at the store.
				</P>

				<Box gap={2} align="center" css={{ m: 'auto', mt: '$8' }}>
					<LoginButton provider="google" returnTo="/">
						Start your subscription
					</LoginButton>
					<Span size="xs">
						14 days free. Unlimited devices and collaborators.
					</Span>
				</Box>
			</DialogContent>
		</Dialog>
	);
}
