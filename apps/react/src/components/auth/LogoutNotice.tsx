import { useAuth } from '@/hooks/useAuth.jsx';
import { useLocalStorage } from '@/hooks/useLocalStorage.js';
import { useEffect, useState } from 'react';
import { LoginButton } from '../sync/LoginButton.jsx';
import {
	Dialog,
	DialogClose,
	DialogContent,
	DialogTitle,
} from '@a-type/ui/components/dialog';
import { P } from '@a-type/ui/components/typography';
import { Button } from '@a-type/ui/components/button';

export interface LogoutNoticeProps {}

export function LogoutNotice({}: LogoutNoticeProps) {
	const [wasLoggedIn, setWasLoggedIn] = useLocalStorage('wasLoggedIn', false);
	const { data, error, isInitialLoading: initializing } = useAuth();
	const session = data?.session;
	const [close, setClose] = useState(false);

	const wasLoggedInButNowLoggedOut =
		!close && wasLoggedIn && !session && !error && !initializing;

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
				<div className="flex flex-row gap-3 justify-end items-center">
					<DialogClose asChild>
						<Button color="ghost">Cancel</Button>
					</DialogClose>
					<DialogClose asChild>
						<LoginButton color="primary" onClick={() => setClose(true)}>
							Sign in
						</LoginButton>
					</DialogClose>
				</div>
			</DialogContent>
		</Dialog>
	);
}
