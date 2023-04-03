import { Dialog, DialogContent } from '@aglio/ui/components/dialog';
import { useRegisterSW } from 'virtual:pwa-register/react';
import * as classes from './UpdatePrompt.css.js';
import { StarIcon } from '@radix-ui/react-icons';
import { useState } from 'react';
import { Button } from '@aglio/ui/components/button';

export interface UpdatePromptProps {}

const TEST = false;

export function UpdatePrompt({}: UpdatePromptProps) {
	const {
		needRefresh: [needRefresh],
		updateServiceWorker,
	} = useRegisterSW({
		onRegisteredSW(swUrl, registration) {
			console.log('Service worker registered', swUrl);
			if (registration) {
				setInterval(() => {
					registration.update();
					// hourly
				}, 60 * 60 * 1000);
			}
		},
		onRegisterError(error) {
			console.error('Service worker registration error', error);
		},
	});
	const [loading, setLoading] = useState(false);

	return (
		<Dialog modal={false} open={needRefresh || TEST}>
			<DialogContent outerClassName={classes.content}>
				<div className={classes.contentInner}>
					<div className={classes.text}>
						<StarIcon />
						&nbsp;App update available!
					</div>
					<Button
						loading={loading}
						color="primary"
						onClick={async () => {
							try {
								setLoading(true);
								await updateServiceWorker(true);
							} finally {
								setLoading(false);
							}
						}}
					>
						Get the latest
					</Button>
				</div>
			</DialogContent>
		</Dialog>
	);
}
