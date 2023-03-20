import { useAuth } from '@/hooks/useAuth.jsx';
import { useLocalStorage } from '@/hooks/useLocalStorage.js';
import { useEffect } from 'react';
import {
	Box,
	Button,
	P,
	Dialog,
	DialogClose,
	DialogContent,
	DialogTitle,
} from '@aglio/ui';
import { LoginButton } from '../sync/LoginButton.jsx';

export interface LogoutNoticeProps {}

export function LogoutNotice({}: LogoutNoticeProps) {
	const [wasLoggedIn, setWasLoggedIn] = useLocalStorage('wasLoggedIn', false);
	const { data, error, isInitialLoading: initializing } = useAuth();
	const session = data?.session;

	const wasLoggedInButNowLoggedOut =
		wasLoggedIn && !session && !error && !initializing;

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
				<Box direction="row" gap={3} justify="flex-end" align="center">
					<DialogClose asChild>
						<Button color="ghost">Cancel</Button>
					</DialogClose>
					<DialogClose asChild>
						<LoginButton color="primary">Sign in</LoginButton>
					</DialogClose>
				</Box>
			</DialogContent>
		</Dialog>
	);
}
