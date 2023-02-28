import { Button, Dialog, DialogContent } from '@aglio/ui';
import { useRegisterSW } from 'virtual:pwa-register/react';
import * as classes from './UpdatePrompt.css.js';
import { StarIcon } from '@radix-ui/react-icons';

export interface UpdatePromptProps {}

const TEST = false;

export function UpdatePrompt({}: UpdatePromptProps) {
	const {
		needRefresh: [needRefresh],
		updateServiceWorker,
	} = useRegisterSW({
		// @ts-ignore
		onRegisteredSW(swUrl, r) {
			console.log('Service worker registered', swUrl);
			r &&
				setInterval(() => {
					r.update();
					// hourly
				}, 60 * 60 * 1000);
		},
		// @ts-ignore
		onRegisterError(error) {
			console.error('Service worker registration error', error);
		},
	});

	return (
		<Dialog modal={false} open={needRefresh || TEST}>
			<DialogContent outerClassName={classes.content}>
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
