import { Dialog, DialogContent } from '../primitives/Dialog.jsx';
import { Button } from '@/components/primitives/index.js';
// @ts-ignore
import { useRegisterSW } from 'virtual:pwa-register/react';
import * as classes from './UpdatePrompt.css.js';
import { StarIcon } from '@radix-ui/react-icons';

export interface UpdatePromptProps {}

const TEST = false;

export function UpdatePrompt({}: UpdatePromptProps) {
	const {
		offlineReady: [offlineReady, setOfflineReady],
		needRefresh: [needRefresh, setNeedRefresh],
		updateServiceWorker,
	} = useRegisterSW({
		// @ts-ignore
		onRegisteredSW(swUrl, r) {
			console.log('Service worker registered', swUrl);
			// @ts-ignore
			if (reloadSW === 'true') {
				r &&
					setInterval(() => {
						r.update();
						// hourly
					}, 60 * 60 * 1000);
			} else {
				console.log('Service worker registered: ' + r);
			}
		},
		// @ts-ignore
		onRegisterError(error) {
			console.error('Service worker registration error', error);
		},
	});

	return (
		<Dialog modal={false} open={needRefresh || TEST}>
			<DialogContent className={classes.content}>
				<div className={classes.contentInner}>
					<div className={classes.text}>
						<StarIcon />
						&nbsp;App update available!
					</div>
					<Button
						color="primary"
						onClick={() => {
							updateServiceWorker(true);
						}}
					>
						Get the latest
					</Button>
				</div>
			</DialogContent>
		</Dialog>
	);
}
