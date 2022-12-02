import {
	Select,
	SelectContent,
	SelectIcon,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '@/components/primitives/select/Select.jsx';
import { hooks } from '@/stores/groceries/index.js';
import { useCallback, useEffect } from 'react';
import * as classes from './MeetupSelect.css.js';
import { Button } from '@/components/primitives/index.js';
import { Cross2Icon } from '@radix-ui/react-icons';

export interface MeetupSelectProps {}

export function MeetupSelect({}: MeetupSelectProps) {
	const info = hooks.useCollaborationInfo('default');
	hooks.useWatch(info);
	const meetup = info?.get('meetup');
	hooks.useWatch(meetup);

	const client = hooks.useClient();
	useEffect(() => {
		if (!info) {
			client.collaborationInfo.put({});
		}
	}, [info]);

	let location = meetup?.get('location');
	const createdAt = meetup?.get('createdAt') || 0;
	if (createdAt < Date.now() - 1000 * 60 * 60) {
		location = undefined;
	}

	const categories = hooks.useAllCategories();
	const options = categories.map((cat) => cat.get('name'));

	const setMeetup = useCallback(
		(value: string) => {
			info.set('meetup', {
				location: value,
			});
		},
		[info],
	);
	const clearMeetup = useCallback(() => {
		info.set('meetup', undefined);
	}, [info]);

	return (
		<div className={classes.root}>
			<label className={classes.label}>Meet up at:</label>
			<div className={classes.controls}>
				<Select value={location || ''} onValueChange={setMeetup}>
					<SelectTrigger>
						<SelectValue />
						<SelectIcon />
					</SelectTrigger>
					<SelectContent>
						<SelectItem value="" disabled>
							Select a place
						</SelectItem>
						<SelectItem value="Checkout Lanes">Checkout Lanes</SelectItem>
						<SelectItem value="Self Checkout">Self Checkout</SelectItem>
						{options.map((option) => (
							<SelectItem value={option} key={option}>
								{option}
							</SelectItem>
						))}
					</SelectContent>
				</Select>
				{!!location && (
					<Button color="ghostDestructive" onClick={clearMeetup}>
						<Cross2Icon />
					</Button>
				)}
			</div>
		</div>
	);
}
