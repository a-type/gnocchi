import { useAuth } from '@/contexts/AuthContext.jsx';
import { useLocalStorage } from '@/hooks/useLocalStorage.js';
import { useEffect } from 'react';
import {
	Dialog,
	DialogClose,
	DialogContent,
	DialogTitle,
} from '../primitives/Dialog.jsx';
import { Box, Button, P } from '../primitives/index.js';
import { LoginButton } from '../sync/LoginButton.jsx';

export interface LogoutNoticeProps {}

export function LogoutNotice({}: LogoutNoticeProps) {
	const [wasLoggedIn, setWasLoggedIn] = useLocalStorage('wasLoggedIn', false);
	const { session, error } = useAuth();

	const wasLoggedInButNowLoggedOut = wasLoggedIn && !session && !error;

	// only want to fire this when session changes, not when flag changes.
	// flag can be reset manually.
	useEffect(() => {
		if (session) {
			setWasLoggedIn(true);
		}
	}, [session]);

	return (
		<Dialog open={wasLoggedInButNowLoggedOut} onOpenChange={setWasLoggedIn}>
			<DialogContent>
				<DialogTitle>Session expired</DialogTitle>
				<P>To resume syncing your data, please sign in again.</P>
				<Box direction="row" gap={3} justify="end" align="center">
					<DialogClose asChild>
						<Button color="ghost">Cancel</Button>
					</DialogClose>
					<LoginButton color="primary">Sign in</LoginButton>
				</Box>
			</DialogContent>
		</Dialog>
	);
}
