import { useAuth } from '@/contexts/AuthContext.jsx';
import { sprinkles } from '@/styles/sprinkles.css.js';
import { Dialog, DialogContent, DialogTitle } from '../primitives/Dialog.jsx';
import { Button, P } from '../primitives/index.js';

export interface DomainChangeDialogProps {}

export function DomainChangeDialog({}: DomainChangeDialogProps) {
	const isOldDomain =
		typeof window !== 'undefined' &&
		window.location.hostname.includes('aglio.app');

	const auth = useAuth();

	if (isOldDomain) {
		return (
			<Dialog open>
				<DialogContent className={sprinkles({ alignItems: 'start' })}>
					<DialogTitle>Aglio is now Gnocchi</DialogTitle>
					<P>Hi there! I rebranded the app! It's called Gnocchi now.</P>
					<P>
						It's the same app, just a new name. You can find it at{' '}
						<a href="https://gnocchi.club">
							<b>gnocchi.club</b>
						</a>
						.
					</P>
					<P>
						Sorry for the inconvenience, but you'll have to log in again. Your
						list will sync back up automatically.
					</P>
					<P className={sprinkles({ fontWeight: 'bold' })}>
						If you've added Aglio to your home screen, you'll need to remove it
						and add Gnocchi instead.
					</P>
					<a
						href={
							auth.session
								? 'https://gnocchi.club/join'
								: 'https://gnocchi.club'
						}
					>
						<Button color="primary">Go to Gnocchi</Button>
					</a>
				</DialogContent>
			</Dialog>
		);
	}
	return null;
}
