import { Dialog, DialogContent } from '@aglio/ui/components/dialog';
import { useRegisterSW } from 'virtual:pwa-register/react';
import * as classes from './UpdatePrompt.css.js';
import { StarIcon } from '@radix-ui/react-icons';
import { useState } from 'react';
import { Button } from '@aglio/ui/components/button';
import {
	updateApp,
	updateState,
} from '@/components/updatePrompt/updateState.js';
import { useSnapshot } from 'valtio';

export interface UpdatePromptProps {}

const TEST = false;

export function UpdatePrompt({}: UpdatePromptProps) {
	const updateAvailable = useSnapshot(updateState).updateAvailable;

	const [loading, setLoading] = useState(false);

	if (!updateAvailable && !TEST) {
		return null;
	}

	return (
		<div className={classes.content}>
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
						await updateApp(true);
					} finally {
						setLoading(false);
					}
				}}
			>
				Get the latest
			</Button>
		</div>
	);
}
